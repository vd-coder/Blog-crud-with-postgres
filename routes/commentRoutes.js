const express = require("express");
const router = express.Router();
const db=require("../app/models/index");
const Blog=db.Blog
const Comment=db.Comment;
const { v4: uuidv4 } = require('uuid');





router.post("/:blogid",async(req,res)=>{
    try{
      if(!req.session.username)
      {
        res.status(401).send({
          message:"You need to signup/signin"
        })
      }
      else
      {
        const comment={
          CommentId:uuidv4(),
          Content:req.body.content,
          UserUsername:req.session.username,
          BlogPostId:req.params.blogid
        }
        const blog=await Blog.findByPk(req.params.blogid);
        await Comment.create(comment);
        await Blog.update(
          {
            CommentCount: blog.CommentCount+1,
          },
          {
            where: { PostId:req.params.blogid},
          }
        );
        return res.send(comment);
        
      }
  
    }
    catch(err)
    {
      return res.status(500).send({
        message:err.message||"There is some error" 
      })
    }
  })
  
  router.put("/:commentid",async (req,res)=>{
    try{
      var comment=await Comment.findByPk(req.params.commentid);
      if(!comment)
      {
        return res.send("No such comment exists");
      }
  
      if(comment.UserUsername!=req.session.username)
      {
        return res.status(401).send({
          message:"You are not authorised to edit this blog"
        })
      }
  
      const data=await Comment.update(
        { 
        Content:req.body.content
        },
        {
          where:{CommentId:req.params.commentid}
        }
      )
        comment=await Comment.findByPk(req.params.commentid);
       return res.send(comment);
      
    }
    catch(err)
    {
      return res.status(500).send({
        message:err.message||"Some error occurred"
      })
    }
  })
  
  router.delete("/:commentid",async( req,res)=>{
    try{
      const comment=await Comment.findByPk(req.params.commentid);
      if(!comment)
      {
        return res.send("No such comment exists");
      }
  
      if(comment.UserUsername!=req.session.username)
      {
        return res.status(401).send({
          message:"You are not authorised to edit this blog"
        })
      }
      
      const blog=await Blog.findByPk(comment.BlogPostId);
      
      await Comment.destroy(
        
        {
          where:{CommentId:req.params.commentid}
        }
      )
        
      await Blog.update( 
        {
          CommentCount: blog.CommentCount-1,
        },
        {
          where: { PostId:comment.BlogPostId},
        }
      );
      
      return res.send(comment);
      
    }
    catch(err)
    {
      
      return res.status(500).send({
        message:err.message||"Some error occurred"
      })
    }
  })
  router.get("/:commentid",async (req,res)=>{
    try{
      const comment=await Comment.findByPk(req.params.commentid);
      if(!comment)
      {
        return res.send("No Such Comment Exists");
      }
      
      return res.send(comment);
    }
    catch(err)
    {
      return res.sendStatus(500).send({
        message:err.message||"Some error occurred" 
      })
    }
  })
  
  router.get("/", async(req,res)=>{
    try{
      const comments=await Comment.findAll();
      res.send(comments);
    }
    catch(err)
    {
      return res.sendStatus(500).send({
        message:err.message||"Some error occurred"
      })
    }
  })
  
  module.exports=router;