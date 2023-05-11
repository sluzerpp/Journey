const Router = require('express');
const userController = require('../controllers/userController');
const userQuestRouter = require('./user-questRouter');
const userQuestRouteRouter = require('./user-questRouteRouter');
const userShopRouter = require('./user-ShopRouter');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registration', userController.registration);

router.post('/login', userController.login);

router.get('/auth', authMiddleware(), userController.check);

router.get('/', authMiddleware(), userController.get);

router.put('/', authMiddleware(), userController.update);

router.delete('/', authMiddleware(), userController.delete);

router.put('/reset', authMiddleware(), userController.resetProgress);

router.use('/quests', authMiddleware(), userQuestRouter);

router.use('/questroutes', authMiddleware(), userQuestRouteRouter);

router.use('/shop', authMiddleware(), userShopRouter);

module.exports = router;