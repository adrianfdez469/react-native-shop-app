import { ADD_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT, ProductActions,IProduct, ProductsState, FullReduxState, SET_PRODUCTS } from '../../types';
import {ThunkAction, ThunkDispatch} from 'redux-thunk';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import firebaseUrl from '../../constants/firebaseUrl';
import { Alert } from 'react-native';


type ThunkResponse = ThunkAction<void, FullReduxState, undefined, ProductActions>

export const deleteProduct = (productId:string):ThunkResponse => {
    
    return async (dispatch: ThunkDispatch<ProductsState, undefined, DELETE_PRODUCT>, getState) => {

      const token = getState().auth.token;
      const resp = await fetch(`${firebaseUrl}products/${productId}.json?auth=${token}`, {
        method: 'DELETE'
      })

      if(!resp.ok){
        throw new Error('Something went wrong');
      }

      dispatch({
        type: 'DELETE_PRODUCT',
        productId: productId
      })
    }
}

export const addProduct = (product:IProduct):ThunkResponse => {
    
    return async (dispatch: ThunkDispatch<ProductsState, undefined, ADD_PRODUCT>, getState) => {
        // Async code

        let ownerUserPushToken = null;
        try{
            let permissionResp = await Permissions.getAsync(Permissions.NOTIFICATIONS);
            if(permissionResp.status !== Permissions.PermissionStatus.GRANTED){
                permissionResp = await Permissions.askAsync(Permissions.NOTIFICATIONS);
                if(permissionResp.status !== Permissions.PermissionStatus.GRANTED){
                    const permissionError = new Error('Permissions denied!');
                    permissionError.name = 'PERMISSION_ERROR';
                    throw permissionError;
                }
            }
            const expoPushTokenData = await Notifications.getExpoPushTokenAsync();
            ownerUserPushToken = expoPushTokenData.data;

        }catch(error){
            if(error.name === 'PERMISSION_ERROR'){
                Alert.alert(error.message, 'You need to grant permissions access to get notifications!', [{text: 'Okay'}]);
            }else{
                console.log(error);
            }
        }

        const {token, userId} = getState().auth;
        const response = await fetch(`${firebaseUrl}products.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: product.title,
                description: product.description,
                imageUrl: product.imageUrl,
                ownerId: userId,
                price: product.price,
                ownerUserPushToken: ownerUserPushToken
            })
        });
        
        if(!response.ok){
          throw new Error('Something went wrong');
        }

        const respData = await response.json();

        dispatch({type:'ADD_PRODUCT', product: {
            ...product,
            id: respData.name
        }});
    }
}

export const editProduct = (productId: string, product: IProduct): ThunkResponse => {

  return async (dispatch: ThunkDispatch<ProductsState, undefined, EDIT_PRODUCT>, getState) => {
    const {token} = getState().auth;
    const resp = await fetch(`${firebaseUrl}products/${productId}.json?auth=${token}`, {
      method:'PATCH',
      headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        title: product.title,
        description: product.description,
        imageUrl: product.imageUrl
      })
    });

    if(!resp.ok){

      throw new Error('Something went wrong');
    }

    dispatch({type: 'EDIT_PRODUCT', editableData: {
      productId: productId,
      newDescription: product.description,
      newImageUrl: product.imageUrl,
      newTitle: product.title
    }});
  }
}

export const loadProducts = ():ThunkResponse => {
    return async (dispath: ThunkDispatch<ProductsState, undefined, SET_PRODUCTS>, getState) => {
      const {userId} = getState().auth;
      try{
        const response = await fetch(`${firebaseUrl}products.json`);
  
        if(!response.ok){
          throw new Error('Something went wrong');
        }
        const respData = await response.json();
        let products: IProduct[] = [];
        if(respData){
          products = Object
            .entries<IProduct>(respData)
            .map(p => {
              return {
                ...p[1],
                id: p[0]
              }
            });
        }
        
        dispath({type: 'SET_PRODUCTS', products: products, userId});

      }catch(error){
        // send to custom analytics server
        throw error;
      }
    }
}