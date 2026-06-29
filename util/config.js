require('dotenv').config();

function readBoolean(value, defaultValue) {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  return String(value).toLowerCase() === 'true';
}

module.exports = {
  app: {
    name: process.env.APP_NAME || 'chat-auth-service',
    port: process.env.PORT || 3000,
    clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-secret-to-a-long-random-value',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
  database: {
    dialect: process.env.DB_DIALECT || 'mysql',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    name: process.env.DB_NAME || 'chat_auth',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    logging: readBoolean(process.env.DB_LOGGING, false),
    sync: readBoolean(process.env.DB_SYNC, true),
  },
};
