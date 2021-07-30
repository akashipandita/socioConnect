const express=require('express');
const app=express();
const mongoose=require('mongoose');
//akashipandita(mongo user pw)
const PORT=process.env.PORT || 5000; //process.env.PORT->coz we cannot make our develpment server static as 5000 cz when we deploy using huruku then huruku will choose its own development server
const {MONGOURI}=require('./config/keys');


mongoose.connect(MONGOURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
mongoose.connection.on('connected',()=>{
    console.log("connected to mongoose");
});
mongoose.connection.on('error',(err)=>{
    console.log("error connecting ," , err);
})

require("./models/user");
require('./models/post');

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(res.method==='OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT', 'POST', 'PATCH', 'DELETE', 'GET');
        return res.status (200).json({});
    }
    next();
})

app.use(express.json()); //to parse all incoming requests to json before it reaches to actual route (this is a middleware)
app.use(require('./routes/auth'));
app.use(require('./routes/post'));
app.use(require('./routes/user'));




// //middleware are code which takes the incoming request and it modifies it before it reaces actual route handler
// const customMiddleware = (req,res,next)=>{
//     console.log("middleware executed");
//     //in order to stop this middleware we need to call next
//     next();//we need to call next to stop this middleware and start executing the code further or to continue to the next middleware
// }

// // app.use(customMiddleware);

// //like here user will be making get request to /, so before user willl make this get / reuquest this custom middleware will come in between
// //and modify the request before it reaches to our actual route handler
// app.get('/',(req,res)=>{
//     res.send("Hello World");
// });

// //if we want a middleware only for a particular function then we can do like this(commenting above app.use(customMiddleware) which will
// //be applies on all routes)
// app.get('/about',customMiddleware,(req,res)=>{
//     console.log("home");
//     res.send("about page");
// });


if(process.env.NODE_ENV=="production"){
    //if we are on production side that is our application is deployed
    app.use(express.static('client/build')) //we need to server our static files that is js and css files
    const path=require('path')
    app.get("*",(req,res)=>{//if client will be making any request we will be sending index.html file(presnt in build folder inside client folder) coz index.html contains our entire react application, in indx.html we will have logic on what component we should show what route
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}




app.listen(PORT,()=>{
    console.log("Server is running on port ",PORT);
})



//we used toast messages also from materialize