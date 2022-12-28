module.exports = (sequelize, DataTypes) => {
    const User=sequelize.define('User',{
        Name:{
            type:DataTypes.STRING,
            allowNull:false
        },
        Username:{
            type:DataTypes.STRING,
            primaryKey:true
        },
        Password:{
            type:DataTypes.STRING,
            allowNull:false
        }
      })
  
    return User;
  };
  