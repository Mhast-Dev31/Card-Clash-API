const { UniqueConstraintError } = require('sequelize');
const env = require('../config/env');
const password = require('../security/password');
const token = require('../security/token');
const userRepository = require('../repositories/user.repository');
const { conflict, unauthorized } = require('../errors/app-error');

function toJson(user) {
  return {
    user_id: user.user_id,
    school_id: user.school_id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
  };
}

async function register(data) {
  const passwordHash = await password.hash(data.password);

  try {
    const user = await userRepository.create({
      school_id: data.school_id,
      full_name: data.full_name,
      email: data.email,
      role: 'PLAYER',
      password_hash: passwordHash,
    });
    return toJson(user);
  } catch (error) {
    if (!(error instanceof UniqueConstraintError)) throw error;

    const fields = error.errors.map((item) => item.path);
    if (fields.includes('school_id')) {
      throw conflict('SCHOOL_ID_TAKEN', 'That school ID is already registered.');
    }
    if (fields.includes('email')) {
      throw conflict('EMAIL_TAKEN', 'That email is already registered.');
    }
    throw error;
  }
}

async function login(schoolId, plainPassword) {
  const user = await userRepository.findForLogin(schoolId);
  const matches = await password.matches(plainPassword, user && user.password_hash);

  if (!matches) {
    throw unauthorized('Invalid school ID or password.', 'INVALID_CREDENTIALS');
  }

  return {
    token: token.issue(user),
    token_type: 'Bearer',
    expires_in: env.jwt.expiresIn,
    user: toJson(user),
  };
}

function current(account) {
  return toJson(account);
}

module.exports = { register, login, current, toJson };
