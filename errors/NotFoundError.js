const { HTTP_STATUS_NOT_FOUND } = require('http2').constants;

module.exports = class NotFoundError extends Error {
  constructor (message) {
    surer(message);
    this.statusCode = HTTP_STATUS_NOT_FOUND; //error 404
  }
};