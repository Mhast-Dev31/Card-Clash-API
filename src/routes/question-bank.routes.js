const { Router } = require('express');
const controller = require('../controllers/question-bank.controller');

const router = Router();

router.get('/', controller.listQuestionSets);
router.get('/:id/questions', controller.listQuestions);

module.exports = router;
