const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/badRequestError');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(httpConstants.HTTP_STATUS_OK).send(users))
    .catch(() => res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.status(httpConstants.HTTP_STATUS_OK).send(user); // работает - выдает карточку
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError(`Некорректный _id: ${req.params.userId}`)); // работает
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        next (new NotFoundError (`Пользователь по указанному _id: ${req.params.userId} не найден`));// меняю цифру 1 цифру (24 символа)
      } else {
        next(err);
      }
    });
};

// orFail должен возвращать 404, то есть notFound,
// CastError должен обрабатываться в catch и возвращать 400.
// В случае если ошибка непредвиденная, надо возвращать 500

module.exports.addUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(httpConstants.HTTP_STATUS_CREATED).send(user)) // возвращаем записанные в базу данные пользователю
    .catch((err) => { // если данные не записались, вернём ошибку
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(httpConstants.HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      } else {
        res.status(httpConstants.HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

module.exports.editUserData = (req, res) => {
  const { name, about } = req.body;
  if (req.user._id) {
    User.findByIdAndUpdate(req.user._id, { name, about }, { new: 'true', runValidators: true })
      .orFail()
      .then((user) => res.status(200).send(user)) // работает - 200
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(400).send({ message: err.message }); // 2 и 31 сим работает - 400
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
