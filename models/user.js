const mongoose = require('mongoose');
// const validator = require('validator'); //don't work

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'Минимальная длинна 2 символа'],
    maxlength: [30, 'Максимальная длинна 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'Минимальная длинна 2 символа'],
    maxlength: [30, 'Максимальная длинна 30 символов'],
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator(v) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(v);
      },
      message: 'Введите URL',
    },
  },
  email: {
    type: String,
    required: [true, 'Поле нужно заполнить'],
    unique: true, // не работает
    validate: {
      validator(email) {
        // validator.isEmail(email);
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: 'Введите корректный адрес электронной почты',
    },
  },
  password: {
    type: String,
    require: [true],
    select: false,
  },
}, { versionKey: false, timestamps: true });

// const user = mongoose.model("user", userSchema);
// user.createIndexes();
// module.exports = user;

module.exports = mongoose.model('user', userSchema);
