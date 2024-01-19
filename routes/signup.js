const { addUser } = require('../controllers/users');

const router = require('express').Router();

router.post('/', addUser);

module.exports = router;