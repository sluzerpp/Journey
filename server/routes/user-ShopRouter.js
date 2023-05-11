const Router = require('express');
const userShop = require('../controllers/user-shopController');
const router = new Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware('ADMIN'), userShop.create);

router.get('/', authMiddleware(), userShop.getAll);

router.get('/:id', authMiddleware(),userShop.getOne); 

router.put('/:id', authMiddleware('ADMIN'),userShop.update);

module.exports = router;