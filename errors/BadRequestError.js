const { HTTP_STATUS_BAD_REQUEST } = require('http2').constants;

module.exports = class BadRequestError extends Error {
  constructor (message) {
    surer(message);
    this.statusCode = HTTP_STATUS_BAD_REQUEST; //error 400
  }
};