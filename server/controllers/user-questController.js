const ApiError = require("../error/ApiError");
const { User_Quest, User, Facts, Image, Test, TestQuestion, Puzzle, QuestRouteQuest, User_QuestRoute, Quest, QuestRoute } = require('../models/models');
const { validateState } = require("../util/validate");

class UserQuestController {
  async create(req, res, next) {
    try {
      const { questId, state } = req.body;
      const userId = req.user.id;
      if (!questId) {
        return next(ApiError.badRequest('Некорректный questId!'));
      }
      const exist = await User_Quest.findOne({where: {userId, questId}});
      if (exist) {
        return res.json(exist);
      }
      const userQuest = await User_Quest.create({ userId, questId, state });
      return res.json(userQuest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page } = req.query;
      let { takeRoutes } = req.body;
      const userId = req.user.id;
      limit = limit || null;
      page = page || null;
      const user = await User.findByPk(userId);
      if (!limit && page) {
        return next(ApiError.badRequest('Указан номер страницы без указания лимита!'));
      }
      let userQuests;
      const count = await user.countQuests({where: {isRouteQuest: false}});
      if (!limit && !page) {
        userQuests = await user.getQuests({
          where: {isRouteQuest: false},
          include: [
            {model: Image, as: 'images'},
            {model: Facts, as: 'facts'},
            {model: Test, as: 'tests', include: {model: TestQuestion}},
            {model: Puzzle, as: 'puzzles'}
          ]
      });
      }
      if (limit && !page) {
        userQuests = await user.getQuests({limit, where: {isRouteQuest: takeRoutes}, include: [{model: Image, as: 'images'}, {model: Facts, as: 'facts'}]});
      }
      if (limit && page) {
        const offset = page * limit - limit;
        userQuests = await user.getQuests({limit, offset, where: {isRouteQuest: takeRoutes}, include: [{model: Image, as: 'images'}, {model: Facts, as: 'facts'}]});
      }
      return res.json({count, quests: userQuests});
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
      const quest = await user.getQuests({where: {id}});
      res.json(quest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { state } = req.body;
      if (!validateState(state)) {
        return next(ApiError.badRequest('Некорректное состояние!'));
      }
      const questId = Number(req.params.id);
      if (isNaN(questId) || questId < 1) 
        return next(ApiError.badRequest('Неверный ID!'));
      const userId = req.user.id;
      const quest = await User_Quest.findOne({where: {questId, userId}});
      if (!quest) {
        return next(ApiError.notFound('Квест не найден!'));
      }
      if (quest.state === state) {
        return next(ApiError.badRequest('Текущее и новое состояния совпадают!'));
      }
      switch (state) {
        case 'COMPLETED': {
          const questInfo = await Quest.findByPk(quest.questId);
          if (questInfo.isRouteQuest) {
            const questData = await QuestRouteQuest.findOne({where: {questId: quest.questId}});
            if (!questData) break;
            const association = 
              await User_QuestRoute.findOne({where: {userId, questRouteId: questData.questRouteId}});
            if (!association) break;
            const nextQuestData = 
              (await QuestRouteQuest.findOne({where: {order: (questData.order + 1), questRouteId: questData.questRouteId}}));
            if (nextQuestData) {
              await association.update({completed: (association.completed + 1)});
              const nextQuestUser = await User_Quest.findOne({where: {userId, questId: nextQuestData.questId}});
              await nextQuestUser.update({state: 'AVAILABLE'});
            } else {
              await association.update({state: 'COMPLETED'});
              const route = await QuestRoute.findByPk(association.questRouteId);
              await userAddExp(userId, route.experience);
            }
          }
          await userAddExp(userId, questInfo.experience);
          break;
        }
      }
      await quest.update({state});
      res.json(quest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

async function userAddExp(id, exp) {
  const user = await User.findByPk(id);
  if (!user) return;
  await user.update({currentExperience: (user.currentExperience + exp)});
  while (user.currentExperience >= user.experienceNextLevel) {
    await user.update({
      level: (user.level + 1),
      currentExperience: user.currentExperience - user.experienceNextLevel,
      experienceNextLevel: (user.experienceNextLevel + 1),
      coins: (user.coins + (user.level + 1)),
    });
  }
}

const userQuestController = new UserQuestController();

module.exports = {
  userQuestController,
  userAddExp
};