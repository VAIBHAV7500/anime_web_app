import authTypes from './authTypes';

const LoginSuccess = (id,planId) => {
    return{
        type : authTypes.loginSuccess,
        payload : {
            user_id : id,
            plan_id : planId
        }
    }
}

const LoginFailure =  ()=>{
    return{
        type:authTypes.loginFailure,
    }
}

export {
    LoginSuccess,
    LoginFailure,
}
