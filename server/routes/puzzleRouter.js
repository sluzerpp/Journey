const Router = require('express');
const router = new Router();
const puzzleController = require('../controllers/puzzleController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('ADMIN'), puzzleController.create);

router.get('/', authMiddleware(),puzzleController.getAll);

router.get('/:id', authMiddleware(),puzzleController.getOne);

router.put('/:id', authMiddleware('ADMIN'),puzzleController.update); 

router.delete('/:id', authMiddleware('ADMIN'),puzzleController.delete);

module.exports = router;