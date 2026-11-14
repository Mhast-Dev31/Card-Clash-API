'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint('users', {
      type: 'unique',
      name: 'uq_users_school_id',
      fields: ['school_id'],
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint('users', 'uq_users_school_id');
  },
};
