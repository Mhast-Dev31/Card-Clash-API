const { Router } = require('express');
const controller = require('../controllers/auth.controller');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const { registerRules, loginRules } = require('../validators/auth.validator');

const router = Router();

router.post('/register', registerRules, validate, controller.register);
router.post('/login', loginRules, validate, controller.login);
router.get('/me', requireUser(), controller.me);

module.exports = router;
