const router = require('express').Router();
const {
  getUsers, getUserMe, getUserById, editUserData, editUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserMe); // GET /users/me - возвращает информацию о текущем пользователе

router.get('/:userId', getUserById);
router.patch('/me', editUserData);
router.patch('/me/avatar', editUserAvatar);

module.exports = router;
