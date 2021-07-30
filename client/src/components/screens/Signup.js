import React, { useEffect, useState } from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';

const Signup=()=>{
    const history=useHistory();

    const [name,setName]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [image,setImage]=useState(""); //for asking profile picture of user when he signs up
    const [url,setUrl]=useState(undefined); //earlier instead of using undefined we had put "" this empty string coz when we have not uploaded
    //any profile pic then in backend there will be nothing in pic end it will use the default pic but when we used "" in backend we had empty string 
    //so that caused broken image symbol in profile picture so we used undefined bcz a undefined thing will not exist

    useEffect(()=>{
        //using if condition bcz we dont want this useEffect to kick in when component mounts that means when the instance of components
        //is created and inserted into DOM
        //we only want this useEffect to kick in image is successfully uploaded
        if(url){//if url exists
            uploadFields();
        }
    },[url])

    const uploadPic=()=>{//this will be optional may be user will want to upload profile picture later
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

    const uploadFields=()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        fetch("http://localhost:5000/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
        }).then(res=>res.json())
        .then(data=>{
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                history.push('/signin');
            }
        }).catch(err=>{
            console.log(err);
        })
    }
    
    const PostData=()=>{
        // console.log("in");
        if(image){ //if we have uploaded image
            uploadPic() // but if we posted profile picture we still need ti fill other data that is email and all
            //but here we have put all that logic in uploadFields() and we are calling in else block so we will use
            //useEffect and whever we upload image and set url usin setUrl state that is when this setUrl is updated we 
            //will fire a callback to again post these feilds(name,pw,email)
        }else{
            uploadFields()
        }
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>SocialConnect</h2>
                <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                />
                <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload Picture</span>
                        <input type="file" onChange={(e)=>setImage(e.target.files[0])} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text"/>
                    </div>
                </div>
                <button className="btn waves-effect waves-light" onClick={()=>PostData()}>
                    SignUp
                </button>
                <h5>
                    <Link to="/signin">Already have an account ?</Link>
                </h5>
            </div>
        </div>
    );
}

export default Signup;

//CORS error comes when our react server is running on localhost 3000 and our nodejs server
//is running on local host 5000, so both the apps are running on diff url/diff domain , if 
//we will send the request from one domain to another domain server will not allow any requests
//from another domain, so our request is blocked due to CORS policy, so we need to install a package 
//called npm cors and use in app.js but we can do something better by making use of proxy, with rpoxy
//we can fool our react server,  so we will create proxy in package.json file