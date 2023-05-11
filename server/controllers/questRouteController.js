const ApiError = require("../error/ApiError");
const { QuestRoute, Quest, QuestRouteQuest, User_Quest, User_QuestRoute } = require("../models/models");

const userController = require('./userController');

class QuestRouteController {
  async create(req, res, next) {
    try {
      let { name, experience, quests } = req.body;
      console.log(name);
      console.log(experience);
      if (!name || !experience) {
        return next(ApiError.badRequest('Некорректные name или experience!'));
      }
      const questRoute = await QuestRoute.create({name, experience});
      if (quests.length && quests.length > 0) {
        quests = [...quests];
        await quests.forEach(async (id, index) => {
          const quest = await Quest.findOne({where: {id}});
          if (quest && !quest.isRouteQuest) {
            await questRoute.addQuest(quest);
            await quest.update({isRouteQuest: true});
            if (index !== 0) {
              const assosiation = await User_Quest.findAll({where: {questId: quest.id, userId: req.user.id}});
              if (assosiation) {
                assosiation.forEach((el) => {
                  el.update({state: 'UNAVAILABLE'});
                })
              }
            }
            if (index === 0) {
              await questRoute.update({longitude: quest.longitude, latitude: quest.latitude});
            }
            const ass = await QuestRouteQuest.findOne({where: {questId: quest.id, questRouteId: questRoute.id}});
            await ass.update({order: index + 1});
          }
        });
      }
      await userController.checkQuests();
      res.json(questRoute);
    } catch (e) { 
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const questRoutes = await QuestRoute.findAll({include: {model: Quest, as: 'quests', attributes: ['id']}});
      res.json(questRoutes);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id < 1) {
        return next(ApiError.badRequest('Некорректный id!'));
      }
      const questRoute = await QuestRoute.findOne({where: id, include: {model: Quest, as: 'quests'}});
      if (!questRoute) {
        return next(ApiError.notFound('Маршрут не найден!'));
      }
      res.json(questRoute);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)  || id < 1) {
        return next(ApiError.badRequest('Некорректный id!'));
      }
      const questRoute = await QuestRoute.findByPk(id);
      if (!questRoute) {
        return next(ApiError.notFound('Маршрут не найден!'));
      }
      const QuestRouteQuests = await QuestRouteQuest.findAll({where: {questRouteId: id}});
      QuestRouteQuests.forEach(async (elem) => {
        const quest = await Quest.findByPk(elem.questId);
        if (quest) {
          quest.update({isRouteQuest: false});
        }
      })
      await QuestRouteQuest.destroy({where: {questRouteId: id}});
      await questRoute.destroy();
      res.json('Маршрут успешно удалён!');
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)  || id < 1) {
        return next(ApiError.badRequest('Некорректный id!'));
      }
      const questRoute = await QuestRoute.findByPk(id);
      if (!questRoute) {
        return next(ApiError.notFound('Маршрут не найден!'));
      }
      let {name, experience, quests} = req.body;
      if (name) {
        await questRoute.update({name});
      }
      if (experience && experience > 0) {
        await questRoute.update({experience});
      }
      if (quests) {
        quests = [...quests];
        if (quests instanceof Array) {
          for (let quest of quests) {
            const oldAssoc = await QuestRouteQuest.findOne({where: {questId: quest.id}});
            if (oldAssoc && oldAssoc.questRouteId !== questRoute.id) {
              return next(ApiError.badRequest(`Квест ${quest.id} принадлежит другому маршруту!`));
            }
          }
          const associations = await QuestRouteQuest.findAll({where: {questRouteId: id}});
          for (let assoc of associations) {
            const quest = await Quest.findByPk(assoc.questId);
            const userQuests = await User_Quest.findAll({where: {questId: quest.id}});
            await Promise.all(userQuests.map(async (user) => {
              await user.update({state: 'AVAILABLE'});
            }));
            if (quest) {
              await quest.update({isRouteQuest: false});
            }
            await assoc.destroy();
          }
          for (let quest of quests) {
            const questObj = await Quest.findByPk(quest.id);
            await QuestRouteQuest.create({
              questId: quest.id,
              questRouteId: questRoute.id,
              order: quest["questRoute-quest"].order,
            });
            await questObj.update({isRouteQuest: true});
          }
          const userRoutes = await User_QuestRoute.findAll({where: {questRouteId: questRoute.id}});
          for (let route of userRoutes) {
            await route.update({completed: 0, state: 'AVAILABLE'});
          }
        }
      }
      res.json({message: 'Успешно изменён!'});
    } catch (e) {
      console.log(e);
      next(ApiError.internal(e));
    }
  }
}

module.exports = new QuestRouteController();