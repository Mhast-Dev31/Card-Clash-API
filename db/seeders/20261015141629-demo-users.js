'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const db = queryInterface.sequelize;

    const users = [
      {
        school_id: '2099-0001',
        full_name: 'Demo Player One',
        email: 'demo.player.one@test',
        role: 'PLAYER',
      },
      {
        school_id: '2099-0002',
        full_name: 'Demo Player Two',
        email: 'demo.player.two@test',
        role: 'PLAYER',
      },
      {
        school_id: '2099-0003',
        full_name: 'Demo Player Three',
        email: 'demo.player.three@test',
        role: 'PLAYER',
      },
      {
        school_id: '2099-0004',
        full_name: 'Demo Player Four',
        email: 'demo.player.four@test',
        role: 'PLAYER',
      },
      {
        // This account intentionally never joins the demo game.
        // This satisfies the "awkward case" requirement.
        school_id: '2099-0005',
        full_name: 'Demo Player Never Joined',
        email: 'demo.never.joined@test',
        role: 'PLAYER',
      },
    ];

    for (const user of users) {
      const [existing] = await db.query(
        `
        SELECT user_id
        FROM users
        WHERE school_id = :school_id
        LIMIT 1
        `,
        {
          replacements: {
            school_id: user.school_id,
          },
          type: Sequelize.QueryTypes.SELECT,
        }
      );

      if (!existing) {
        await queryInterface.bulkInsert('users', [
          {
            ...user,
            created_at: new Date(),
          },
        ]);
      }
    }
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete(
      'users',
      {
        school_id: {
          [require('sequelize').Op.in]: [
            '2099-0001',
            '2099-0002',
            '2099-0003',
            '2099-0004',
            '2099-0005',
          ],
        },
      },
      {}
    );
  },
};