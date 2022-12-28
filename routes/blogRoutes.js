const express = require("express");
const router = express.Router();
const bcrypt=require("bcrypt");
const db=require("../app/models/index");
const Blog=db.Blog;
const { v4: uuidv4 } = require('uuid');
router.post("/",async(req,res)=>{
    try{
      if(!req.session.username)
      {
        res.status(401).send({
          message:"You need to signup/signin"
        })
      }
      else
      {
        const blog={
          PostId:uuidv4(),
          Title:req.body.title,
          Content:req.body.content,
          Category:req.body.category,
          UserUsername:req.session.username
        }
        await Blog.create(blog);
        return res.send(blog);
        
      }
  
    }
    catch(err)
    {
      return res.status(500).send({
        message:err.message||"There is some error" 
      })
    }
  })
  
  router.get("/:id",async (req,res)=>{
    try{
      const blog=await Blog.findByPk(req.params.id);
      if(!blog)
      {
        return res.send("No Such Blog Exists");
      }
      
      return res.send(blog);
    }
    catch(err)
    {
      return res.sendStatus(500).send({
        message:err.message||"Some error occurred"
      })
    }
  })
  
  router.get("/",async (req,res)=>{
    try{
        const username=req.query.username
        const description=req.query.description
        const category=req.query.category
        const title=req.query.title
        const pagesize=req.query.size||5;
        const pageno=(req.query.page-1)||0;
        const limit=pagesize;
        const offset=pagesize*pageno;
        const sort=req.query.orderby;
        console.log(description)
        const match={}
        if(username)
        {
          match.UserUsername=username;
        }
        if(description)
        {
          match.Content=
          { [db.Op.like]:`%${description}%`}
        }
        if(category)
        {
          match.Category=category;
        }
        if(title)
        {
          match.Title=title;
        }
        const order=new Array();
        if(typeof sort==="string")
        {
          order.push(sort)
        }
        else if(sort)
        {
          for(let i=0;i<sort.length;i++)
          {
            order.push([`${sort[i]}`,"DESC"]);
          }
       }
       console.log(order);
      //  order.push(["LikeCount","DESC"],["createdAt","DESC"]);
        const blogs=await Blog.findAll({
          where:match,
          limit:limit,
          offset:offset,
          order:order
        })
        return res.send(blogs);
       
    }
    catch(err)
    {
      return res.status(500).send({
        message:err.message
      })
    }
  }) 
  

  router.put("/:id",async (req,res)=>{
    try{
      var blog=await Blog.findByPk(req.params.id);
      
      if(!blog)
      {
        return res.send("No such blog exists");
      }
  
      if(blog.UserUsername!=req.session.username)
      {
        return res.status(401).send({
          message:"You are not authorised to edit this blog"
        })
      }
  
      const data=await Blog.update(
        { 
        Content:req.body.content
        },
        {
          where:{PostId:req.params.id}
        }
      )
        blog=await  Blog.findByPk(req.params.id)
        return res.send(blog);
      
    }
    catch(err)
    {
      return res.status(500).send({
        message:err.message||"Some error occurred"
      })
    }
  })
  
  router.delete("/:id",async( req,res)=>{
    try{
      const blog=await Blog.findByPk(req.params.id);
      if(!blog)
      {
        return res.send("No such blog exists");
      }
  
      if(blog.UserUsername!=req.session.username)
      {
        return res.status(401).send({
          message:"You are not authorised to edit this blog"
        })
      }
  
      const data=await Blog.destroy(
        
        {
          where:{PostId:req.params.id}
        }
      )
      
      return res.send(blog);
      
    }
    catch(err)
    {
      
      return res.sendStatus(500).send({
        message:err.message||"Some error occurred"
      })
    }
  })
  module.exports=router