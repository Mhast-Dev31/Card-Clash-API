// Reads the name of the database constraint that an insert, update or delete broke.
// Returns null when the error is not a constraint violation.
const { UniqueConstraintError, ForeignKeyConstraintError } = require('sequelize');

function constraintOf(error) {
  if (error instanceof UniqueConstraintError || error instanceof ForeignKeyConstraintError) {
    return (error.parent && error.parent.constraint) || error.index || 'unknown';
  }
  return null;
}

function mapDatabaseError(error) {
  const constraint = constraintOf(error);
  if (!constraint) return null;

  if (constraint.includes('school_id')) {
    return { status: 409, code: 'SCHOOL_ID_TAKEN', message: 'That school ID is already registered.' };
  }
  if (constraint.includes('email')) {
    return { status: 409, code: 'EMAIL_TAKEN', message: 'That email is already registered.' };
  }
  if (error instanceof ForeignKeyConstraintError) {
    return { status: 400, code: 'INVALID_REFERENCE', message: 'A referenced record does not exist.' };
  }
  return { status: 400, code: 'DATABASE_CONSTRAINT', message: 'The request violates a database rule.' };
}

module.exports = { constraintOf, mapDatabaseError };
