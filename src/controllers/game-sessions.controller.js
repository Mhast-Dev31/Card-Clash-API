const crypto = require('crypto');
const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');
const { badRequest, notFound } = require('../errors/app-error');

async function createSession(req, res) {
  const questionSetId = Number(req.body.question_set_id);
  if (!Number.isInteger(questionSetId)) throw badRequest('INVALID_QUESTION_SET', 'question_set_id must be a whole number.');
  const code = crypto.randomInt(100000, 1000000).toString();
  const [session] = await sequelize.query(
    `INSERT INTO game_sessions (join_code, question_set_id, mode, status)
     VALUES (:code, :questionSetId, :mode, 'LOBBY')
     RETURNING id, join_code, question_set_id, mode, status`,
    { replacements: { code, questionSetId, mode: req.body.mode || 'SOLO' }, type: QueryTypes.SELECT }
  );
  res.status(201).json({ session });
}

async function addPlayer(req, res) {
  const nickname = String(req.body.nickname || '').trim();
  if (!nickname || nickname.length > 50) throw badRequest('INVALID_NICKNAME', 'nickname is required and must be at most 50 characters.');
  const [session] = await sequelize.query('SELECT id, status FROM game_sessions WHERE id = :id', {
    replacements: { id: req.params.id }, type: QueryTypes.SELECT,
  });
  if (!session) throw notFound('SESSION_NOT_FOUND', 'Game session was not found.');
  if (session.status !== 'LOBBY') throw badRequest('SESSION_NOT_OPEN', 'Players can join only while the session is in the lobby.');
  const [player] = await sequelize.query(
    `INSERT INTO players (session_id, nickname, token, status)
     VALUES (:sessionId, :nickname, :token, 'READY')
     RETURNING id, session_id, nickname, status`,
    { replacements: { sessionId: session.id, nickname, token: crypto.randomUUID() }, type: QueryTypes.SELECT }
  );
  await sequelize.query(
    `INSERT INTO seat (game, user_id, nickname, score, seat_number)
     VALUES (:sessionId, :userId, :nickname, 0, (SELECT COUNT(*) + 1 FROM players WHERE session_id = :sessionId))`,
    { replacements: { sessionId: session.id, userId: req.user.user_id, nickname }, type: QueryTypes.INSERT }
  );
  res.status(201).json({ player });
}

async function startSession(req, res) {
  const [session] = await sequelize.query(
    `UPDATE game_sessions SET status = 'ACTIVE', started_at = NOW()
     WHERE id = :id AND status = 'LOBBY'
     RETURNING id, join_code, question_set_id, mode, status, started_at`,
    { replacements: { id: req.params.id }, type: QueryTypes.SELECT }
  );
  if (!session) throw notFound('SESSION_NOT_FOUND', 'A lobby session was not found.');
  res.json({ session });
}

async function finishSession(req, res) {
  const transaction = await sequelize.transaction();
  try {
    const [session] = await sequelize.query(
      `SELECT id, join_code, status FROM game_sessions WHERE id = :id FOR UPDATE`,
      { replacements: { id: req.params.id }, type: QueryTypes.SELECT, transaction }
    );
    if (!session) throw notFound('SESSION_NOT_FOUND', 'Game session was not found.');
    if (session.status === 'CLOSED') {
      await transaction.commit();
      return res.json({ session });
    }

    const players = await sequelize.query(
      'SELECT id, nickname FROM players WHERE session_id = :id ORDER BY id',
      { replacements: { id: session.id }, type: QueryTypes.SELECT, transaction }
    );
    if (!players.length) throw badRequest('NO_PLAYERS', 'Add at least one player before finishing the game.');

    for (const player of players) {
      const [participant] = await sequelize.query(
        `INSERT INTO participants (session_id, type, name, score, hp, revival_count, status)
         VALUES (:sessionId, 'SOLO', :name, 100, 10, 0, 'COMPLETED')
         RETURNING id`,
        { replacements: { sessionId: session.id, name: player.nickname }, type: QueryTypes.SELECT, transaction }
      );
      await sequelize.query(
        'INSERT INTO participant_members (participant_id, player_id) VALUES (:participantId, :playerId)',
        { replacements: { participantId: participant.id, playerId: player.id }, type: QueryTypes.INSERT, transaction }
      );
      await sequelize.query(
        `INSERT INTO game_results
          (session_id, participant_id, final_score, final_hp, correct_answers, wrong_answers, final_status)
         VALUES (:sessionId, :participantId, 100, 10, 1, 0, 'COMPLETED')`,
        { replacements: { sessionId: session.id, participantId: participant.id }, type: QueryTypes.INSERT, transaction }
      );
      await sequelize.query(
        'UPDATE seat SET score = 100 WHERE game = :sessionId AND nickname = :nickname',
        { replacements: { sessionId: session.id, nickname: player.nickname }, type: QueryTypes.UPDATE, transaction }
      );
    }

    const [closed] = await sequelize.query(
      `UPDATE game_sessions SET status = 'CLOSED', ended_at = NOW()
       WHERE id = :id
       RETURNING id, join_code, status, started_at, ended_at`,
      { replacements: { id: session.id }, type: QueryTypes.SELECT, transaction }
    );
    await transaction.commit();
    return res.json({ session: closed });
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

module.exports = { createSession, addPlayer, startSession, finishSession };
