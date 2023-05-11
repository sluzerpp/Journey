const Router = require('express');
const router = new Router();
const questRouter = require('./questRouter');
const factsRouter = require('./factRouter');
const usersRouter = require('./userRouter');
const questRouteRouter = require('./questRouteRouter');
const testRouter = require('./testRouter');
const shopRouter = require('./shopRouter');
const imageRouter = require('./imageRouter');
const puzzleRouter = require('./puzzleRouter');
const testQuestionRouter = require('./testQuestionRouter');

router.use('/facts', factsRouter);
router.use('/users', usersRouter);
router.use('/questroutes', questRouteRouter);
router.use('/quests', questRouter);
router.use('/tests', testRouter);
router.use('/shop', shopRouter);
router.use('/images', imageRouter);
router.use('/puzzles', puzzleRouter);
router.use('/testquestions', testQuestionRouter);

module.exports = router;