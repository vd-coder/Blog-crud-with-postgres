const express = require("express");
const router = express.Router();
const bcrypt=require("bcrypt");
const db=require("../app/models/index");
const User=db.User;
const Blog=db.Blog
const Comment=db.Comment;
router.post("/signup",async(req,res)=>{
  try{
    plainpass=req.body.password;
    salt=await bcrypt.genSalt(12);
    hash=await bcrypt.hash(plainpass,salt);
    const user={
      Name:req.body.name,
      Username:req.body.username,
      Password:hash
    }
    
      const data=await User.create(user);
      req.session.username=req.body.username;
      res.send(data);
    }
    catch(err)
    {
      console.log(err);
      res.status(400).send({
        message:err.message||"There is something wrong"
      })
    }
  })
  
  router.post("/login",async (req,res)=>{
    try{
    const user=await User.findByPk(req.body.username);
    const hash=user.Password;
    const password=req.body.password;
    
      const match=await bcrypt.compare(password,hash);
      if(match)
      {
         req.session.username=req.body.username;
         return res.send(user);
      
      }
      else
      {
        return res.status(401).send({
          message:"Wrong Username or Password"
        })
        
      }
    }
    catch(err)
    {
      return res.status(500).send({
        message:err.message||"Something wrong Occurred"
      })
      
    }
  })

  router.get("/users/:username",async(req,res)=>{
    try{
      const user=await User.findByPk(req.params.username);
      const blogs=await Blog.findAll({where:{UserUsername:req.params.username}});
      const comments=await Comment.findAll({where:{UserUsername:req.params.username}});
      return res.send({
        Name:user.Name,
        blogs:blogs,
        comments:comments
      });
      
  
    }
    catch(err)
    {
      return res.send(err.message);
    }
  })
  
  module.exports=router;