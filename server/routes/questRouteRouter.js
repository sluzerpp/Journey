const Router = require('express');
const questRouteController = require('../controllers/questRouteController');
const authMiddleware = require('../middleware/authMiddleware');
const questRoute_QuestRouter = require('./questRoute-questRouter');
const router = new Router();

router.post('/', authMiddleware('ADMIN'), questRouteController.create);

router.get('/', authMiddleware(), questRouteController.getAll);

router.get('/:id', authMiddleware(), questRouteController.getOne);

router.delete('/:id', authMiddleware('ADMIN'), questRouteController.delete);

router.put('/:id', authMiddleware('ADMIN'), questRouteController.update);

router.use('/', authMiddleware(), questRoute_QuestRouter);

module.exports = router;