const Card = require('../models/card');

module.exports.addCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      Card.findById(card._id)
        .populate('owner')
        .then((data) => res.status(201).send(data))
        .catch(() => res.status(404).send({ message: 'Карточки с таким id нет' }));
    // res.send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.getCards = (req, res) => {
  Card.find({}).sort({ createdAt: -1 })
    .populate(['owner', 'likes'])
    .then((cards) => res.status(200).send(cards))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail()
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Получение пользователя с несуществующим в БД id - 404.' });
        return;
      }
      res.send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Удаление карточки с некорректным id - 400' }); // работает
      } else {
        res.status(500).send({ message: 'Произошла непредвиденная ошибка на сервере - 500' });
      }
    });
};

// orFail должен возвращать 404, то есть notFound,
// CastError должен обрабатываться в catch и возвращать 400.
// В случае если ошибка непредвиденная, надо возвращать 500
// 404 должна выполняться в блоках orFail или then

// .catch((err) => {
//   if (err.name === 'CastError') {
//     res.status(400).send({ message: 'Получение пользователя с некорректным id.' });
//   } else if (err.name === 'DocumentNotFoundError') {
//     res.status(404).send({ message: 'Получение несуществующим в БД id - 404.' });
//   } else {
//     res.status(500).send({ message: 'Произошла непредвиденная ошибка на сервере - 500' });
//     return;
//   }
//   res.send({ message: 'Карточка удалена' });
// });
// };

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточки с таким id нет' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(500).send({ message: 'Карточки с таким id нет' }));
  } else {
    res.status(400).send({ message: 'Неверный id карточки' });
  }
};

module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
      .populate(['owner', 'likes'])
      .then((card) => {
        if (!card) {
          res.status(404).send({ message: 'Карточки с таким id нет' });
          return;
        }
        res.send(card);
      })
      .catch(() => res.status(500).send({ message: 'Карточки с таким id нет' }));
  } else {
    res.status(400).send({ message: 'Неверный id карточки' });
  }
};
