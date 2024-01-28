
const User = require('../models/User');

function getUserByEmail(request) {
  return User.findOne({
    email: request.body.email,
  });
}

function getUserByActivationToken(request) {
  return User.findOne({
    activationToken: request.params.activationToken,
  });
}

function getUserByRandomString(request) {
  return User.findOne({
    randomString: request.params.randomString,
  });
}

module.exports = {
  getUserByEmail,
  getUserByActivationToken,
  getUserByRandomString,
};
