// import React, { useContext, useEffect, useState } from 'react'
// import { useParams } from 'react-router';
// import {UserContext} from '../../App'
// const Profile=()=>{
//     const [userProfile,setProfile]=useState(null);
//     const [showfollow,setShowFollow]=useState(true); //this will be used to hide follow button once the user has already followed that user
//     const{state,dispatch}=useContext(UserContext);
//     const {userid}=useParams();
//     console.log(userid);
//     useEffect(()=>{
//         fetch(`/user/${userid}`,{
//             headers:{
//                 "Authorization":"Bearer "+localStorage.getItem("jwt")
//             }
//         }).then(res=>res.json())
//         .then(result=>{
//             console.log(result);
//             setProfile(result);
//         })
//         console.log(state);
//     },[])

//     const followUser=()=>{
//         fetch('/follow',{
//             method:"put",
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization":"Bearer "+localStorage.getItem("jwt")
//             },
//             body:JSON.stringify({
//                 followId:userid
//             })
//         }).then(res=>res.json())
//         .then(data=>{
//             console.log(data); //data is giving details of user who is following
//             //in our state we had id email and name of the user but we wanted to add followers and following of that user also to the state so dispatch to change in local storage also
//             dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}}) //to update our state, following array we have in data.following
//             //payload will be an object with 2 keys following and followers
            
//             //we need to update local storage so below 
//             localStorage.setItem("user",JSON.stringify(data));//stringify bcz in localstorage we can only store strings
            
//             //update our state below
//             setProfile((prevState)=>{
//                 console.log(prevState);
//                 return{
//                     ...prevState,
//                     user:{//over write the user feild with updated record
//                         ...prevState.user,
//                         followers:[...prevState.user.followers,data._id]//in followers field; , data._id->appending id of current loggedin user
//                     }
//                 }
//             })
//             setShowFollow(false);
//         })
//     }

//     const unfollowUser=()=>{
//         fetch('/unfollow',{
//             method:"put",
//             headers:{
//                 "Content-Type":"application/json",
//                 "Authorization":"Bearer "+localStorage.getItem("jwt")
//             },
//             body:JSON.stringify({
//                 unfollowId:userid
//             })
//         }).then(res=>res.json())
//         .then(data=>{
//             console.log(data); //data is giving details of user who is following
//             dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}}) //?
//             localStorage.setItem("user",JSON.stringify(data));//stringify bcz in localstorage we can only store strings
//             setProfile((prevState)=>{
//                 //we need to remove data._id from our followers
//                 console.log(prevState);
//                 const newFollower=prevState.user.followers.filter(item=>item!=data._id)
//                 return{
//                     ...prevState,
//                     user:{
//                         ...prevState.user,
//                         followers:newFollower
//                     }
//                 }
//             })
//         })
//     }

//     return (
//         <>
//             {userProfile ?
            
//             <div style={{maxWidth:"550px",margin:"0px auto"}}>
//                 <div style={{
//                     display:"flex",
//                     justifyContent:"space-around",
//                     margin:"18px 0px",
//                     borderBottom:"1px solid grey"
//                 }}>
//                     <div>
//                         <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
//                         src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
//                         alt="profile "
//                         />
//                     </div>
//                     <div>
//                         <h4>{userProfile.user.name}</h4> 
//                         <h5>{userProfile.user.email}</h5> 
//                         <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
//                             <h6>{userProfile.posts.length} posts</h6>
//                             <h6>{userProfile.user.followers.length} followers</h6>
//                             <h6>{userProfile.user.following.length} following</h6>
//                         </div>
//                         {//if user has not followed this user then show follow button otherwise show unfollow button
//                             showfollow?
//                             <button className="btn waves-effect waves-light" onClick={()=>followUser()}>
//                                 Follow
//                             </button>
//                             :
//                             <button className="btn waves-effect waves-light" onClick={()=>unfollowUser()}>
//                                 Unfollow
//                             </button>
//                         }
//                     </div>
//                 </div>
//                 <div className="gallery">
//                     {
//                         userProfile.posts.map(item=>{
//                             return(
//                                 <img className="item" src={item.photo} alt={item.title} />
//                             )
//                         })
//                     }
//                     {/* <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                     <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                     <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                     <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                     <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/>
//                     <img className="item" src="https://images.unsplash.com/photo-1605993439219-9d09d2020fa5?ixid=MXwxMjA3fDB8MHxzZWFyY2h8NXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="feed"/> */}
//                 </div>
//             </div>
            
//             : <h2>loading...</h2>}
//         </>
//     );
// }

// export default Profile;
// //component for other users profiles, when we view some other users profile

// /*for {state?state.name:"loading"} -> bcz when we were loading it was showing error that name is null*/



import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true) //here we are not just setting value to true initially
    //coz if we are following a user then we should be shown unfollow button but as this showfollow is a state it will be gone when we will refresh our
    //page and then instead of unfollow we will see follow button there so this value should not be initialised to true and with above logic with the help of state
    useEffect(()=>{
       fetch(`/user/${userid}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           //console.log(result)
         
            setProfile(result)
       })
    },[])


    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true) //as when we click on unfollow and user unfollows the user we need to hide unfollow button then and show follow button only,
             //so when we are unfollowing user we need to update our state
             
        })
    }
   return (
       <>
       {userProfile ?
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
               display:"flex",
               justifyContent:"space-around",
               margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={userProfile.user.pic}
                   />
               </div>
               <div>
                   <h4>{userProfile.user.name}</h4>
                   <h5>{userProfile.user.email}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{userProfile.posts.length} posts</h6>
                       <h6>{userProfile.user.followers.length} followers</h6>
                       <h6>{userProfile.user.following.length} following</h6>
                   </div>
                   {showfollow?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
                   
                  

               </div>
           </div>
     
           <div className="gallery">
               {
                   userProfile.posts.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
               }

           
           </div>
       </div>
       
       
       : <h2>loading...!</h2>}
       
       </>
   )
}


export default Profile