const { mapDatabaseError } = require('../errors/db-errors');

function errorHandler(err, req, res, next) {
  console.error(err);

  const databaseError = mapDatabaseError(err);

  if (databaseError) {
    return res.status(databaseError.status).json({
      error: {
        code: databaseError.code,
        message: databaseError.message,
      },
    });
  }

  const status = err.status || 500;
  const isServerFault = status >= 500;

  return res.status(status).json({
    error: {
      code: isServerFault ? 'INTERNAL_ERROR' : err.code || 'BAD_REQUEST',
      message: isServerFault
        ? 'Something went wrong on the server.'
        : err.message,
    },
  });
}

module.exports = errorHandler;