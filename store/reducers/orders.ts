import {Reducer} from 'react';
import { OrdersState, OrderActions } from '../../types';

const initialState:OrdersState  = {
    orders: []
}

const reducer:Reducer<OrdersState, OrderActions> = (state=initialState, action) => {
    switch(action.type){
        case 'ADD_ORDER': {
            //const date = new Date();
            return {
                orders: state.orders.concat( 
                    {
                        date: action.orderData.date,
                        id: action.orderData.id,
                        items: action.orderData.items,
                        totalAmount: action.orderData.totalAmount
                    }
                )
            }
        }
        case 'SET_ORDERS': {
            return {
                orders: action.orders
            }
        }
        default: return state;
    }
}

export default reducer;