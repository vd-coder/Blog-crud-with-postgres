module.exports = (sequelize, DataTypes,User,Blog) => {
    const Comment=sequelize.define('Comment',{
        CommentId:{
            type:DataTypes.STRING,
            primaryKey:true
        },
        Content:{
            type:DataTypes.STRING(400),
            allowNull:false
        }
        
      })
      Comment.belongsTo(User);
      Comment.belongsTo(Blog);
  
    return Comment;
  };
  