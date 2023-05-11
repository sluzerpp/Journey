const Router = require('express');
const shopItemConroller = require('../controllers/shopController');
const authMiddleware = require('../middleware/authMiddleware');
const router = new Router();

router.post('/', authMiddleware('ADMIN'), shopItemConroller.create);

router.get('/', authMiddleware(), shopItemConroller.getAll);

router.put('/:id', authMiddleware('ADMIN'), shopItemConroller.update);

router.delete('/:id', authMiddleware('ADMIN'), shopItemConroller.delete);

module.exports = router;