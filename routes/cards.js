const router = require('express').Router();
const {
  addCard, getCards, deleteCard, likeCard, dislikeCard
} = require ('../controllers/cards');

router.get ('/', getCards);
router.post('/', addCard);
router.delete ('/:cardId', deleteCard);
router.put ('/:cardId/likes', likeCard);
router.delete ('/:cardId/likes', dislikeCard);

module.exports = router;



// GET /cards — возвращает все карточки
// POST /cards — создаёт карточку
// DELETE /cards/:cardId — удаляет карточку по идентификатору
// PUT /cards/:cardId/likes — поставить лайк карточке
// DELETE /cards/:cardId/likes — убрать лайк с карточки