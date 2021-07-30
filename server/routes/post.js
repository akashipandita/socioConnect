const express = require('express');
const router=express.Router();
const mongoose=require('mongoose');
const requireLogin=require('../middleware/requireLogin');
const Post=mongoose.model("Post");

router.get('/allposts',requireLogin,(req,res)=>{
    Post.find()
    .populate("postedBy","_id name")//bcz in all posts in postedBy attribute we have jsut the id of the user but we
    //want all the details of that user so we need to expand that user i.e.populate that user(that is in postedBy attribute)
    //but if we will get all details then we will also get pw that we dont want we just want id and name of user so in second
    //argument pass the attributes that we need
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')//we need to sort the posts but in descending order so we put '-'(minus)
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
})

//route so that a user only see the posts of users whom he follows
router.get('/getsubpost',requireLogin,(req,res)=>{
    console.log("here coming");
    Post.find({postedBy:{$in:req.user.following}}) //we are doing someting like-> if(postedBy in following)
    //tha is the postedBy id of user who posted that post is in the following array of logged in user

    .populate("postedBy","_id name")//bcz in all posts in postedBy attribute we have jsut the id of the user but we
    //want all the details of that user so we need to expand that user i.e.populate that user(that is in postedBy attribute)
    //but if we will get all details then we will also get pw that we dont want we just want id and name of user so in second
    //argument pass the attributes that we need
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.post('/createpost',requireLogin,(req,res)=>{
    const {title,body,pic}=req.body;
    if(!title || !body || !pic){
        return res.status(422).json({error:"Please add all fields"})
    }
    // console.log(req.user);
    // res.send("ok post");
    req.user.password=undefined;//bcz password should not be given back as response for security purpose
    const post=new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })
    post.save().then(result=>{
        res.json({post:result})
    })
    .catch(err=>{
        console.log(err);
    })
})

router.get('/myposts',requireLogin,(req,res)=>{ // to get all posts posted by the user currently logged in
    console.log(req.user);
    Post.find({postedBy:req.user._id})
    .populate("postedBy","_id name")
    .then(mypost=>{
        res.json({mypost})
    })
    .catch(err=>{
        console.log(err);
    })
})


router.put('/like',requireLogin,(req,res)=>{//since it is a update operation so use put instead of post
    Post.findByIdAndUpdate(req.body.postId,{//we will pass id of user from front end to here access by req.body.postId
        $push:{likes:req.user._id} //adding the id of the user who liked the post into likes array, since the
        //user who is currently logged in can only like the post, so push req.user._id into likes array
    },{
        new:true //if we do not write this mongodb will return us the old record but we want new updated record
    }).exec((err,result)=>{ //exec will execute the query
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})


router.put('/unlike',requireLogin,(req,res)=>{//since it is a update operation so use put instead of post
    Post.findByIdAndUpdate(req.body.postId,{//we will pass id of user from front end to here access by req.body.postId
        $pull:{likes:req.user._id} //removing the id of the user who liked the post into likes array, since the
        //user who is currently logged in can only like the post, so push req.user._id into likes array
    },{
        new:true //if we do not write this mongodb will return us the old record but we want new updated record
    }).exec((err,result)=>{ //exec will execute the query
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})


router.put('/comment',requireLogin,(req,res)=>{//since it is a update operation so use put instead of post
    const comment={
        text:req.body.text,
        postedBy:req.user._id //user who is currently logged in will only comment
    }
    Post.findByIdAndUpdate(req.body.postId,{//we will pass id of user from front end to here access by req.body.postId
        $push:{comments:comment} //adding the id of the user who liked the post into likes array, since the
        //user who is currently logged in can only like the post, so push req.user._id into likes array
    },{
        new:true //if we do not write this mongodb will return us the old record but we want new updated record
    })
    .populate("comments.postedBy","_id name")// we also want id and name from postedBy from id so populate
    //bcz in comment we also want to show name of user who commented
    .populate("postedBy","_id name")
    .exec((err,result)=>{ //exec will execute the query
        if(err){
            return res.status(422).json({error:err})
        }else{
            res.json(result)
        }
    })
    
})


router.delete('/deletepost/:postId',requireLogin,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate("postedBy","_id")
    .exec((err,post)=>{
        if(err || !post){
            return res.status(422).json({error:err})
        }
        console.log(post);
        if(post.postedBy._id.toString()===req.user._id.toString()){ //since both are objects so to
            //compare them convert them into strings, only the one posted can only delete the post
            post.remove()
            .then(result=>{
                res.json(result)
            }).catch(err=>{
                console.log(err);
            })
        }
    })
})




module.exports=router;