const ApiError = require('../error/ApiError');
const path = require('path');
const { Quest, Facts, Image, Puzzle, Test, TestQuestion, User_Quest } = require('../models/models');
const uuid = require('uuid');
const fs = require('fs');
const userController = require('./userController');

const questOption = (id) => ({ 
  where: {id}, 
  include: [{ model: Facts, as: 'facts' }],
})

class QuestController {
  async create(req, res, next) {
    try {
      const { name, experience, description, latitude, longitude, type } = req.body;
      const { thumbnail } = req.files;
      const filename = uuid.v4() + '.jpg';
      thumbnail.mv(path.resolve(__dirname, '..', 'static', filename));

      const quest = await Quest.create(
        {name, experience, description, isRouteQuest: false, latitude, longitude, type, thumbnail: filename}
      );

      userController.checkQuests();

      return res.json(quest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const id = req.params.id;
      if (isNaN(id) || id < 1) {
        return next(ApiError.badRequest('Некорректный id!'));
      }
      const {latitude, longitude, type, description, experience, name} = req.body;
      const quest = await Quest.findByPk(id);
      if (!quest) {
        return next(ApiError.notFound('Quest с таким id не найден!'));
      }
      if (latitude) await quest.update({latitude});
      if (longitude) await quest.update({longitude});
      if (type) await quest.update({type});
      if (description) await quest.update({description});
      if (req.files && req.files.thumbnail) {
        const {thumbnail} = req.files;
        const filename = uuid.v4() + '.jpg';
        thumbnail.mv(path.resolve(__dirname, '..', 'static', filename));
        try {
          if (quest.thumbnail !== 'default.jpg') {
            fs.unlinkSync(path.resolve(__dirname, '..', 'static', quest.thumbnail));
          }
        } catch (e) {
        }
        await quest.update({thumbnail: filename});
      } 
      if (experience) await quest.update({experience});
      if (name) await quest.update({name});
      res.json(quest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id < 1) 
        return next(ApiError.badRequest('Неверный ID!'));
      const quest = await Quest.findOne(questOption(id));
      if (!quest) 
        return next(ApiError.notFound('Квест не найден!'));
      try {
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', quest.thumbnail), () => {});
      } catch (e) {
      }
      quest.thumbnail = '';
      await this.deleteImages(id);
      await this.deletePuzzles(id);
      await User_Quest.destroy({where: {questId: id}});
      await quest.destroy();
      res.json(quest);
    } catch (e)  {
      next(ApiError.internal(e.message));
    }
  }

  async deleteImages(questId) {
    const images = await Image.findAndCountAll({where: {questId}});
    if (images.count > 0) {
      try {
        images.rows.forEach((el) => {
          fs.unlinkSync(path.resolve(__dirname, '..', 'static', el.image)); 
        });
      } catch {
      }
    }
  }

  async deletePuzzles(questId) {
    const puzzles = await Puzzle.findAndCountAll({where: {questId}});
    if (puzzles.count > 0) {
      try {
        puzzles.rows.forEach((el) => {
          fs.unlinkSync(path.resolve(__dirname, '..', 'static', el.image)); 
        });
      } catch (e) {
      }
    }
  }

  async getAll(req, res, next) {
    try {
      let { limit, page } = req.query;
      if (!limit && page) {
        return next(ApiError.badRequest('Указан номер страницы без указания лимита!'));
      }    
      let quests;
      limit = limit < 0 ? null : limit;
      page = page < 0 ? null : page;
      if (!limit && !page) {
        quests = await Quest.findAll();
      }
      if (limit && !page) {
        quests = await Quest.findAll({limit});
      }
      if (limit && page) {
        const offset = limit * page - limit;
        quests = await Quest.findAll({limit, offset})
      }
      return res.json(quests);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id < 1) 
        return next(ApiError.badRequest('Неверный ID!'));
      const quest = await Quest.findOne(questOption(id));
      if (!quest) 
        return next(ApiError.notFound('Квест не найден!'));
      return res.json(quest);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

const controller = new QuestController();
controller.delete = controller.delete.bind(controller);

module.exports = controller;