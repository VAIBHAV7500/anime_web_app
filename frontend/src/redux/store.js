import {createStore} from 'redux';
import authReducer from './Auth/authReducer';

const store = createStore(authReducer);

export default store;

