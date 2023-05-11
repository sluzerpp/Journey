const Router = require('express');
const router = new Router();
const testQuestionController = require('../controllers/testQuestionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('ADMIN'), testQuestionController.create);

router.put('/:id', authMiddleware(),testQuestionController.update);

router.get('/:id', authMiddleware(),testQuestionController.getOne); 

router.delete('/:id', authMiddleware('ADMIN'),testQuestionController.delete);

module.exports = router;