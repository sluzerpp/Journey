const ApiError = require("../error/ApiError");
const { Quest, Puzzle } = require("../models/models");
const { validateDifficult } = require("../util/validate");
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');

class PuzzleController {
  async create(req, res, next) {
    try {
      const { difficult, questId } = req.body;
      
      if (!difficult && !questId) {
        return next(ApiError.badRequest('Некорректные данные!'));
      }
      if (!validateDifficult(difficult)) {
        return next(ApiError.badRequest('Некорректная сложность'))
      }
      const quest = Quest.findByPk(questId);
      if (!quest) {
        return next(ApiError.internal('Квест отсутствует!'));
      }
      let filename = 'default.jpg';
      if (req.files && req.files.image) {
        const {image} = req.files;
        filename = uuid.v4() + '.jpg';
        const pathToImage = path.resolve(__dirname, '..', 'static', filename);
        image.mv(pathToImage);
      }

      const puzzle = await Puzzle.create({ questId, difficult, image: filename });
      res.json(puzzle);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const {questId} = req.query;
      let puzzles;
      if (questId) {
        puzzles = await Puzzle.findAll({where: {questId}});
      } else {
        puzzles = await Puzzle.findAll();
      }
      res.json(puzzles);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getOne(req, res, next) {
    try {
      const questId = Number(req.params.id);
      const puzzleId = Number(req.params.puzzleId);
      if (isNaN(questId) || questId < 1) {
        return next(ApiError.badRequest('Некорректный id квеста!'));
      }
      if (isNaN(puzzleId) || puzzleId < 1) {
        return next(ApiError.badRequest('Некорректный id паззла!'));
      }
      const puzzle = Puzzle.findOne({where: {questId, id: puzzleId}});
      if (!puzzle) {
        return next(ApiError.notFound('Паззл не найден!'));
      }
      res.json(puzzle);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const puzzleId = Number(req.params.id);
      if (isNaN(puzzleId) || puzzleId < 1) {
        return next(ApiError.badRequest('Некорректный id паззла!'));
      }
      const puzzle = await Puzzle.findByPk(puzzleId);
      if (!puzzle) {
        return next(ApiError.notFound('Паззл не найден!'));
      }
      fs.unlinkSync(path.resolve(__dirname, '..', 'static', puzzle.image));
      await puzzle.destroy();
      res.json({message: 'Паззл успешно удалён!'});
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const puzzleId = Number(req.params.id);
      if (isNaN(puzzleId) || puzzleId < 1) {
        return next(ApiError.badRequest('Некорректный id паззла!'));
      }
      const puzzle = await Puzzle.findOne({where: {id: puzzleId}});
      if (!puzzle) {
        return next(ApiError.notFound('Паззл не найден!'));
      }
      console.log(req.files);
      if (req.files && req.files.image) {
        const {image} = req.files;
        const filename = uuid.v4() + '.jpg';
        image.mv(path.resolve(__dirname, '..', 'static', filename));
        if (puzzle.image !== 'default.jpg') {
          fs.unlinkSync(path.resolve(__dirname, '..', 'static', puzzle.image));
        }
        await puzzle.update({image: filename});
        console.log(filename);
        console.log('here');
      }
      const {difficult} = req.body;
      if (difficult && validateDifficult(difficult)) {
        await puzzle.update({difficult});
      }
      res.json(puzzle);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
} 

module.exports = new PuzzleController();