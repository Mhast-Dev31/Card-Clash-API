const { Router } = require('express');
const controller = require('../controllers/user.controller');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const { userIdRule, roleRule } = require('../validators/user.validator');

const router = Router();

router.use(requireUser('ADMIN'));
router.get('/', controller.list);
router.patch('/:id/role', userIdRule, roleRule, validate, controller.changeRole);

module.exports = router;
