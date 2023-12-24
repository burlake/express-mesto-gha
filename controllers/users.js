const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(200).send(user); // работает - выдает карточку
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Получение пользователя с некорректным id - 400.' }); // работает
      } else if (err.name === 'DocumentNotFoundError') {
        res.status(404).send({ message: 'Получение пользователя с несуществующим в БД id - 404.' });// меняю цифру 1 цифру (24 символа)
      } else {
        res.status(500).send({ message: 'Произошла непредвиденная ошибка на сервере - 500' });
      }
    });
};

// orFail должен возвращать 404, то есть notFound,
// CastError должен обрабатываться в catch и возвращать 400.
// В случае если ошибка непредвиденная, надо возвращать 500

// .catch((err) => {
//   if (err.name === 'CastError') {
//     res.status(400).send({ message: 'Некорректный _id' }); // мало или много символов
//   } else if (err.name === 'notFoundError') {
//     res.status(404).send({ message: 'Пользователь с такми _id не найден' }); //
//   } else {
//     res.status(500).send({ message: 'Произошла ошибка на сервере.' });
//   }
// });

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user)) // возвращаем записанные в базу данные пользователю
    .catch((err) => { // если данные не записались, вернём ошибку
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
      .orFail()
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(500).send({ message: 'Произошла ошибка. Пользователь с id не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};

module.exports.editUserAvatar = (req, res) => {
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { avatar: req.body.avatar }, { new: 'true', runValidators: true })
      .orFail()
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message });
        } else {
          res.status(500).send({ message: 'Произошла ошибка. Пользователь с id не найден' });
        }
      });
  } else {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  }
};
