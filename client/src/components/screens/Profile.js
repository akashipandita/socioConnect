// import React, { useContext, useEffect, useState } from 'react'
// import {UserContext} from '../../App'
// const Profile=()=>{
//     const [mypics,setPics]=useState([]);
//     const{state,dispatch}=useContext(UserContext)
//     const [image,setImage]=useState(""); //for asking profile picture of user when he signs up
//     const [url,setUrl]=useState(""); 
//     useEffect(()=>{
//         fetch('/myposts',{
//             headers:{
//                 "Authorization":"Bearer "+localStorage.getItem("jwt")
//             }
//         }).then(res=>res.json())
//         .then(result=>{
//             console.log(result);
//             setPics(result.mypost);
//         })
//         console.log(state);
//     },[])

//     useEffect(()=>{
//         const data=new FormData() //to upload afile we need to create a new formdata(read from documentation{google->"fetch post"})
//         data.append("file",image);//the file we need to upload is in image
//         data.append("upload_preset","social-network")//upload preset that we made
//         data.append("cloud_name","akashisocialnetwork")//name of our cloud    }
//         fetch("https://api.cloudinary.com/v1_1/akashisocialnetwork/image/upload",{
//             method:"post",
//             body:data
//         })
//         .then(res=>res.json())
//         .then(data=>{
//             //after updating we need to make changes in our state as well as local storage
//             setUrl(data.url)
//             console.log(data);
//             localStorage.setItem("user",JSON.stringify({...state,pic:data.pic}))
//             dispatch({type:"UPDATEPIC",payload:data.pic})
//             window.location.reload()
//         })
//         .catch(err=>{
//             console.log(err)
//         })
//     },[image])

//     const updatePhoto=(file)=>{
//         setImage(file)
//     }

//     return (
//         <div style={{maxWidth:"550px",margin:"0px auto"}}>
//             <div style={{
//                 margin:"18px 0px",
//                 borderBottom:"1px solid grey"
//             }}>

            
//             <div style={{
//                 display:"flex",
//                 justifyContent:"space-around",
//                 margin:"18px 0px",
//                 borderBottom:"1px solid grey"
//             }}>
//                 <div>
//                     <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
//                     src={state?state.pic:"loading"}
//                     alt="profile "
//                     />
//                 </div>
//                 <div>
//                     <h4>{state?state.name:"loading"}</h4> 
//                     <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
//                         <h6>{mypics.length} posts</h6>
//                         <h6>{state?state.followers.length:"0"} followers</h6>
//                         <h6>{state?state.following.length:"0"} following</h6>
//                     </div>
//                 </div>
//             </div>
//             {/* <button className="btn waves-effect waves-light" >
//                 Update Profile Picture
//             </button> */}
//             <div className="file-field input-field" style={{margin:"10px"}}>
//             <div className="btn #64b5f6 blue darken-1">
//                 <span>Update pic</span>
//                 <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
//             </div>
//             <div className="file-path-wrapper">
//                 <input className="file-path validate" type="text" />
//             </div>
//             </div>
//             </div> 
//             <div className="gallery">
//                 {
//                     mypics.map(item=>{
//                         return(
//                             <img className="item" src={item.photo} alt={item.title} />
//                         )
//                     })
//                 }
//                 {/* <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                 <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                 <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                 <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                 <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                 <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/> */}
//             </div>
//         </div>
//     );
// }

// export default Profile;

// /*for {state?state.name:"loading"} -> bcz when we were loading it was showing error that name is null as it might take little bit to fetch*/

import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
       fetch('/myposts',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setPics(result.mypost)
       })
    },[])
    useEffect(()=>{
       if(image){
        const data=new FormData() //to upload afile we need to create a new formdata(read from documentation{google->"fetch post"})
        data.append("file",image);//the file we need to upload is in image
        data.append("upload_preset","social-network")//upload preset that we made
        data.append("cloud_name","akashisocialnetwork")//name of our cloud    }
        fetch("https://api.cloudinary.com/v1_1/akashisocialnetwork/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
    
       
           fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               window.location.reload()
           })
       
        })
        .catch(err=>{
            console.log(err)
        })
       }
    },[image])

    const updatePhoto = (file)=>{
        console.log(state);
        console.log(mypics);
        setImage(file)
    }

    const deleteacc=()=>{
        
    }

   return (
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>

         
           <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={state?state.pic:"loading"}
                   />
                 
               </div>
               <div>
                    <button style={{position:"absolute",marginLeft:"550px"}} className="btn #c62828 red darken-3"
                        onClick={()=>{deleteacc()}}>
                        Delete Account
                    </button>
                   <h4>{state?state.name:"loading"}</h4>
                   <h5>{state?state.email:"loading"}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{mypics.length} posts</h6>
                       <h6>{state?state.followers.length:"loading"} followers</h6>
                       <h6>{state?state.following.length:"loading"} following</h6>
                   </div>

               </div>
           </div>
        
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            </div>      
           <div className="gallery">
               {
                   mypics.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
               }

           
           </div>
       </div>
   )
}


export default Profile