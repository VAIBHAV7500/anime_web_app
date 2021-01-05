import authTypes from './authTypes';

const initialState = {
    login: false,
    user_id : '',
    plan_id : null
}

const reducer = (state = initialState,action)=>{
    switch(action.type){
        case authTypes.loginFailure : return{
            ...state,
            login: false,
            user_id : '',
            plan_id : null
        }
        case authTypes.loginSuccess : return{
            ...state,
            login: true,
            user_id : action.payload.user_id,
            plan_id : action.payload.plan_id
        }
        default : return state;
    }
}

export default reducer;
