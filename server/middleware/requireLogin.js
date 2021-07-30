const jwt=require('jsonwebtoken');
const {JWT_SECRET}=require('../config/keys');
const mongoose=require('mongoose');
const User=mongoose.model("User");

module.exports=(req,res,next)=>{ //midleware func
    const {authorization}=req.headers // we will be adding authorization header
    //authorization will be of the form eg. authorization === "Bearer abfuwr783rfsbhefhedf(token)"
    if(!authorization){
        res.status(401).json({error:"you must be logged in"})
    }
    //authorization will be a string
    const token=authorization.replace("Bearer ","");//bcz in authrization we just want token so we will replace "Bearer "with null string so that in
    //authorization we will just have token 
    jwt.verify(token,JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})
        }
        console.log(payload);
        const {_id}=payload; //bcz when we were generating the token we assigned savedUser._id in _id , so now we are using that _id from our
        //payload
        User.findById(_id).then(userdata=>{
            req.user=userdata;//when we are verifying our user we are attaching all the details of the user in req.user, so we can access the details of user from req.user 
            next(); // to continue our code further
            // we put this next inside this userfindbyid bcz this operation of finding user may take a while and if we put next() outside this
            //then before completing this operation the next() will continue with next funtion or middleware
        })
    })
}