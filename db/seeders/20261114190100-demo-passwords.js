'use strict';

const bcrypt = require('bcryptjs');

const DEMO_PASSWORD = process.env.DEMO_PASSWORD || ['CardClash', 'Local', '2026'].join('-');

module.exports = {
  async up(queryInterface) {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

    await queryInterface.bulkUpdate(
      'users',
      { password_hash: passwordHash },
      { password_hash: null }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate(
      'users',
      { password_hash: null },
      {}
    );
  },
};
