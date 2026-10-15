'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cards', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },

      deck_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'decks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      color: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      card_type: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },

      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },

      question_card_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'question_cards',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },

      power_card_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'power_cards',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('cards');
  },
};