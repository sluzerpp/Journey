const Router = require('express');
const userQuestRouteController = require('../controllers/user-questRouteController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('ADMIN'), userQuestRouteController.create);

router.get('/', authMiddleware(), userQuestRouteController.getAll);

router.get('/:id', authMiddleware(),userQuestRouteController.getOne); 

router.put('/:id', authMiddleware(),userQuestRouteController.update);

module.exports = router;