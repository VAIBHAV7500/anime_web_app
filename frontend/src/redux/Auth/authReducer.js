import authTypes from './authTypes';

const initialState = {
    login: false,
    userId : ''
}

const reducer = (state = initialState,action)=>{
    switch(action.type){
        case authTypes.loginFailure : return{
            ...state,
            login: false,
            userId : ''
        }
        case authTypes.loginSuccess : return{
            ...state,
            login: true,
            userId : action.payload.userId
        }
        default : return state;
    }
}

export default reducer;
