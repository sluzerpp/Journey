const ApiError = require("../error/ApiError");
const { User, User_ShopItem } = require('../models/models');
const { validateState } = require("../util/validate");

class UserQuestController {
  async create(req, res, next) {
    try {
      const { shopItemId, state } = req.body;
      const userId = req.user.id;
      if (!shopItemId) {
        return next(ApiError.badRequest('Некорректный questId!'));
      }
      const exist = await User_ShopItem.findOne({where: {userId, shopItemId}});
      if (exist) {
        return res.json(exist);
      }
      const userShopItem = await User_ShopItem.create({ userId, shopItemId, state });
      return res.json(userShopItem);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      const count = await user.countShopItems();
      const userShopItems = await user.getShopItems();
      return res.json({count, shopItems: userShopItems});
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
      const shopItem = await user.getShopItems({where: {id}});
      res.json(shopItem);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { state } = req.body;
      if (!validateState(state)) {
        next(ApiError.badRequest('Некорректное состояние!'));
      }
      const shopItemId = Number(req.params.id);
      if (isNaN(shopItemId) || shopItemId < 1) 
        return next(ApiError.badRequest('Неверный ID!'));
      const userId = req.user.id;
      const shopItem = await User_ShopItem.findOne({where: {shopItemId, userId}});
      if (!shopItem) {
        next(ApiError.notFound('Маршрут не найден!'));
      }
      shopItem.update({state});
      res.json(shopItem);
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

module.exports = new UserQuestController();