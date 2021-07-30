const express = require('express');
const router=express.Router();
const mongoose=require('mongoose');
const User=mongoose.model("User");
const crypto=require('crypto')
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../keys');
const requireLogin=require('../middleware/requireLogin');
const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport')//we are using sendgrid to send mails for forgot password
//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  ->sendgrid api(for emails)

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
        api_key:"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"
    }
}))

//we should give user a token when signed in bcz when user is signedin we should give user the access to protected resources
//so if user has that same token then he will be given access to that resources

router.get('/',(req,res)=>{
    res.send("hello");
    console.log("req.body.name");
});

/*router.get('/protected',requireLogin,(req,res)=>{ //suppose this is aprotected resource and user should be able to get this resource only when user is logged in
    //i.e. user should have a token, so user should come along the token that we provided it, so we should first verify the user if the token is
    //same as we provided and to verify that we will create a middleware(middleware folder)
    res.send("hello protected");
});*/

router.post('/signup',(req,res)=>{
    const {name,email,password,pic}=req.body;
    console.log(req.body);
    if(!email || !password || !name){ //we dont need to check for profile pic coz thats an optional thing
        return res.status(422).json({error:"please add all the fields"}) //422 means server has understood the request but server cannot process it
    }
    User.findOne({email:email}).then((savedUser)=>{
        if(savedUser){
            return res.status(422).json({error:"user already exists with that email"});
        }
        bcrypt.hash(password,12)
        .then(hashedpassword=>{
            const user=new User({
                email:email,
                password:hashedpassword,
                name:name,
                pic:pic
            });
            user.save().then(user=>{
                transporter.sendMail({
                    to:user.email,
                    from:"miliniagupta@gmail.com",
                    subject:"signup success",
                    html:"<h1>Welcome to instagram</h1>"
                })
                res.json({message:"saved successfully"})
            })
            .catch(err=>{
                console.log(err);
            })
        })
    })
    .catch(err=>{
        console.log(err);
    })
});

router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        return res.status(422).json({error:"please add email or password"});
    }
    User.findOne({email:email})
    .then(savedUser=>{
        if(!savedUser){
            return res.status(422).json({error:"Invalid Email or password"});
        }
        bcrypt.compare(password,savedUser.password)
        .then(doMatch=>{
            if(doMatch){
                // res.json({message:"Successfully signed in"});
                const token=jwt.sign({_id:savedUser._id},JWT_SECRET) //we are generating a token basec on user id and then we are assigning it in _id
                //now we got the token and we can response the user with that token
                const {_id,name,email,followers,following,pic}=savedUser;
                res.json({token, user:{_id,name,email,followers,following,pic}})
            }
            else{
                return res.status(422).json({error:"Invalis Email or passwword"});
            }
        })
        .catch(err=>{
            console.log(err);
        })
    })
})

router.post('/reset-password',(req,res)=>{
    //we need to generate a unique token for that we can use crypto module that is inbuilt in nodejs
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            console.log(err);
        }
        const token=buffer.toString("hex")//toekn will be in hexadecimal form so convert that into string
        User.findOne({email:req.body.email})
        .then(user=>{
            if(!user){
                return res.status(422).json({error:"User dont exists with that email"})
            }
            user.resetToken = token
            user.expireToken = Date.now() + 3600000 //means after receiving mail user can reset password within 24 hrs that is 3600000 seconds
            user.save().then((result)=>{
                transporter.sendMail({
                    to:user.email,
                    from:"miliniagupta@gmail.com",
                    subject:"password reset",
                    html:`
                    <p>You requested for password reset</p>
                    <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset password</h5>
                    `
                })
                // console.log(user.email);
                res.json({message:"check your email"})
            })
        })
    })
})

router.post('/new-password',(req,res)=>{
    const newPassword = req.body.password
    const sentToken = req.body.token
    User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
    .then(user=>{
        if(!user){//if session has expired or the time afetr mail was sent is passed 1hr
            return res.status(422).json({error:"Try again session expired"})
        }
        bcrypt.hash(newPassword,12).then(hashedpassword=>{
           user.password = hashedpassword
           user.resetToken = undefined
           user.expireToken = undefined
           user.save().then((saveduser)=>{
               res.json({message:"password updated success"})
           })
        })
    }).catch(err=>{
        console.log(err)
    })
})

module.exports=router;