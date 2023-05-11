const ApiError = require("../error/ApiError");
const { User_QuestRoute, User, QuestRoute } = require('../models/models');
const { validateState } = require("../util/validate");
const { userAddExp } = require("./user-questController");

class UserQuestRouteController {
  async create(req, res, next) {
    try {
      const { questRouteId, state } = req.body;
      const userId = req.user.id;
      if (!questRouteId) {
        return next(ApiError.badRequest('Некорректный questId!'));
      }
      const exist = await User_QuestRoute.findOne({where: {userId, questRouteId}});
      if (exist) {
        return res.json(exist);
      }
      const userQuest = await User_QuestRoute.create({ userId, questRouteId, state });
      return res.json(userQuest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page } = req.query;
      const userId = req.user.id;
      limit = limit || null;
      page = page || null;
      const user = await User.findByPk(userId);
      if (!limit && page) {
        return next(ApiError.badRequest('Указан номер страницы без указания лимита!'));
      }
      let userQuests;
      const count = await user.countQuestRoutes();
      if (!limit && !page) {
        userQuests = await user.getQuestRoutes();
      }
      if (limit && !page) {
        userQuests = await user.getQuestRoutes({limit});
      }
      if (limit && page) {
        const offset = page * limit - limit;
        userQuests = await user.getQuestRoutes({limit, offset});
      }
      return res.json({count, questRoutes: userQuests});
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const id = Number(req.params.id)
      if (isNaN(id) || id < 1)
        return next(ApiError.badRequest('Неверный ID!'));
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      const quest = await user.getQuestRoutes({where: {id}});
      res.json(quest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { state, completed } = req.body;
      if (!validateState(state)) {
        next(ApiError.badRequest('Некорректное состояние!'));
      }
      const questRouteId = Number(req.params.id);
      if (isNaN(questRouteId) || questRouteId < 1) 
        return next(ApiError.badRequest('Неверный ID!'));
      const userId = req.user.id;
      const quest = await User_QuestRoute.findOne({where: {questRouteId, userId}});
      if (!quest) {
        next(ApiError.notFound('Маршрут не найден!'));
      }
      if (completed) {
        await quest.update({completed});
      }
      switch (state) {
        case 'COMPLETED': {
          const questRoute = await QuestRoute.findByPk(quest.questRouteId);
          const count = await questRoute.countQuests();
          if (count !== quest.completed) {
            return next(ApiError.badRequest('Завершение квеста без выполнения всех квестов!' + count + ' ' + quest.completed));
          }
          userAddExp(req.user.id, questRoute.experience);
          break;
        }
      }
      quest.update({state});
      res.json(quest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new UserQuestRouteController();