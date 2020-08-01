require('dotenv').config({path:'../.env'})
const express=require('express');
const app=express();
const jwt=require('jsonwebtoken');
const { required } = require( 'joi/lib/types/symbol' );

//app.use(express.json());
/*const posts=[
    {
    username:'vaibhavi',
    title:'post1'
    },
    {
    username:'pranav',
    title:'post2'
    }
]*/
let refreshTokens=[]
module.exports.token= (req,res,next)=>{
    const refreshToken=req.body.token
    if(refreshToken==null)return res.sendStatus(401)
    if(!refreshToken.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,user)=>{
        if(err) return res.sendStatus(401)
        const accessToken=generateAccessToken({name:user.name})
        res.json({accessToken:accessToken})
    })
}
/*app.delete("/logout",(req,res)=>{
    refreshTokens=refreshTokens.filter(token=>token!==req.body.token)
    res.sendStatus(204)
})*/
module.exports.login=(loginId)=>{
    
    const username = loginId
    const user={ name: username}
    const accessToken=generateAccessToken(user)
  const refreshToken=jwt.sign(user,process.env.REFRESH_TOKEN_SECRET)
  //save token in database
  //refreshTokens.push(refreshToken)
  //console.log({accessToken:accessToken,refreshToken:refreshToken})
 // res.send({"accessToken":accessToken,"refreshToken":refreshToken})
  return {"accessToken":accessToken,"refreshToken":refreshToken}
}

function generateAccessToken(user){
    return jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn:'180s'})
}

//app.listen(4000)

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

