module.exports = (sequelize, DataTypes,User,Blog) => {
    const Like=sequelize.define("Like",{
      LikeId:{
        type:DataTypes.STRING,
        primaryKey:true
      }
    });
    Like.belongsTo(User);
    Like.belongsTo(Blog);
  
    return Like;
  };
  