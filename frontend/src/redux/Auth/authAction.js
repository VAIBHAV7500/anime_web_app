import authTypes from './authTypes';

const LoginSuccess = (id) => {
    return{
        type : authTypes.loginSuccess,
        payload : {
            user_id : id,
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
