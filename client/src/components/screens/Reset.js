import React, {useState,useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';

const SignIn=()=>{

    const history=useHistory();

    const [email,setEmail]=useState("");
    
    const PostData=()=>{
        // console.log("in");
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "invalid email",classes:"#c62828 red darken-3"})
            return
        }
        console.log(localStorage.getItem("jwt"));
        fetch('/reset-password',{
            method:"post",
            headers:{
                "Content-Type":"application/json"
                // "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
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

    return (
        <div className="mycard">
            <div className="card auth-card">
                <h2>SocialConnect</h2>
                <input
                type="text"
                placeholder="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                />
                <button className="btn waves-effect waves-light" onClick={()=>PostData()}>
                    Reset Password
                </button>
            </div>
        </div>
    );
}

export default SignIn;