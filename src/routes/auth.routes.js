const { Router } = require('express');
const { body } = require('express-validator');
const validate = require('../middlewares/validate');
const password = require('../security/password');
const token = require('../security/token');
const userRepository = require('../repositories/user.repository');
const { badRequest, conflict, unauthorized } = require('../errors/app-error');

const router = Router();
const credentials = [
  body('school_id').isString().trim().isLength({ min: 1, max: 20 }).withMessage('school_id is required'),
  body('full_name').isString().trim().isLength({ min: 1, max: 100 }).withMessage('full_name is required'),
  body('email').isEmail().normalizeEmail().withMessage('email must be valid'),
  body('password').isString().isLength({ min: 8 }).withMessage('password must be at least 8 characters'),
];

function publicUser(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
}

router.post('/register', credentials, validate, async (req, res) => {
  const { school_id, full_name, email, password: rawPassword } = req.body;
  if (await userRepository.findBySchoolId(school_id)) {
    throw conflict('SCHOOL_ID_TAKEN', 'That school ID is already registered.');
  }
  const existingEmail = await userRepository.findByEmail(email);
  if (existingEmail) throw conflict('EMAIL_TAKEN', 'That email is already registered.');

  const user = await userRepository.create({
    school_id,
    full_name,
    email,
    password_hash: await password.hash(rawPassword),
    role: 'PLAYER',
  });
  res.status(201).json({ user: publicUser(user) });
});

router.post('/login', [
  body('school_id').isString().trim().notEmpty().withMessage('school_id is required'),
  body('password').isString().notEmpty().withMessage('password is required'),
], validate, async (req, res) => {
  const user = await userRepository.findForLogin(req.body.school_id);
  if (!user || !(await password.matches(req.body.password, user.password_hash))) {
    throw unauthorized('School ID or password is incorrect.', 'INVALID_CREDENTIALS');
  }
  res.status(200).json({ token: token.issue(user), user: publicUser(user) });
});

router.get('/me', (req, res) => {
  if (!req.account) throw unauthorized();
  res.status(200).json({ user: publicUser(req.account) });
});

module.exports = router;
