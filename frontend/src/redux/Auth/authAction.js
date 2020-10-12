import authTypes from './authTypes';

const LoginSuccess = (email) => {
    return{
        type : authTypes.loginSuccess,
        payload : {
            email : email
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
