const { where } = require("sequelize");
const ApiError = require("../error/ApiError");
const { QuestRouteQuest, QuestRoute, Quest, User_Quest, Image, Facts, Test, Puzzle, TestQuestion } = require("../models/models");

class QuestRouteQuestController {
  async create(req, res, next) {
    try {
      const questRouteId = Number(req.params.id);
      if (isNaN(questRouteId) || questRouteId < 1) {
        return next(ApiError.badRequest('Некорректный id!'));
      }
      const { questId } = req.body;
      if (!questId) {
        return next(ApiError.badRequest('Некорректный questId!'));
      }
      const QuestRouteQuest = await QuestRouteQuest.create({questRouteId, questId});
      res.json(QuestRouteQuest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const questsArr = [];
      const id = Number(req.params.id);
      if (isNaN(id) || id < 1) {
        return next(ApiError.badRequest('Некорректный id!'));
      }
      const questRoute = await QuestRoute.findByPk(id);
      if (!questRoute) {
        return next(ApiError.notFound('Маршрут не найден!'));
      }
      const quests = await questRoute.getQuests({include: [
        {model: Image, as: 'images'},
        {model: Facts, as: 'facts'},
        {model: Test, as: 'tests', include: {model: TestQuestion}},
        {model: Puzzle, as: 'puzzles'},
      ]});  
      for (let quest of quests) {
        const association = await User_Quest.findOne({where: {userId: req.user.id, questId: quest.id}});
        questsArr.push({
          quest,
          'user-quest': association
        });
      }
      const count = await questRoute.countQuests();
      res.json({count, quests: questsArr});
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async check() {
    const quests = await Quest.findAll({where: {isRouteQuest: true}});
    quests.forEach(async (el) => {
      const association = await QuestRouteQuest.findOne({where: {questId: el.id}});
      if (!association || !association.questRouteId) {
        await el.update({isRouteQuest: false});
      }
    });
  }
} 

module.exports = new QuestRouteQuestController();
