const { login } = require('../controllers/users');

const router = require('express').Router();

router.post('/', login);

module.exports = router;