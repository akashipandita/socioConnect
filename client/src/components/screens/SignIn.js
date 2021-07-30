import React, {useState,useContext} from 'react';
import {Link, useHistory} from 'react-router-dom';
import M from 'materialize-css';
import { UserContext } from '../../App';

const SignIn=()=>{

    const {state,dispatch}=useContext(UserContext)

    const history=useHistory();

    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    
    const PostData=()=>{
        // console.log("in");
        console.log(localStorage.getItem("jwt"));
        fetch("http://localhost:5000/signin",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
                // "Authorization":"Bearer "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data);
            if(data.error){
                M.toast({html: data.error, classes:"#c62828 red darken-3"})
            }
            else{
                localStorage.setItem("jwt",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER",payload:data.user})
                M.toast({html: "signedin success", classes:"#43a047 green darken-1"})
                history.push('/');
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
                <input
                type="password"
                placeholder="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                />
                <button className="btn waves-effect waves-light" onClick={()=>PostData()}>
                    Login
                </button>
                <h5>
                    <Link to="/signup">Don't have an account ?</Link>
                </h5>
                <h6>
                    <Link to="/reset">Forget password </Link>
                </h6>
            </div>
        </div>
    );
}

export default SignIn;