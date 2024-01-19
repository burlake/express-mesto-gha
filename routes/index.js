const router = require('express').Router();
const usersRouter = require('./users');
const cardsRouter = require('./cards');
const signupRouter = require('./signup');

router.use('/signup', signupRouter);
router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

module.exports = router;