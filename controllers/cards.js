const Card = require('../models/card');

module.exports.addCard = (req, res) => {
  const {name, link} = req.body;
  Card.create({ name, link, owner: req.user._id })
  .then ((card) => {
    Card.findById(card._id)
    .populate('owner')
    .then((data) => res.send(data))
    .catch(() => res.status(404).send({ message: 'Карточки с таким id нет'}));
    //res.send(card);
  })
  .catch((err) => {
    if (err.name === 'ValidationError') {
      res.status(400).send({ message: err.message});
    } else {
      res.status(500).send({  message: 'На сервере произошла ошибка'});
    }
  });
};

module.exports.getCards = (req, res) => {
  Card.find ({}).sort({ createdAt: -1 })
  .populate(['owner', 'likes'])
  .then((cards) => res.status(201).send (cards))
  .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }))
};

module.exports.deleteCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndDelete(req.params.cardId) //TypeError: Card.findByIdAndRemove is not a function
    .then ((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточки с таким id нет'}); //не работает
        return;
      }
      res.send({ message: 'Карточка удалена'}); //не работает
    })
    .catch (() => res.status(404).send({ message: 'Карточки с таким id нет'})); //не работает
  } else {
    res.status(400).send({ message: 'Неверный id карточки'}) //работает
  }
};

module.exports.likeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $addToSet: {likes: req.user._id}}, {new: true})
    .populate ([ 'owner', 'likes'])
    .then ((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточки с таким id нет'});
        return;
      };
      res.send(card);
    })
    .catch (() => res.status(404).send({ message: 'Карточки с таким id нет'}));
  } else {
    res.status(400).send({ message: 'Неверный id карточки'})
  }
};

module.exports.dislikeCard = (req, res) => {
  if (req.params.cardId.length === 24) {
    Card.findByIdAndUpdate(req.params.cardId, { $pull: {likes: req.user._id}}, {new: true})
    .populate ([ 'owner', 'likes'])
    .then ((card) => {
      if (!card) {
        res.status(404).send({ message: 'Карточки с таким id нет'});
        return;
      };
      res.send(card);
    })
    .catch (() => res.status(404).send({ message: 'Карточки с таким id нет'}));
  } else {
    res.status(400).send({ message: 'Неверный id карточки'})
  }
};