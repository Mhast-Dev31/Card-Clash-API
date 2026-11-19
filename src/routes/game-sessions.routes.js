const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const controller = require('../controllers/game-sessions.controller');

const router = Router();

router.post('/', requireUser(), controller.createSession);
router.post('/:id/players', requireUser(), controller.addPlayer);
router.post('/:id/start', requireUser(), controller.startSession);
router.post('/:id/finish', requireUser(), controller.finishSession);

module.exports = router;
