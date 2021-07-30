import React, {useState,useContext} from 'react';
import {Link, useHistory, useParams} from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';

const SignIn=()=>{

    const history=useHistory();

    const [password,setPassword]=useState("");
    const {token}=useParams()
    console.log(token);
    
    const PostData=()=>{
        // console.log("in");
        fetch("http://localhost:5000/new-password",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
                // "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                password,
                token
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                M.toast({html: data.message, classes:"#43a047 green darken-1"})
                history.push('/signin')
            }
        }).catch(err=>{
            console.log(err);
        })
    }

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>SocialConnect</h2>
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light" onClick={()=>PostData()}>
                    Update Password
                </button>
                <h5>
                    <Link to="/signup">Don't have an account ?</Link>
                </h5>
            </div>
        </div>
    );
}

export default SignIn;