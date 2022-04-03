import {createStore, applyMiddleware} from 'redux';
import authReducer from './Auth/authReducer';
import logger from 'redux-logger';

const store = createStore(authReducer);

export default store;

