const bcrypt = require('bcryptjs');
const env = require('../config/env');

function hash(password) {
  return bcrypt.hash(password, env.bcryptRounds);
}

const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8.Ii4yWnZb1wB6bS2yGmV5r7Qe4W1a';

async function matches(password, passwordHash) {
  const matched = await bcrypt.compare(password, passwordHash || DUMMY_HASH);
  return Boolean(passwordHash) && matched;
}

module.exports = { hash, matches };
