const ApiError = require('../error/ApiError');
const { Facts, Quest } = require('../models/models');

class FactController {
  async create(req, res, next) {
    try {
      const { fact, questId } = req.body;
      if (!fact || !questId) 
        return next(ApiError.badRequest('Неверные данные!'));
      const quest = await Quest.findByPk(questId);
      if (!quest) {
        return next(ApiError.notFound(`Квест с id ${questId} не найден!`));
      }
      const obj = await Facts.create({ fact, questId });
      return res.json(obj);
    } catch (e) {
      next(ApiError.internal(e.message))
    }
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 1) 
      return next(ApiError.badRequest('Неверный ID!'));
    await Facts.destroy({ where: {questId: id} });
    return res.json('Факты успешно удалён!');
  }

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id < 1) 
        return next(ApiError.badRequest('Неверный ID!'));
      const factObj = await Facts.findOne({ where: {id} });
      if (!factObj)
        return next(ApiError.notFound(`Факт с id ${id} не найден!`));
      const { fact, questId } = req.body;
      if (questId) {
        const quest = await Quest.findOne({where: {id: questId}});
        if (!quest) {
          return next(ApiError.notFound(`Квест с id ${questId} не найден!`));
        }
        await factObj.update({questId});
      }
      if (fact) {
        await factObj.update({fact});
      }
      return res.json(factObj);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    let { questId } = req.query;
    let facts;
    if (questId) {
      facts = await Facts.findAll({where: {questId}});
    } else {
      facts = await Facts.findAll();
    }
    return res.json(facts);
  }

  async getOne(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id < 1) 
        return next(ApiError.badRequest('Неверный ID!'));
      let fact = await Facts.findOne({ where: {id} });
      if (!fact) return next(ApiError.notFound('Факт не найден!'));
      return res.json(fact);
    } catch (e) {
      ApiError.internal(e.message);
    }
  }
};

module.exports = new FactController;