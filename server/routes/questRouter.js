const Router = require('express');
const questController = require('../controllers/questController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');
const puzzleController = require('../controllers/puzzleController');

router.post('/', authMiddleware('ADMIN'), questController.create);

router.get('/:id', authMiddleware(), questController.getOne);

router.get('/', authMiddleware(), questController.getAll);

router.put('/:id', authMiddleware('ADMIN'), questController.update);

router.get('/:id/puzzles', puzzleController.getAll);

router.delete('/:id', authMiddleware('ADMIN'), questController.delete);

module.exports = router;