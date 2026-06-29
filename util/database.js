var Sequelize = require('sequelize');
var config = require('./config');

var sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: config.database.dialect,
    logging: config.database.logging ? console.log : false,
    define: {
      underscored: true,
      timestamps: true,
    },
  }
);

var db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
};

db.User = require('../models/User')(sequelize, Sequelize.DataTypes);

async function connectDatabase() {
  await sequelize.authenticate();

  if (config.database.sync) {
    await sequelize.sync();
  }
}

module.exports = {
  db: db,
  connectDatabase: connectDatabase,
};
