require('dotenv').config({path:'../.env'})
const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');
const { required } = require( 'joi/lib/types/symbol' );

app.use(express.json());
/*
const posts=[
    {
    username:'vaibhavi',
    title:'post1'
    },
    {
    username:'pranav',
    title:'post2'
    }
]
app.get("/posts", authenticateToken,(req,res)=>{
    res.json(posts.filter(post=>post.username===req.user.name))
})
app.post("/login",(req,res)=>{
    //authenticar user
    const username=req.body.username
    const user={ name: username}
  const accessToken=jwt.sign(user,process.env.ACCESS_TOKEN_SECRET)
  res.json({accessToken:accessToken})
})*/

module.exports.authenticateToken=(req,res,next)=>{
    const authHeader=req.headers['authorization']
    const token=authHeader && authHeader.split('')[1]
    if(token==null)return res.sendStatus(401)
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        req.user=user
        next()
    })
}
module.exports.Authorization= (req,res,next)=>{
    const token=req.headers['authorization']
    //const token=//authHeader && authHeader.split('')[1]
    if(token==null)return res.send("No token ")
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(403)
        req.user=user
        next()
    })
}