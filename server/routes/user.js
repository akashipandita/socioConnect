const express = require('express');
const router=express.Router();
const mongoose=require('mongoose');
const requireLogin=require('../middleware/requireLogin');
const Post=mongoose.model("Post");
const User=mongoose.model("User");

router.get('/user/:id',requireLogin,(req,res)=>{//id is the id of the user whose profile another user wants to see
    User.findOne({_id:req.params.id})
    .select("-password")//we want all the fields except password
    .then(user=>{
        Post.find({postedBy:req.params.id})
        .populate("postedBy","_id name")
        .exec((err,posts)=>{
            if(err){
                return res.status(422).json({error:err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})

router.put('/follow',requireLogin,(req,res)=>{
    //when a user follows another user we need to ake 2 changes->1.increase the following of the user who followed
    //the other user and increase the followers of other user
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id} //req.user._id->id of logged in user
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        //now we have to update following of other user
        User.findByIdAndUpdate(req.user._id,{
            $push:{following:req.body.followId}
        },{new:true}).select("-password").then(result=>{ //"-password" bcz we do not want to send password(pw must always be hidden)
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id} //req.user._id->id of logged in user
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/updatepic',requireLogin,(req,res)=>{
    //req.user._id->id of user whose profile we want to update
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})

router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query) //'^' means starts with so starts with req.body.query(whatevers in it)
    User.find({email:{$regex:userPattern}})
    .select("_id email") //coz we want only id and email in our response as only they are needed in frontend
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})

module.exports=router