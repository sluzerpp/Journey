const ApiError = require("../error/ApiError");
const { TestQuestion } = require("../models/models");

class TestQuestionController {
  async create(req, res, next) {
    const {question, answer, testId} = req.body;
    if (!question || !answer || !testId) {
      return next(ApiError.badRequest('Некорректные question, answer или testId'));
    }
    const testQuestion = await TestQuestion.create({question, answer, testId});
    res.json(testQuestion);
  }

  async update(req, res, next) {
    const id = req.params.id;
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Некорректный id!'));
    }
    const testQuestion = await TestQuestion.findByPk(id);
    if (!testQuestion) {
      return next(ApiError.notFound('Вопрос не найден!'));
    }
    const {question, answer} = req.body;
    if (question) {
      await testQuestion.update({question});
    }
    if (answer) {
      await testQuestion.update({answer});
    }
    res.json(testQuestion);
  }

  async getOne(req, res, next) {
    //TODO
  }

  async delete(req, res, next) {
    const id = req.params.id;
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Некорректный id!'));
    }
    const testQuestion = await TestQuestion.findByPk(id);
    if (!testQuestion) {
      return next(ApiError.notFound('TestQuestion с таким id не найден!'));
    }
    await testQuestion.destroy();
    res.json({message: 'TestQuestion успешно удалён!'});
  }
}

module.exports = new TestQuestionController();