const express = require("express");
const app = express();
const userRoutes=require("./routes/userRoutes");
const blogRoutes=require("./routes/blogRoutes");
const commentRoutes=require("./routes/commentRoutes");
const reactionRoutes=require("./routes/reactionRoutes");
const session=require("express-session");
const config=require("./app/config/config");
app.use(express.json());  
app.use(express.urlencoded({ extended: true }));   
const db = require("./app/models");
const { request } = require("express");
const User=db.User;
const Blog=db.Blog;
const Comment=db.Comment;
const Like=db.Like;
db.sequelize.sync();
const sessiomConfig = {
  secret: config.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 7 * 24 * 3600 * 1000,
    maxage: 7 * 24 * 3600 * 1000,
  },
};
app.use(session(sessiomConfig));
app.listen(8080,()=>{
  console.log("Server Active on Port 3000");
})
app.use("/api",userRoutes);
app.use("/api/post",blogRoutes);
app.use("/api/comments",commentRoutes);
app.all("*",reactionRoutes);
