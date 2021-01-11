import { Reducer } from 'react';
import CartItem from '../../components/shop/CartItem';
import { CartState, CartActions } from '../../types';

const initialState:CartState = {
    items: [],
    totalAmount: 0
}

const reducer: Reducer<CartState, CartActions> = (state = initialState, action) => {
    switch(action.type){
        case 'ADD_TO_CART': {
            const addProduct = action.product;
            const pIndex = state.items.findIndex(p => p.product.id === addProduct.id);
            const newTotalAmmount = state.totalAmount + action.product.price;
            if(pIndex >= 0){
                const newItem = {...state.items[pIndex]};
                newItem.quantity++;
                return {
                    totalAmount: newTotalAmmount, 
                    items: state.items.slice(0, pIndex).concat(newItem).concat(state.items.slice(pIndex+1))
                }
            }else{
                return {
                    totalAmount:newTotalAmmount,
                    items: [...state.items, {
                        product: action.product,
                        quantity: 1
                    }]
                }
            }
        };
        case 'REMOVE_FROM_CART': {
            const cartItemIndex = state.items.findIndex(cp => cp.product.id === action.productId);
            if(cartItemIndex >= 0){
                const newTotalAmount = state.totalAmount - state.items[cartItemIndex].product.price;
                const cartItem = {...state.items[cartItemIndex]};
                if(cartItem.quantity === 1){
                    return {
                        totalAmount: newTotalAmount,
                        items: state.items.slice(0, cartItemIndex).concat(state.items.slice(cartItemIndex+1))
                    }
                }else{
                    cartItem.quantity--;
                    return {
                        totalAmount: newTotalAmount,
                        items: state.items.slice(0, cartItemIndex).concat(cartItem).concat(state.items.slice(cartItemIndex+1))
                    }
                }
            } else {
                return state;
            }
        }
        case 'CLEAR_CART': return initialState;
        case 'DELETE_PRODUCT': {

            const prodCartIndex = state.items.findIndex(cartItem => cartItem.product.id === action.productId);
            if(prodCartIndex >= 0){
                return {
                    items: state.items.filter(it => it.product.id !== action.productId),
                    totalAmount: state.totalAmount - (state.items[prodCartIndex].quantity * state.items[prodCartIndex].product.price)
                }
            } 
            return state;
        }
        
        default: return state;
    }
}

export default reducer;