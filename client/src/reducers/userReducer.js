export const initialState=null

export const reducer=(state,action)=>{
    if(action.type==="USER"){
        return action.payload
    }
    if(action.type==="CLEAR"){
        return null
    }
    if(action.type==="UPDATE"){
        return {
            ...state,//spread the previous state
            //then append in the state followers and following
            followers:action.payload.followers,//followers will be coming from action.payload.followers
            following:action.payload.following
        }
    }
    if(action.type=="UPDATEPIC"){
        return{
            ...state,
            pic:action.payload.pic
        }
    }
    return state
}