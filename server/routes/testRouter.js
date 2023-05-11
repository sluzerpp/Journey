const Router = require('express');
const TestController = require('../controllers/testController');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

router.post('/', authMiddleware('ADMIN'), TestController.create);

router.get('/', authMiddleware(), TestController.getAll);

router.get('/:id', authMiddleware(), TestController.getOne);

router.put('/:id', authMiddleware('ADMIN'), TestController.update);

router.delete('/:id', authMiddleware('ADMIN'), TestController.delete);

module.exports = router;