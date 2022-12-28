
const express = require("express");
const router = express.Router();
const db=require("../app/models/index");
const Blog=db.Blog
const Like=db.Like
const { v4: uuidv4 } = require('uuid');



router.post("/api/like/:blogid",async (req,res)=>{
    try{
      if(!req.session.username)
      {
        return res.status(401).send({
          message:"You need to signup/login"
        })
      }
      const like1=await Like.findAll({
        where:{
          UserUsername:req.session.username,
          BlogPostId:req.params.blogid
        }
      })
  
      if(like1.length)
      {
        console.log(like1);
        return res.send("You already liked the post")
      }
      const blog=await Blog.findByPk(req.params.blogid);
      if(!blog)
      {
        return res.send("No such Blog exists");
      }
  
      const like={
        LikeId:uuidv4(),
        UserUsername:req.session.username,
        BlogPostId:req.params.blogid
      }
      await Like.create(like);
      await Blog.update(
        {
          LikeCount:blog.LikeCount+1
        },
        {
          where:{PostId:req.params.blogid}
        }
      )
      return res.send(like);
    }
    
    catch(err)
    {
      return res.status(500).send({
        message:err.message||"Some error occurred"
      })
    }
  })
  
  router.post("/api/unlike/:likeid",async (req,res)=>{
    try{
      if(!req.session.username)
      {
        return res.status(401).send({
          message:"You need to signup/login"
        })
      }
      const like=await Like.findByPk(req.params.likeid)
      if(!like)
      {
        return res.send("Blog is not liked")
      }
      if(like.UserUsername!=req.session.username)
      {
        
        return res.status(401).send({
          message:"You need to signup/login"
        })
      }
      
      const blog=await Blog.findByPk(like.BlogPostId);
      
      await Like.destroy(
        {
          where:{LikeId:req.params.likeid}
        }
      );
      await Blog.update(
        {
          LikeCount:blog.LikeCount-1
        },
        {
          where:{PostId:like.BlogPostId}
        }
      )
      return res.send(like)
    }
    
    catch(err)
    {
      return res.status(500).send({
        message:err.message||"Some error occurred"
      })
    }
  })

  router.all("*",(req,res)=>{
    res.send("Page Not Found");
  })
  module.exports=router;