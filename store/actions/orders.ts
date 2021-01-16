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

        // Send a push notification to the products owner
        const pushTokens:string[] = Array.from(new Set(
            cartItems.map(cartP => {
                return cartP.product.ownerUserPushToken;
            })));
        try{
            for(const item of cartItems){
                await fetch('https://exp.host/--/api/v2/push/send', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Encoding': 'gzip, deflate',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        to: item.product.ownerUserPushToken,
                        data: item,
                        title: 'Order was placed!',
                        body: `${item.quantity}: ${item.product.title}`
                    })
                })
            }
        }catch(err){
            console.log(err);
        }
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