const ApiError = require("../error/ApiError");
const { Image, Quest } = require("../models/models");
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

class ImageController {
  async create(req, res, next) {
    try {
      const { questId } = req.body;
      
      if (!req.files || !req.files.image) {
        return next(ApiError.badRequest('Отсутствует изображение!'));
      }

      const { image } = req.files;

      if (!image || !questId) {
        return next(ApiError.badRequest('Отсутствует изображение или ID квеста!'))
      }

      const quest = Quest.findByPk(questId);
      if (!quest) {
        return next(ApiError.notFound(`Квест с id ${questId} не найден!`));
      }

      const filename = uuid.v4() + '.jpg';
      const pathToImage = path.resolve(__dirname, '..', 'static', filename);
      await image.mv(pathToImage);

      const imgObj = await Image.create({image: filename, questId});
      res.json(imgObj);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id < 1) {
        return next(ApiError.badRequest('Некорректный id!'));
      }
      const images = await Image.findAll({where: {questId: id}});
      images.forEach((img) => {
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', img.image))
      });
      await Image.destroy({where: {questId: id}});
      res.json({ messsage: 'Изображения успешно удалено!' });
    } catch (e) {
      return next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    let { questId } = req.query;
    let images;
    if (questId) {
      images = await Image.findAll({where: {questId}});
    } else {
      images = await Image.findAll();
    }
    return res.json(images);
  }

  async getOne(req, res, next) {
    try {
      const id = Number(req.params.id);
      if (isNaN(id) || id < 1) 
        return next(ApiError.badRequest('Неверный ID!'));
      let img = await Image.findOne({ where: {id} });
      if (!img) return next(ApiError.notFound('Изображение не найдено!'));
      return res.json(img);
    } catch (e) {
      ApiError.internal(e.message);
    }
  }
}

module.exports = new ImageController();