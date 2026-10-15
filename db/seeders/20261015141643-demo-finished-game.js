'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const db = queryInterface.sequelize;

    /*
     * ---------------------------------------------------------
     * Helper functions
     * ---------------------------------------------------------
     */

    async function findOne(sql, replacements = {}) {
      const [row] = await db.query(sql, {
        replacements,
        type: Sequelize.QueryTypes.SELECT,
      });

      return row;
    }

    /*
     * ---------------------------------------------------------
     * 1. USERS
     *
     * Created by demo-users.js.
     * We retrieve their IDs instead of typing IDs manually.
     * ---------------------------------------------------------
     */

    const user1 = await findOne(
      `
      SELECT user_id
      FROM users
      WHERE school_id = :school_id
      `,
      { school_id: '2099-0001' }
    );

    const user2 = await findOne(
      `
      SELECT user_id
      FROM users
      WHERE school_id = :school_id
      `,
      { school_id: '2099-0002' }
    );

    const user3 = await findOne(
      `
      SELECT user_id
      FROM users
      WHERE school_id = :school_id
      `,
      { school_id: '2099-0003' }
    );

    const user4 = await findOne(
      `
      SELECT user_id
      FROM users
      WHERE school_id = :school_id
      `,
      { school_id: '2099-0004' }
    );

    if (!user1 || !user2 || !user3 || !user4) {
      throw new Error(
        'Demo users were not found. Run demo-users seeder first.'
      );
    }

    /*
     * ---------------------------------------------------------
     * 2. QUESTION SET
     * ---------------------------------------------------------
     */

    let questionSet = await findOne(
      `
      SELECT id
      FROM question_sets
      WHERE title = :title
      LIMIT 1
      `,
      {
        title: 'Card Clash Demo Questions',
      }
    );

    if (!questionSet) {
      await queryInterface.bulkInsert('question_sets', [
        {
          title: 'Card Clash Demo Questions',
          description: 'Fictional seed question set for the Card Clash demo.',
          subject: 'Computer Science',
          grade_level: 'College',
        },
      ]);
    }

    questionSet = await findOne(
      `
      SELECT id
      FROM question_sets
      WHERE title = :title
      LIMIT 1
      `,
      {
        title: 'Card Clash Demo Questions',
      }
    );

    /*
     * ---------------------------------------------------------
     * 3. POWER CARD
     * ---------------------------------------------------------
     */

    let powerCard = await findOne(
      `
      SELECT id
      FROM power_cards
      WHERE name = :name
      LIMIT 1
      `,
      {
        name: 'Demo Double Points',
      }
    );

    if (!powerCard) {
      await queryInterface.bulkInsert('power_cards', [
        {
          name: 'Demo Double Points',
          type: 'POWER_UP',
          description: 'Doubles the points earned from the next correct answer.',
          effect: 'DOUBLE_POINTS',
        },
      ]);
    }

    powerCard = await findOne(
      `
      SELECT id
      FROM power_cards
      WHERE name = :name
      LIMIT 1
      `,
      {
        name: 'Demo Double Points',
      }
    );

    /*
     * ---------------------------------------------------------
     * 4. QUESTIONS
     * ---------------------------------------------------------
     */

    const questionData = [
      {
        text: 'What does HTML stand for?',
        type: 'MULTIPLE_CHOICE',
        time_limit_sec: 20,
        difficulty: 'EASY',
      },
      {
        text: 'Which language is commonly used for server-side web development?',
        type: 'MULTIPLE_CHOICE',
        time_limit_sec: 20,
        difficulty: 'MEDIUM',
      },
      {
        text: 'Which data structure follows the FIFO principle?',
        type: 'MULTIPLE_CHOICE',
        time_limit_sec: 20,
        difficulty: 'HARD',
      },
    ];

    const questionIds = [];

    for (const question of questionData) {
      let existing = await findOne(
        `
        SELECT id
        FROM questions
        WHERE question_set_id = :question_set_id
          AND text = :text
        LIMIT 1
        `,
        {
          question_set_id: questionSet.id,
          text: question.text,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('questions', [
          {
            question_set_id: questionSet.id,
            ...question,
          },
        ]);

        existing = await findOne(
          `
          SELECT id
          FROM questions
          WHERE question_set_id = :question_set_id
            AND text = :text
          LIMIT 1
          `,
          {
            question_set_id: questionSet.id,
            text: question.text,
          }
        );
      }

      questionIds.push(existing.id);
    }

    /*
     * ---------------------------------------------------------
     * 5. CHOICES
     * ---------------------------------------------------------
     */

    const choices = [
      {
        question_id: questionIds[0],
        choice_index: 1,
        choice_text: 'HyperText Markup Language',
        is_correct: true,
      },
      {
        question_id: questionIds[0],
        choice_index: 2,
        choice_text: 'HighText Machine Language',
        is_correct: false,
      },
      {
        question_id: questionIds[0],
        choice_index: 3,
        choice_text: 'Hyperlink Text Management Language',
        is_correct: false,
      },
      {
        question_id: questionIds[1],
        choice_index: 1,
        choice_text: 'PHP',
        is_correct: true,
      },
      {
        question_id: questionIds[1],
        choice_index: 2,
        choice_text: 'HTML',
        is_correct: false,
      },
      {
        question_id: questionIds[1],
        choice_index: 3,
        choice_text: 'CSS',
        is_correct: false,
      },
      {
        question_id: questionIds[2],
        choice_index: 1,
        choice_text: 'Queue',
        is_correct: true,
      },
      {
        question_id: questionIds[2],
        choice_index: 2,
        choice_text: 'Stack',
        is_correct: false,
      },
      {
        question_id: questionIds[2],
        choice_index: 3,
        choice_text: 'Tree',
        is_correct: false,
      },
    ];

    for (const choice of choices) {
      const existing = await findOne(
        `
        SELECT id
        FROM choices
        WHERE question_id = :question_id
          AND choice_index = :choice_index
        LIMIT 1
        `,
        {
          question_id: choice.question_id,
          choice_index: choice.choice_index,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('choices', [choice]);
      }
    }

    /*
     * ---------------------------------------------------------
     * 6. QUESTION CARDS
     * ---------------------------------------------------------
     */

    const questionCardData = [
      {
        question_id: questionIds[0],
        difficulty: 'EASY',
        team_points: 100,
        solo_points: 150,
      },
      {
        question_id: questionIds[1],
        difficulty: 'MEDIUM',
        team_points: 200,
        solo_points: 300,
      },
      {
        question_id: questionIds[2],
        difficulty: 'HARD',
        team_points: 300,
        solo_points: 450,
      },
    ];

    const questionCardIds = [];

    for (const questionCard of questionCardData) {
      let existing = await findOne(
        `
        SELECT id
        FROM question_cards
        WHERE question_id = :question_id
        LIMIT 1
        `,
        {
          question_id: questionCard.question_id,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('question_cards', [
          questionCard,
        ]);

        existing = await findOne(
          `
          SELECT id
          FROM question_cards
          WHERE question_id = :question_id
          LIMIT 1
          `,
          {
            question_id: questionCard.question_id,
          }
        );
      }

      questionCardIds.push(existing.id);
    }

    /*
     * ---------------------------------------------------------
     * 7. GAME SESSION
     * ---------------------------------------------------------
     */

    let game = await findOne(
      `
      SELECT id
      FROM game_sessions
      WHERE join_code = :join_code
      LIMIT 1
      `,
      {
        join_code: '418263',
      }
    );

    if (!game) {
      await queryInterface.bulkInsert('game_sessions', [
        {
          join_code: '418263',
          question_set_id: questionSet.id,
          mode: 'SOLO',
          status: 'CLOSED',
          started_at: new Date('2026-10-09T01:00:00Z'),
          ended_at: new Date('2026-10-09T01:12:00Z'),
        },
      ]);
    }

    game = await findOne(
      `
      SELECT id
      FROM game_sessions
      WHERE join_code = :join_code
      LIMIT 1
      `,
      {
        join_code: '418263',
      }
    );

    /*
     * ---------------------------------------------------------
     * 8. SEATS
     * ---------------------------------------------------------
     */

    const users = [
      user1.user_id,
      user2.user_id,
      user3.user_id,
      user4.user_id,
    ];

    for (let i = 0; i < users.length; i++) {
      const existing = await findOne(
        `
        SELECT id
        FROM seat
        WHERE game = :game
          AND user_id = :user_id
        LIMIT 1
        `,
        {
          game: game.id,
          user_id: users[i],
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('seat', [
          {
            game: game.id,
            user_id: users[i],
            seat_number: i + 1,
            joined_at: new Date('2026-10-09T01:00:30Z'),
          },
        ]);
      }
    }

    /*
     * ---------------------------------------------------------
     * 9. PLAYERS
     *
     * Three completed.
     * One did not complete.
     * ---------------------------------------------------------
     */

    const playerData = [
      {
        nickname: 'Demo Player One',
        token: 'demo-token-001',
        status: 'COMPLETED',
      },
      {
        nickname: 'Demo Player Two',
        token: 'demo-token-002',
        status: 'COMPLETED',
      },
      {
        nickname: 'Demo Player Three',
        token: 'demo-token-003',
        status: 'COMPLETED',
      },
      {
        nickname: 'Demo Player Four',
        token: 'demo-token-004',
        status: 'LEFT',
      },
    ];

    const playerIds = [];

    for (const player of playerData) {
      let existing = await findOne(
        `
        SELECT id
        FROM players
        WHERE session_id = :session_id
          AND token = :token
        LIMIT 1
        `,
        {
          session_id: game.id,
          token: player.token,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('players', [
          {
            session_id: game.id,
            ...player,
          },
        ]);

        existing = await findOne(
          `
          SELECT id
          FROM players
          WHERE session_id = :session_id
            AND token = :token
          LIMIT 1
          `,
          {
            session_id: game.id,
            token: player.token,
          }
        );
      }

      playerIds.push(existing.id);
    }

    /*
     * ---------------------------------------------------------
     * 10. PARTICIPANTS
     *
     * One participant per player because this demo uses SOLO mode.
     * ---------------------------------------------------------
     */

    const participantData = [
      {
        name: 'Demo Player One',
        score: 600,
        hp: 10,
        revival_count: 0,
        status: 'FINISHED',
      },
      {
        name: 'Demo Player Two',
        score: 500,
        hp: 8,
        revival_count: 0,
        status: 'FINISHED',
      },
      {
        name: 'Demo Player Three',
        score: 300,
        hp: 7,
        revival_count: 1,
        status: 'FINISHED',
      },
      {
        name: 'Demo Player Four',
        score: 100,
        hp: 4,
        revival_count: 0,
        status: 'ELIMINATED',
      },
    ];

    const participantIds = [];

    for (const participant of participantData) {
      let existing = await findOne(
        `
        SELECT id
        FROM participants
        WHERE session_id = :session_id
          AND name = :name
        LIMIT 1
        `,
        {
          session_id: game.id,
          name: participant.name,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('participants', [
          {
            session_id: game.id,
            type: 'SOLO',
            ...participant,
          },
        ]);

        existing = await findOne(
          `
          SELECT id
          FROM participants
          WHERE session_id = :session_id
            AND name = :name
          LIMIT 1
          `,
          {
            session_id: game.id,
            name: participant.name,
          }
        );
      }

      participantIds.push(existing.id);
    }

    /*
     * ---------------------------------------------------------
     * 11. PARTICIPANT MEMBERS
     * ---------------------------------------------------------
     */

    for (let i = 0; i < participantIds.length; i++) {
      const existing = await findOne(
        `
        SELECT id
        FROM participant_members
        WHERE participant_id = :participant_id
          AND player_id = :player_id
        LIMIT 1
        `,
        {
          participant_id: participantIds[i],
          player_id: playerIds[i],
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('participant_members', [
          {
            participant_id: participantIds[i],
            player_id: playerIds[i],
          },
        ]);
      }
    }

    /*
     * ---------------------------------------------------------
     * 12. DECKS
     * ---------------------------------------------------------
     */

    const deckIds = [];

    for (const participantId of participantIds) {
      let existing = await findOne(
        `
        SELECT id
        FROM decks
        WHERE participant_id = :participant_id
        LIMIT 1
        `,
        {
          participant_id: participantId,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('decks', [
          {
            participant_id: participantId,
            status: 'COMPLETED',
          },
        ]);

        existing = await findOne(
          `
          SELECT id
          FROM decks
          WHERE participant_id = :participant_id
          LIMIT 1
          `,
          {
            participant_id: participantId,
          }
        );
      }

      deckIds.push(existing.id);
    }

    /*
     * ---------------------------------------------------------
     * 13. CARDS
     * ---------------------------------------------------------
     */

    const cardData = [
      {
        deck_id: deckIds[0],
        color: 'GREEN',
        card_type: 'QUESTION',
        position: 1,
        status: 'USED',
        question_card_id: questionCardIds[0],
        power_card_id: null,
      },
      {
        deck_id: deckIds[1],
        color: 'YELLOW',
        card_type: 'QUESTION',
        position: 1,
        status: 'USED',
        question_card_id: questionCardIds[1],
        power_card_id: null,
      },
      {
        deck_id: deckIds[2],
        color: 'RED',
        card_type: 'QUESTION',
        position: 1,
        status: 'USED',
        question_card_id: questionCardIds[2],
        power_card_id: null,
      },
      {
        deck_id: deckIds[3],
        color: 'GREEN',
        card_type: 'POWER',
        position: 1,
        status: 'USED',
        question_card_id: null,
        power_card_id: powerCard.id,
      },
    ];

    const cardIds = [];

    for (const card of cardData) {
      let existing = await findOne(
        `
        SELECT id
        FROM cards
        WHERE deck_id = :deck_id
          AND position = :position
        LIMIT 1
        `,
        {
          deck_id: card.deck_id,
          position: card.position,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('cards', [card]);

        existing = await findOne(
          `
          SELECT id
          FROM cards
          WHERE deck_id = :deck_id
            AND position = :position
          LIMIT 1
          `,
          {
            deck_id: card.deck_id,
            position: card.position,
          }
        );
      }

      cardIds.push(existing.id);
    }

    /*
     * ---------------------------------------------------------
     * 14. PARTICIPANT POWER CARDS
     * ---------------------------------------------------------
     */

    const powerInventory = await findOne(
      `
      SELECT id
      FROM participant_power_cards
      WHERE participant_id = :participant_id
        AND power_card_id = :power_card_id
        AND acquired_card_id = :acquired_card_id
      LIMIT 1
      `,
      {
        participant_id: participantIds[3],
        power_card_id: powerCard.id,
        acquired_card_id: cardIds[3],
      }
    );

    if (!powerInventory) {
      await queryInterface.bulkInsert('participant_power_cards', [
        {
          participant_id: participantIds[3],
          power_card_id: powerCard.id,
          acquired_card_id: cardIds[3],
          status: 'USED',
          stored_at: new Date('2026-10-09T01:04:00Z'),
        },
      ]);
    }

    /*
     * ---------------------------------------------------------
     * 15. ANSWERS
     * ---------------------------------------------------------
     */

    const answerData = [
      {
        session_id: game.id,
        card_id: cardIds[0],
        participant_id: participantIds[0],
        player_id: playerIds[0],
        selected_choice: 1,
        correct: true,
        points_earned: 150,
        hp_change: 0,
        answered_at: new Date('2026-10-09T01:02:00Z'),
      },
      {
        session_id: game.id,
        card_id: cardIds[1],
        participant_id: participantIds[1],
        player_id: playerIds[1],
        selected_choice: 2,
        correct: false,
        points_earned: 0,
        hp_change: -2,
        answered_at: new Date('2026-10-09T01:04:00Z'),
      },
      {
        session_id: game.id,
        card_id: cardIds[2],
        participant_id: participantIds[2],
        player_id: playerIds[2],
        selected_choice: 1,
        correct: true,
        points_earned: 450,
        hp_change: 0,
        answered_at: new Date('2026-10-09T01:06:00Z'),
      },
      {
        session_id: game.id,
        card_id: cardIds[3],
        participant_id: participantIds[3],
        player_id: playerIds[3],
        selected_choice: 1,
        correct: true,
        points_earned: 100,
        hp_change: 0,
        answered_at: new Date('2026-10-09T01:07:00Z'),
      },
    ];

    for (const answer of answerData) {
      const existing = await findOne(
        `
        SELECT id
        FROM answers
        WHERE card_id = :card_id
          AND participant_id = :participant_id
        LIMIT 1
        `,
        {
          card_id: answer.card_id,
          participant_id: answer.participant_id,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('answers', [answer]);
      }
    }

    /*
     * ---------------------------------------------------------
     * 16. AID REQUEST
     * ---------------------------------------------------------
     */

    let aidRequest = await findOne(
      `
      SELECT id
      FROM aid_requests
      WHERE session_id = :session_id
        AND requester_id = :requester_id
        AND target_id = :target_id
      LIMIT 1
      `,
      {
        session_id: game.id,
        requester_id: participantIds[2],
        target_id: participantIds[0],
      }
    );

    if (!aidRequest) {
      await queryInterface.bulkInsert('aid_requests', [
        {
          session_id: game.id,
          requester_id: participantIds[2],
          target_id: participantIds[0],
          status: 'ACCEPTED',
          expires_at: new Date('2026-10-09T01:07:00Z'),
        },
      ]);

      aidRequest = await findOne(
        `
        SELECT id
        FROM aid_requests
        WHERE session_id = :session_id
          AND requester_id = :requester_id
          AND target_id = :target_id
        LIMIT 1
        `,
        {
          session_id: game.id,
          requester_id: participantIds[2],
          target_id: participantIds[0],
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * 17. REVIVAL
     * ---------------------------------------------------------
     */

    let revival = await findOne(
      `
      SELECT id
      FROM revivals
      WHERE aid_request_id = :aid_request_id
      LIMIT 1
      `,
      {
        aid_request_id: aidRequest.id,
      }
    );

    if (!revival) {
      await queryInterface.bulkInsert('revivals', [
        {
          aid_request_id: aidRequest.id,
          aiding_participant_id: participantIds[0],
          outcome: 'RETAIN_20',
          revival_cost: 100,
          points_before_revival: 300,
          points_retained: 60,
          points_transferred: 0,
          processed_at: new Date('2026-10-09T01:07:30Z'),
        },
      ]);

      revival = await findOne(
        `
        SELECT id
        FROM revivals
        WHERE aid_request_id = :aid_request_id
        LIMIT 1
        `,
        {
          aid_request_id: aidRequest.id,
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * 18. COMEBACK CHALLENGE
     * ---------------------------------------------------------
     */

    let challenge = await findOne(
      `
      SELECT id
      FROM comeback_challenges
      WHERE revival_id = :revival_id
      LIMIT 1
      `,
      {
        revival_id: revival.id,
      }
    );

    if (!challenge) {
      await queryInterface.bulkInsert('comeback_challenges', [
        {
          revival_id: revival.id,
          participant_id: participantIds[2],
          time_limit_sec: 20,
          points_lost: 240,
          points_recovered: 100,
          status: 'COMPLETED',
          started_at: new Date('2026-10-09T01:08:00Z'),
          ended_at: new Date('2026-10-09T01:08:20Z'),
        },
      ]);

      challenge = await findOne(
        `
        SELECT id
        FROM comeback_challenges
        WHERE revival_id = :revival_id
        LIMIT 1
        `,
        {
          revival_id: revival.id,
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * 19. COMEBACK CARD
     * ---------------------------------------------------------
     */

    const comebackCard = await findOne(
      `
      SELECT id
      FROM comeback_cards
      WHERE challenge_id = :challenge_id
        AND question_id = :question_id
      LIMIT 1
      `,
      {
        challenge_id: challenge.id,
        question_id: questionIds[0],
      }
    );

    if (!comebackCard) {
      await queryInterface.bulkInsert('comeback_cards', [
        {
          challenge_id: challenge.id,
          question_id: questionIds[0],
          fixed_points: 100,
          status: 'USED',
        },
      ]);
    }

    /*
     * ---------------------------------------------------------
     * 20. GAME RESULTS
     * ---------------------------------------------------------
     */

    const resultData = [
      {
        participant_id: participantIds[0],
        final_score: 600,
        final_hp: 10,
        correct_answers: 1,
        wrong_answers: 0,
        power_cards_used: 0,
        revivals_used: 0,
        comeback_points: 0,
        final_status: 'COMPLETED',
      },
      {
        participant_id: participantIds[1],
        final_score: 500,
        final_hp: 8,
        correct_answers: 0,
        wrong_answers: 1,
        power_cards_used: 0,
        revivals_used: 0,
        comeback_points: 0,
        final_status: 'COMPLETED',
      },
      {
        participant_id: participantIds[2],
        final_score: 300,
        final_hp: 7,
        correct_answers: 1,
        wrong_answers: 0,
        power_cards_used: 0,
        revivals_used: 1,
        comeback_points: 100,
        final_status: 'COMPLETED',
      },
      {
        participant_id: participantIds[3],
        final_score: 100,
        final_hp: 4,
        correct_answers: 1,
        wrong_answers: 0,
        power_cards_used: 1,
        revivals_used: 0,
        comeback_points: 0,
        final_status: 'INCOMPLETE',
      },
    ];

    for (const result of resultData) {
      const existing = await findOne(
        `
        SELECT id
        FROM game_results
        WHERE session_id = :session_id
          AND participant_id = :participant_id
        LIMIT 1
        `,
        {
          session_id: game.id,
          participant_id: result.participant_id,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('game_results', [
          {
            session_id: game.id,
            ...result,
          },
        ]);
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const db = queryInterface.sequelize;

    const game = await db.query(
      `
      SELECT id
      FROM game_sessions
      WHERE join_code = '418263'
      LIMIT 1
      `,
      {
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    if (game.length === 0) {
      return;
    }

    /*
     * The foreign keys are intentionally handled through
     * the database relationships. Removing the game removes
     * its dependent records where CASCADE was configured.
     */
    await queryInterface.bulkDelete(
      'game_sessions',
      {
        join_code: '418263',
      },
      {}
    );

    await queryInterface.bulkDelete(
      'question_sets',
      {
        title: 'Card Clash Demo Questions',
      },
      {}
    );

    await queryInterface.bulkDelete(
      'power_cards',
      {
        name: 'Demo Double Points',
      },
      {}
    );
  },
};