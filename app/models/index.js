const dbConfig = require("../config/config.js");

const { Sequelize, DataTypes ,Op} = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.Op=Op;
db.User = require("./User")(sequelize, DataTypes);
db.Blog=require("./Blog")(sequelize,DataTypes,db.User);
db.Comment=require("./Comment")(sequelize,DataTypes,db.User,db.Blog);
db.Like=require("./Like")(sequelize,DataTypes,db.User,db.Blog);

module.exports = db;
