const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema.Types

const postSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    photo:{
        type:String, //to store url of photo
        required:true
    },
    likes:[{type:ObjectId,ref:"User"}], //array of all users id who liked this post
    comments:[{ //array of comments on a post
        text:String,
        postedBy:{type:ObjectId,ref:"User"} //comment posted by
    }],
    postedBy:{
        type:ObjectId,
        ref:"User"
    }
},{timestamps:true}) //the timestamps option will add createdAt feild to our model
//then we can use createdAt to sort our posts so that the most recent post comes on the top

mongoose.model("Post",postSchema);