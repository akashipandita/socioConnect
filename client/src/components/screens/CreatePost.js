import React, {useState, useEffect} from 'react';
import { useHistory} from 'react-router-dom';
import M from 'materialize-css';

const CreatePost = () => {

    const history=useHistory();

    const [title,setTitle]=useState("");
    const [body,setBody]=useState("");
    const [image,setImage]=useState(""); // we have to upload ths image to a separate storage service so we will use
    //cloudinary to upload my images and we will be storing url of that in our databse
    const [url,setUrl]=useState("");

    useEffect(()=>{
        if(url){
            fetch("http://localhost:5000/createpost",{
                method:"post",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":"Bearer "+localStorage.getItem("jwt")
                },
                body:JSON.stringify({
                    title,
                    body,
                    pic:url
                })
            }).then(res=>res.json())
            .then(data=>{
                // console.log(data);
                if(data.error){
                    M.toast({html: data.error, classes:"#c62828 red darken-3"})
                }
                else{
                    M.toast({html: "Created Post Successfully", classes:"#43a047 green darken-1"})
                    history.push('/');
                }
            }).catch(err=>{
                console.log(err);
            })
        }
    },[url])

    //first we will be posting a image then we will be making a separate network request to our nodejs server
    const postDetails=()=>{
        //code for uploading image
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
            setUrl(data.url)
        })
        .catch(err=>{
            console.log(err)
        })
    }
    return (
        <div className="card input-filed" style={{
            margin:"30px auto",
            maxWidth:"500px",
            padding:"20px",
            textAlign:"center"
        }}>
            <input 
            type="text" 
            placeholder="title"
            value={title}
            onChange={(e)=>setTitle(e.target.value)}
            />
            <input 
            type="text" 
            placeholder="body"
            value={body}
            onChange={(e)=>setBody(e.target.value)}
            />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload imaggee</span>
                    <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text"/>
                </div>
            </div>
                <button className="btn waves-effect waves-light" onClick={()=>postDetails()}>
                    Submit Post
                </button>
        </div>
    )
}

export default CreatePost
