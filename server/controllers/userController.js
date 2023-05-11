const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const { User, Quest, QuestRoute, QuestRouteQuest, User_Quest, User_QuestRoute } = require('../models/models');
const uuid = require('uuid');
const path = require('path');
const { userAddExp } = require('./user-questController');
const fs = require('fs');

const generateJWT = (id, email, role) => {
  return jsonwebtoken.sign(
    {id: id, email, role}, 
    process.env.SECRET_KEY,
    {expiresIn: '24h'}
  );
}

class UserController {
  async registration(req, res, next) {
    try {
      const { nickname, email, password, role } = req.body;

      if (!email || !password || !nickname) {
        return next(ApiError.badRequest('Некорректный email, никнейм или пароль!'));
      }
      const candidate = await User.findOne({where: {email}});
      if (candidate) {
        return next(ApiError.badRequest('Пользователь с таким email уже существует!'));
      }
      let filename = 'default.jpg';
      if (req.files && req.files.avatar) {
        const { avatar } = await req.files;
        filename = uuid.v4() + '.jpg';
        avatar.mv(path.resolve(__dirname, '..', 'static', filename));
      }

      const hashPassword = await bcrypt.hash(password, 5);
      const user = await User.create({email, nickname, role, avatar: filename, password: hashPassword});
      const token = generateJWT(user.id, user.email, user.role);

      await this.checkQuests();

      return res.json({token});
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({where: {email}});
      if (!user) {
        return next(ApiError.notFound('Пользователь с таким email не найден!'));
      }
      const comparePassword = bcrypt.compareSync(password, user.password);
      if (!comparePassword) {
        return next(ApiError.badRequest('Неверный пароль!'));
      }
      const token = generateJWT(user.id, user.email, user.role);

      await this.checkQuests();
      await userAddExp(user.id, 0);

      return res.json({token});
    } catch (e) {
      next(ApiError.internal({message: e.message}));
    }
  }

  async get(req, res, next) {
    const user = await User.findOne({
      where: {id: req.user.id},
      attributes: [
        'nickname',
        'email',
        'role',
        'currentExperience',
        'experienceNextLevel',
        'level',
        'coins',
        'avatar',
        'createdAt'
      ]
    });
    if (!user) {
      return next(ApiError.notFound('Пользователь не найден!'));
    }
    res.json(user);
  }

  async check(req, res, next) {
    const token = generateJWT(req.user.id, req.user.email, req.user.role);

    await this.checkQuests();
    
    const user = await User.findByPk(req.user.id);
    await userAddExp(user.id, 0);

    return res.json({token});
  }

  async delete(req, res, next) {
    const id = Number(req.user.id);
    const user = await User.findByPk(id);
    if (!user) {
      return next(ApiError.notFound('Пользователь не найден!'));
    }
    await user.destroy();
    res.json({message: 'Пользователь успешно удалён!'});
  }

  async update(req, res, next) {
    const user = await User.findByPk(req.user.id);
    const {nickname, oldPassword, newPassword} = req.body;

    const answer = {
      nickname: {
        isChange: false,
        message: '',
      },
      password: {
        isChange: false,
        message: '',
      },
      avatar: {
        isChange: false,
        message: '',
      },
    };

    if (nickname) {
      await user.update({nickname});
      answer.nickname.isChange = true;
    }
    if (oldPassword && newPassword) {
      const comparePassword = bcrypt.compareSync(oldPassword, user.password);
      if (comparePassword) {
        const hashPassword = await bcrypt.hash(newPassword, 5);
        await user.update({password: hashPassword});
        answer.password.isChange = true;
      } else {
        answer.password.message = 'Неверный старый пароль!'
      }
    }
    if (req.files && req.files.avatar) {
      const {avatar} = req.files;
      const filename = uuid.v4() + '.jpg';
      if (user.avatar !== 'default.jpg') {
        fs.unlinkSync(path.resolve(__dirname, '..', 'static', user.avatar), () => {});
      }
      avatar.mv(path.resolve(__dirname, '..', 'static', filename));
      await user.update({avatar: filename});
      answer.avatar.isChange = true;
    }
    res.json(answer);
  }

  async checkQuests() {
    const users = await User.findAll();
    const quests = await Quest.findAll();
    const questRoutes = await QuestRoute.findAll();
    const routesQuests = [];
    for (let route of questRoutes) {
      routesQuests.push({
        route: route,
        quests: await route.getQuests(),
      });
    }
    users.forEach(async (user) => {
      await user.addQuests(quests);
      await user.addQuestRoutes(questRoutes);
      routesQuests.forEach(async (elem) => {
        const routeData = await User_QuestRoute.findOne({where: {userId: user.id, questRouteId: elem.route.id}});
        if (!routeData || routeData.completed > 0) {
          return;
        }
        elem.quests.forEach(async(quest) => {
          const association = await User_Quest.findOne({where: {userId: user.id, questId: quest.id}});
          if (association && quest['questRoute-quest'].order !== 1) {
            await association.update({state: 'UNAVAILABLE'});
          }
        });
      });
    })
  }

  async resetProgress(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      await user.update({
        currentExperience: 0,
        experienceNextLevel: 2,
        level: 0,
      });
      const questAssociations = await User_Quest.findAll({where: {userId: user.id}});
      const routeAssociations = await User_QuestRoute.findAll({where: {userId: user.id}});
      for (let assoc of questAssociations) {
        await assoc.update({state: 'AVAILABLE'});
      }
      for (let assoc of routeAssociations) {
        await assoc.update({state: 'AVAILABLE'});
      }
      res.json({message: 'Прогресс успешно сброшен!'})
    } catch (e) {
      next(ApiError.internal(e.message));
    }
  }
}

const controller = new UserController();

controller.check = controller.check.bind(controller);
controller.registration = controller.registration.bind(controller);
controller.login = controller.login.bind(controller);

module.exports = controller;