const ApiError = require("../error/ApiError");
const { Test, TestQuestion } = require("../models/models");

class TestController {
  async create(req, res, next) {  
    try {
      let {name, testQuestions, questId} = req.body;
      testQuestions = [...testQuestions];
      if (!name || !questId) {
        return next(ApiError.badRequest('Некорректные name, questId'));
      }
      let test = await Test.create({name, questId});
      if (testQuestions.length || testQuestions.length > 0) {
        await testQuestions.forEach(async (testQuestion) => {
          await TestQuestion.create({...testQuestion, testId: test.id});
        });
      }
      test = await Test.findOne({where: {id: test.id}, attributes: ['id', 'name', 'questId']});
      testQuestions = await TestQuestion.findAndCountAll({where: {testId: test.id}, attributes: ['id','question','answer']});
      res.json({test, questions: testQuestions});
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 1) {
      return next(ApiError.badRequest('Некорректный id!'));
    }
    const test = await Test.findOne({where: {id}, attributes: ['id', 'name', 'isCompleted', 'questId']});
    if (!test) {
      return next(ApiError.notFound('Тест с таким id не найден!'));
    }
    const testQuestions = await TestQuestion.findAndCountAll({where: {testId: test.id}, attributes: ['id','question','answer']});
    res.json({test, questions: testQuestions});
  }

  async getAll(req, res, next) {
    const {questId} = req.query; 
    const tests = await Test.findAll({where: {questId}, include: {model: TestQuestion}})
    res.json(tests);
  }

  async update(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 1) {
      return next(ApiError.badRequest('Некорректный id!'));
    }
    const { name } = req.body;
    const test = await Test.findByPk(id);
    if (!test) {
      return next(ApiError.notFound('Тест с таким id не найден!'));
    }
    if (name) {
      await test.update({name});
    }
    res.json(test);
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 1) {
      return next(ApiError.badRequest('Некорректный id!'));
    }
    const test = await Test.findByPk(id);
    if (!test) {
      return next(ApiError.notFound('Тест с таким id не найден!'));
    }
    await TestQuestion.destroy({where: {testId: test.id}});
    await test.destroy();
    res.json({message: 'Тест успешно удалён!'});
  }
}

module.exports = new TestController();