import { Reducer } from 'react';
import { AuthState, AUTH_ACTIONS } from '../../types';


const initialState:AuthState = {
  isLoggedIn: false,  
  userId: '',
  token: ''
}

 const AuthReducer:Reducer<AuthState, AUTH_ACTIONS> = (state = initialState, action) => {
    switch(action.type){
        case 'AUTHENTICATE':
            return {
              userId: action.userId,
              token: action.idToken,
              isLoggedIn: true
            };
        case 'LOGOUT': {
            return {
                isLoggedIn: false,
                token: '',
                userId: ''
            }
        }
        default: return state;
    }
}

export default AuthReducer;