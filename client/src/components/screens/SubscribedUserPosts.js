import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App';
import {Link} from 'react-router-dom'

const Home=()=>{
    const [data,setData]=useState([]);
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
        console.log("here react");
        fetch('/getsubpost',{
            headers:{
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            setData(result.posts)
        })
    },[])

    const likePost=(id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            console.log(data); //data is array of our posts
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            //but here the probem is same user can like post any number of times 
            //so before we should vheck if the likes array of the particular post
            //containf the id of the user
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    const unlikePost=(id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData=data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    const makeComment=(text,postId)=>{
        fetch('/comment',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId,
                text
            })
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData=data.map(item=>{ //iterating over the existing array
                //and we will see the individual item if item id==result id
                if(item._id==result._id){
                    return result //result that is the updated record as item
                }else{
                    return item
                }
            })
            setData(newData)
        }).catch(err=>{
            console.log(err);
        })
    }

    const deletePost=(postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result);
            const newData=data.filter(item=>{ //filter the posts to remove the deleted post from data array
                return item._id!==result._id
            })
            setData(newData)
        })
    }

    return (
        <div className="home">
            {
                data.map(item=>{
                    return(
                        <div className="card home-card" key={item._id}>
                            {/*here below link to is used bcz in home screen when we see a post on post there is name of user who posted that so on clicking on that name we should redirect to the profile of the user */}
                            {/*and the condition that we are checking is is the post is of the user currently logged in then redirect the user to his own profile */}
                            <h5 style={{padding:"7px"}} ><Link to={item.postedBy._id!==state._id? "/profile/"+item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> {item.postedBy._id==state._id
                                && 
                                <i className="material-icons" style={{float:"right"}}
                                    onClick={()=>{deletePost(item._id)}}>delete
                                </i>
                            }</h5>
                            <div className="card-image">
                                <img src={item.photo} alt="post"/>
                            </div>
                            <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            {
                                item.likes.includes(state._id)? //check if likes array contains this user
                                <i className="material-icons" onClick={()=>{unlikePost(item._id)}}>thumb_down</i>
                                //if contains then just show thumbsdown for unlike only coz same user cannot like a post more than once
                                :
                                <i className="material-icons" onClick={()=>{likePost(item._id)}} >thumb_up</i>
                                //if  not contains then user can like but cannot unlike so just show thumbs up
                            }
                            {/* <i className="material-icons" onClick={()=>{likePost(item._id)}} >thumb_up</i>
                            <i className="material-icons" onClick={()=>{unlikePost(item._id)}}>thumb_down</i> */}
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <h6 key={record._id}><span style={{fontWeight:"500"}}>{record.postedBy.name} </span>{record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                    console.log(e.target[0].value); //e.target gave <form><input/></from> and since we 
                                    //have only one input inside the form sp e.target[0] then gor value of input e.target[0].value
                                }}>
                                    <input type="text" placeholder="add a comment"/>
                                </form>
                            </div>
                        </div>    
                    )
                })
            }
        </div>
    );
}

export default Home;