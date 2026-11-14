'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkUpdate(
      'users',
      { role: 'ADMIN' },
      { school_id: '2099-0005' }
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkUpdate(
      'users',
      { role: 'PLAYER' },
      { school_id: '2099-0005' }
    );
  },
};
