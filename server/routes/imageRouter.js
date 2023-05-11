const Router = require('express');
const router = new Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('ADMIN'), imageController.create);

router.get('/', authMiddleware(),imageController.getAll);

router.get('/:id', authMiddleware(),imageController.getOne); 

router.delete('/:id', authMiddleware('ADMIN'),imageController.delete);

module.exports = router;