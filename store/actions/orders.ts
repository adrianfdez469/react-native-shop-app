import { ThunkDispatch, ThunkAction } from 'redux-thunk';
import { ADD_ORDER, CartProduct, OrdersState, OrderActions, FullReduxState,  SET_ORDERS, Order } from '../../types';
import firebaseUrl from '../../constants/firebaseUrl';


type ThunkResponse = ThunkAction<void, FullReduxState, undefined, OrderActions>; 

export const addOrder = (cartItems: CartProduct[], totalAmount: number):ThunkResponse => {

    return async (dispatch: ThunkDispatch<OrdersState, undefined, ADD_ORDER>, getState) => {
        const { userId, token } = getState().auth;

        const date = new Date();
        const resp = await fetch(`${firebaseUrl}/orders/${userId}.json?auth=${token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
             cartItems, totalAmount, date: date.toISOString()
            })
        });

        if(!resp){
            throw new Error('Something went wrong!');
        }

        const respData = await resp.json();

        dispatch({
            type: 'ADD_ORDER',
            orderData: {
                id: respData.name,
                items: cartItems,
                totalAmount: totalAmount,
                date: date
            }
        });
    }

}

export const loadOrders = ():ThunkResponse => {

    return async (dispatch: ThunkDispatch<OrdersState, undefined, SET_ORDERS>, getStore) => {

        const userId = getStore().auth.userId;
        const  resp = await fetch(`${firebaseUrl}/orders/${userId}.json`);

        if(!resp.ok){
            throw new Error('Something went wrong!');
        }

        const respData = await resp.json();

        let orders:Order[] = [];
        if(respData){
            orders = Object.entries(respData)
                .map((o:any) => {
                    const [orderId, order] = o;
                    return {
                        id: orderId,
                        items: order.cartItems,
                        totalAmount: order.totalAmount,
                        date: new Date(order.date)
                    }
                });
        }

        dispatch({type: 'SET_ORDERS', orders: orders});

    }

}