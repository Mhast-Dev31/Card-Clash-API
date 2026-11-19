const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const { toOffset, envelope } = require('../utils/paginate');

async function listQuestionSets(req, res) {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const { offset } = toOffset({ page, limit });
  const [rows, count] = await Promise.all([
    sequelize.query(
      'SELECT id, title, description, subject, grade_level FROM question_sets ORDER BY id LIMIT :limit OFFSET :offset',
      { replacements: { limit, offset }, type: QueryTypes.SELECT }
    ),
    sequelize.query('SELECT COUNT(*)::int AS total FROM question_sets', { type: QueryTypes.SELECT }),
  ]);
  res.json(envelope(rows, count[0].total, { page, limit }));
}

async function listQuestions(req, res) {
  const rows = await sequelize.query(
    `SELECT q.id, q.question_set_id, q.text, q.type, q.time_limit_sec, q.difficulty,
            COALESCE(json_agg(json_build_object('id', c.id, 'text', c.choice_text, 'is_correct', c.is_correct)
              ORDER BY c.id) FILTER (WHERE c.id IS NOT NULL), '[]') AS choices
       FROM questions q
       LEFT JOIN choices c ON c.question_id = q.id
      WHERE q.question_set_id = :questionSetId
      GROUP BY q.id
      ORDER BY q.id`,
    { replacements: { questionSetId: req.params.id }, type: QueryTypes.SELECT }
  );
  res.json({ data: rows });
}

module.exports = { listQuestionSets, listQuestions };
