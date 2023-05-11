const Router = require('express');
const router = new Router();
const controller = require('../controllers/questRoute-questController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:id/quests', authMiddleware(), controller.getAll);

router.post('/:id/quests', authMiddleware('ADMIN'), controller.create);

module.exports = router;