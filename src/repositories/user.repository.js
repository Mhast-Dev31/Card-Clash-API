const { User } = require('../models');

function findBySchoolId(schoolId) {
  return User.findOne({ where: { school_id: schoolId } });
}

function findForLogin(schoolId) {
  return User.scope('withPassword').findOne({ where: { school_id: schoolId } });
}

function findByEmail(email) {
  return User.findOne({ where: { email } });
}

function findById(userId) {
  return User.findByPk(userId);
}

function create(data) {
  return User.create(data);
}

module.exports = { findBySchoolId, findForLogin, findByEmail, findById, create };
