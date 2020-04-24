if (process.env.NODE_ENV === 'development') {
  const result = require('dotenv').config();

  if (result.error) {
    throw result.error;
  }

  const { parsed: env } = result;

  module.exports = env;
} else {
  module.exports = process.env;
}
