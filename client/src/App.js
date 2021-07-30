import React,{useEffect,createContext,useReducer,useContext} from 'react'
import NavBar from './components/Navbar';
import "./App.css";
import {BrowserRouter,Route,Switch,useHistory} from 'react-router-dom'
import Home from './components/screens/Home';
import Signin from './components/screens/SignIn';
import Profile from './components/screens/Profile';
import Signup from './components/screens/Signup';
import CreatePost from './components/screens/CreatePost';
import UserProfile from './components/screens/UserProfile';
import NewPassword from './components/screens/Newpassword'
import { initialState, reducer } from './reducers/userReducer';
import SubscribedUserPosts from './components/screens/SubscribedUserPosts';
import Reset from './components/screens/Reset';

export const UserContext=createContext();

const Routing=()=>{ //now we can access history in this routing bcz we have wrapped routing inside BrowserRouting
  const history=useHistory();
  const {state,dispatch}=useContext(UserContext)
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("user")); //as user was string we parsed it to object
    // console.log(typeof(user),user);
    if(user){
      dispatch({type:"USER",payload:user}) //it may happen that user closes the window but he has not logged off 
      //so our state will be gone in that case so we need to dispatch the user to have user data 
      // history.push('/');
    }else{
      if(!history.location.pathname.startsWith('/reset')) //if path is other than reset then navigate user to signin
        history.push('/signin')
    }
  },[])
  //Switch will mak sure any of the route is active at a time acc to path
  return(
    <Switch> 
      <Route exact path="/">
        <Home />
      </Route>
      <Route path="/signin">
        <Signin />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <Route exact path="/profile"> {/*here we have put exact bcz down we have a route /profile/userid so if we have a route to /profile/userid then if we have not put exact here this component will also come in that route */}
        <Profile />
      </Route>
      <Route path="/create">
        <CreatePost />
      </Route>
      <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
      <Route exact path="/reset">
        <Reset />
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>

    </Switch>
  )
}

//we want to access the history and we cannot access history inside app(before return) bcz we can access
//history in the Home, Signin,Signup,Profile but we cannot access history inside the app bcz the reason for 
//this is bcz we have wrapped all the components with this BrowserRouter and we are accessing the history outside
//the BrowserRouter and we are accessing the history outside thid BrowserRouter bcz we havnt wrapped app with the
//BrowserRouter, so to prevent this we will create a separate component and put all routing stuff in there(name Routing)
function App() {
  const [state,dispatch]=useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{state,dispatch}}>
      <BrowserRouter>
        <NavBar />
        <Routing/>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

//#37
