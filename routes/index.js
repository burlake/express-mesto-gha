const router = require('express').Router();

const usersRouter = require('./users'); //ПРОВЕРИТЬ ОШИБКУ С ПУТЯМИ к ФАЙЛУ
const cardsRouter = require('./cards'); //ПРОВЕРИТЬ ОШИБКУ С ПУТЯМИ к ФАЙЛУ

router.use('./users.js', usersRouter); //ПРОВЕРИТЬ ОШИБКУ С ПУТЯМИ к ФАЙЛУ
router.use('./cards.js', cardsRouter); //ПРОВЕРИТЬ ОШИБКУ С ПУТЯМИ к ФАЙЛУ

module.exports = router;