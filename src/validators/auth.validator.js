const { body } = require('express-validator');

const schoolIdRule = body('school_id')
  .isString()
  .withMessage('school_id must be text.')
  .trim()
  .matches(/^[A-Za-z0-9][A-Za-z0-9-]{2,19}$/)
  .withMessage('school_id must be 3 to 20 letters, numbers or hyphens.');

const passwordRule = body('password')
  .isString()
  .withMessage('password must be text.')
  .isLength({ min: 8, max: 72 })
  .withMessage('password must be 8 to 72 characters.')
  .matches(/[A-Za-z]/)
  .withMessage('password must contain a letter.')
  .matches(/[0-9]/)
  .withMessage('password must contain a number.');

const registerRules = [
  schoolIdRule,
  body('full_name')
    .isString()
    .withMessage('full_name must be text.')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('full_name must be 2 to 100 characters.'),
  body('email')
    .isEmail()
    .withMessage('email must be valid.')
    .normalizeEmail()
    .isLength({ max: 255 })
    .withMessage('email must be at most 255 characters.'),
  passwordRule,
];

const loginRules = [
  schoolIdRule,
  body('password')
    .isString()
    .withMessage('password must be text.'),
];

module.exports = { registerRules, loginRules };
