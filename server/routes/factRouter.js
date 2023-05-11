const Router = require('express');
const router = new Router();
const factController = require('../controllers/factController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('ADMIN'), factController.create);

router.get('/', authMiddleware(),factController.getAll);

router.get('/:id', authMiddleware(),factController.getOne); 

router.delete('/:id', authMiddleware(),factController.delete);

router.put('/:id', authMiddleware('ADMIN'),factController.update);

module.exports = router;