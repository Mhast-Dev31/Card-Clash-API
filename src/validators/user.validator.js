const { body, param } = require('express-validator');

const userIdRule = param('id')
  .isInt({ min: 1 })
  .withMessage('id must be a positive whole number.')
  .toInt();

const roleRule = body('role')
  .isIn(['PLAYER', 'HOST', 'ADMIN'])
  .withMessage('role must be PLAYER, HOST or ADMIN.');

module.exports = { userIdRule, roleRule };
