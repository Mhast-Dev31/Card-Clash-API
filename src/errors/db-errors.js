// Reads the name of the database constraint that an insert, update or delete broke.
// Returns null when the error is not a constraint violation.
const { UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');
const { conflict } = require('./app-error');

function constraintOf(error) {
  if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError) {
    return (error.parent && error.parent.constraint) || error.index || 'unknown';
  }
  return null;
}

function mapDatabaseError(error) {
  const constraint = constraintOf(error);
  if (!constraint) return null;

  if (constraint === 'users_school_id_key' || constraint === 'uq_users_school_id') {
    return conflict('SCHOOL_ID_TAKEN', 'That school ID is already registered.');
  }
  if (constraint === 'uq_users_email' || constraint === 'users_email_key') {
    return conflict('EMAIL_TAKEN', 'That email is already registered.');
  }
  return conflict('CONSTRAINT_VIOLATION', 'The request conflicts with existing data.');
}

module.exports = { constraintOf, mapDatabaseError };
