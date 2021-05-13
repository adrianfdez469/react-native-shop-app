import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThunkDispatch} from 'redux-thunk';
import { LOGOUT, AUTHENTICATE } from '../../types';
import { GOOGLE_API_KEY } from '../../env';

export const SignUp = (email:string, password:string) => {

    return async (dispatch:ThunkDispatch<{}, undefined, AUTHENTICATE>) => {
        
        const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${GOOGLE_API_KEY}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email, password: password, returnSecureToken: true
          })
        })
        
        
        if(!response.ok){
          const errorRespData = await response.json();
          let errCode;
          if(errorRespData.error){
            errCode = errorRespData.error.message
          }
          const error = new Error();
          switch(errCode){
            case 'EMAIL_EXISTS': 
              error.message = 'The email address is already in use by another account.';
              break;
            case 'OPERATION_NOT_ALLOWED': 
              error.message = 'Password sign-in is disabled for this project.';
              break;
            case 'TOO_MANY_ATTEMPTS_TRY_LATER': 
              error.message = 'We have blocked all requests from this device due to unusual activity. Try again later.';
              break;
            default: 'Cant Sign Up!'
          }
          throw error;
        }
        const respData = await response.json();
        dispatch(Authenticate(respData.idToken, respData.localId));
        const expDate = new Date(new Date().getTime() + parseInt(respData.expiresIn) * 1000);
        saveAuthDataToStorage(respData.idToken, respData.localId, expDate);
    }
}


export const Login = (email:string, password:string) => {
  

    return async (dispatch:ThunkDispatch<{}, undefined, AUTHENTICATE>) => {
      
        const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${GOOGLE_API_KEY}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: email, password: password, returnSecureToken: true
          })
        })

        if(!response.ok){
          const errorRespData = await response.json();
          
          let errCode;
          if(errorRespData.error){
            errCode = errorRespData.error.message
          }
          const error = new Error();
          switch(errCode){
            case 'EMAIL_NOT_FOUND': 
              error.message = 'There is no user record corresponding to this identifier. The user may have been deleted.';
              break;
            case 'INVALID_PASSWORD': 
              error.message = 'The password is invalid or the user does not have a password.';
              break;
            case 'USER_DISABLED': 
              error.message = 'The user account has been disabled by an administrator.';
              break;
            default: 'Cant Login!'
          }

          throw error;
        }

        const respData = await response.json();
        dispatch(Authenticate(respData.idToken, respData.localId));
        const expDate = new Date(new Date().getTime() + parseInt(respData.expiresIn) * 1000);
        saveAuthDataToStorage(respData.idToken, respData.localId, expDate);
    }
}

export const Authenticate = (token: string, userId: string):AUTHENTICATE => {
    return {
        type: 'AUTHENTICATE',
        idToken: token,
        userId: userId
    }
}



export const Logout = (): LOGOUT => {
    
    clearAuthDataInStorage();
    return {
        type: 'LOGOUT'
    }
}

const saveAuthDataToStorage = (token:string, userId:string, expDate:Date) => {
    AsyncStorage.setItem('AuthData', JSON.stringify({
        token: token,
        userId: userId,
        expDate: expDate.toISOString()
    }));
}


const clearAuthDataInStorage = () => {
    AsyncStorage.removeItem('AuthData');
}