const userRepository = require('../repositories/user.repository');
const { conflict, notFound } = require('../errors/app-error');
const { toJson } = require('./auth.service');

async function list() {
  const users = await userRepository.findAll();
  return users.map(toJson);
}

async function changeRole(actor, userId, role) {
  if (actor.user_id === userId) {
    throw conflict('SELF_ROLE_CHANGE', 'An admin cannot change their own role.');
  }

  const user = await userRepository.findById(userId);
  if (!user) throw notFound('USER_NOT_FOUND', 'That user does not exist.');

  const updated = await userRepository.update(user, { role });
  return toJson(updated);
}

module.exports = { list, changeRole };
