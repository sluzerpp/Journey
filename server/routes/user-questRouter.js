const Router = require('express');
const {userQuestController} = require('../controllers/user-questController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('ADMIN'), userQuestController.create);

router.get('/', authMiddleware(), userQuestController.getAll);

router.get('/:id', authMiddleware(),userQuestController.getOne); 

router.put('/:id', authMiddleware(),userQuestController.update);

module.exports = router;