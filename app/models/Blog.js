module.exports=(sequelize, DataTypes,User)=>{
        const Blog=sequelize.define('Blog',{
        PostId:{
            type:DataTypes.STRING,
            primaryKey:true
        },
        Title:{
            type:DataTypes.STRING,
            allowNull:false
            
        },
        Content:{
            type:DataTypes.STRING(1000),
            allowNull:false
        },
        Category:
        {
            type:DataTypes.STRING
        },
        LikeCount:{
            type:DataTypes.INTEGER,
            defaultValue:0
        },
        CommentCount:{
            type:DataTypes.INTEGER,
            defaultValue:0
        }


    })
    Blog.belongsTo(User);
    return Blog;
}