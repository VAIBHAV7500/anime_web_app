import authTypes from './authTypes';

const initialState = {
    login: false,
    user_id : ''
}

const reducer = (state = initialState,action)=>{
    switch(action.type){
        case authTypes.loginFailure : return{
            ...state,
            login: false,
            user_id : ''
        }
        case authTypes.loginSuccess : return{
            ...state,
            login: true,
            user_id : action.payload.user_id
        }
        default : return state;
    }
}

export default reducer;
