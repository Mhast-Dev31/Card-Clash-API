const { matchedData } = require('express-validator');
const userService = require('../services/user.service');

async function list(req, res) {
  res.status(200).json({ users: await userService.list() });
}

async function changeRole(req, res) {
  const data = matchedData(req, { locations: ['params', 'body'] });
  const user = await userService.changeRole(req.user, data.id, data.role);
  res.status(200).json({ user });
}

module.exports = { list, changeRole };
