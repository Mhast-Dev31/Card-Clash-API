const jwt = require('jsonwebtoken');
const env = require('../config/env');

function issue(user) {
  return jwt.sign(
    { sub: String(user.user_id), role: user.role },
    env.jwt.secret,
    { algorithm: 'HS256', expiresIn: env.jwt.expiresIn }
  );
}

function verify(value) {
  return jwt.verify(value, env.jwt.secret, { algorithms: ['HS256'] });
}

module.exports = { issue, verify };
