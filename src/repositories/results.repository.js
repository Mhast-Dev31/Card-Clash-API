'use strict';

const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT
      gs.join_code AS session_code,
      gs.started_at,
      gs.ended_at,
      u.school_id,
      s.nickname,
      s.score,

      EXISTS (
        SELECT 1
        FROM participant_members pm
        JOIN game_results gr
          ON gr.participant_id = pm.participant_id
         AND gr.session_id = gs.id
        WHERE pm.player_id = p.id
      ) AS completed

    FROM game_sessions gs

    JOIN seat s
      ON s.game = gs.id

    JOIN users u
      ON u.user_id = s.user_id

    JOIN players p
      ON p.session_id = gs.id
     AND p.nickname = s.nickname

    WHERE gs.status = 'CLOSED'
      AND (
        CAST(:since AS timestamptz) IS NULL
        OR gs.ended_at > CAST(:since AS timestamptz)
      )

    ORDER BY gs.ended_at, s.score DESC;
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: {
      since: since ? since.toISOString() : null,
    },
  });
}

module.exports = { findFinishedGamePlayers };