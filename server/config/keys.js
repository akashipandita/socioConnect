// module.exports={
//     MONGOURI:"mongodb+srv://akashi:akashipandita@cluster0.5yni7.mongodb.net/<dbname>?retryWrites=true&w=majority",
//     JWT_SECRET:"Here is my secret"
// }
if(process.env.NODE_ENV==='production'){
    module.exports=require('./prod')
}else{
    module.exports=require('./dev')
}