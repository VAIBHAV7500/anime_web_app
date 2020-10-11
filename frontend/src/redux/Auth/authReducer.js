import authTypes from './authTypes';

const initialState = {
    login: false,
    user : ''
}

const reducer = (state = initialState,action)=>{
    switch(action.type){
        case authTypes.loginFailure : return{
            ...state,
            login: false,
            user : ''
        }
        case authTypes.loginSuccess : return{
            ...state,
            login: true,
            user : action.payload.user
        }
        default : return state;
    }
}

export default reducer;
