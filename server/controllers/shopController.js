const ApiError = require("../error/ApiError");
const { User, ShopItem } = require("../models/models");

class ShopController {
  async create(req, res, next) {
    const {name, type, value} = req.body;
    if (!name || !type || !value) {
      next(ApiError.badRequest('Некорректные name, type или value!'));
    }
    const shopItem = await ShopItem.create({name, type, value});
    res.json(shopItem);
  }

  async update(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Некорректный id!'));
    }
    const {name, type, value} = req.body;
    const shopItem = await ShopItem.findByPk(id);
    if (!shopItem) {
      return next(ApiError.notFound('ShopItem с таким id не найден!'));
    }
    if (name) await shopItem.update({name});
    if (type) await shopItem.update({type});
    if (value) await shopItem.update({value});
    res.json(shopItem);
  }

  async getAll(req, res, next) {
    const shopItems = await ShopItem.findAndCountAll();
    res.json(shopItems);
  }

  async delete(req, res, next) {
    const id = Number(req.params.id);
    if (isNaN(id) || id < 0) {
      return next(ApiError.badRequest('Некорректный id!'));
    }
    const shopItem = await ShopItem.findByPk(id);
    if (!shopItem) {
      return next(ApiError.notFound('ShopItem с таким id не найден!'));
    }
    await shopItem.destroy();
    res.json({message: 'ShopItem успешно удалён!'});
  }
}

module.exports = new ShopController();