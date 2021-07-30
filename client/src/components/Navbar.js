import React, { useContext, useEffect, useRef, useState } from 'react';
import {Link ,useHistory} from 'react-router-dom'
import M from 'materialize-css'
import { UserContext } from '../App';
//we will not use anchor tags i.e.<a/> for different pages in navbar bcz <a/> will
//refresh the page evrytym we go to diff page so we will make use of links from react
//so links will chng without refreshing this is the beauty of react i.e it is a single 
//page appliication

const NavBar=()=>{
    const searchModal=useRef(null)
    const [search,setSearch]=useState('')
    const [userDetails,setUserDetails]=useState([]) //when we will search the results we will be getting will be stored in this array and this array would be shown then
    const {state,dispatch}=useContext(UserContext);
    const history=useHistory()

    useEffect(()=>{
        M.Modal.init(searchModal.current)
    },[])

    const renderList=()=>{
        if(state){
            return [
                //we are just adding bcz otherwise we will get warning
                <li key="1"><i  data-target="modal1" className="large material-icons modal-trigger" style={{color:"black"}}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/myfollowingpost">My following Posts</Link></li>,
                <li key="5">
                    <button className="btn #c62828 red darken-3"
                    onClick={()=>{
                        localStorage.clear()
                        dispatch({type:"CLEAR"})
                        history.push('/signin')
                    }}>
                    Logout
                    </button>
                </li>
            ]
        }else{
            return [
                <li key="6"><Link to="/signin">Signin</Link></li>,
                <li key="7"><Link to="/signup">Signup</Link></li>
            ]
        }
    }

    const fetchUsers = (query)=>{
        setSearch(query)
        fetch('/search-users',{
            method:"post",
            headers:{
            "Content-Type":"application/json"
            },
            body:JSON.stringify({
                query
            })
        }).then(res=>res.json())
        .then(results=>{
            console.log(results);
            setUserDetails(results.user)
        })
     }

    return(
        <nav>
            <div className="nav-wrapper white" >
                <Link to={state?"/":"/signin"} className="brand-logo left">SocialConnect</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            
            {/* we have reference of below div in userRef variable that is SearchModel */}
            <div id="modal1" class="modal" ref={searchModal} style={{color:"black"}}>
                <div className="modal-content">
                    <input
                        type="text"
                        placeholder="search users"
                        value={search}
                        onChange={(e)=>fetchUsers(e.target.value)} //whenever user will typ on this onChange we will fire a function and it will make a network request
                    />
                    <ul className="collection">
                        {/* for the list that will appear when we will search */}
                        {userDetails.map(item=>{
                            //item._id !== state._id -> this bcz in search when we get the name of the user currently logged in so when he clicks 
                            //on his name he should be directed to his profile only that is '/profile' and otherwise he should be directed to the 
                            //id of the user that is '/profile/id_of_user_whose_profile_he_clicked_on'
                            return <Link to={item._id !== state._id ? "/profile/"+item._id:'/profile'} onClick={()=>{
                            M.Modal.getInstance(searchModal.current).close() //coz when we searche for a user and we get that user in our searc and we click on the user it will direct us to the profile of that user and then our model should automatically close
                            setSearch('') //and when user clicks on a profile our search should also become empty so this
                            }}><li className="collection-item">{item.email}</li></Link> //{item.email} coz we are seaching with email
                        })}
                    </ul>
                </div>
                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>close</button> 
                    {/* //coz when we click on close button on our model it should empty our results so that is why setSearch('') */}
                </div>
            </div>
        </nav>
    );
}

export default NavBar;