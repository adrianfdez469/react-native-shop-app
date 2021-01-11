import { ADD_TO_CART, IProduct, REMOVE_FROM_CART, CLEAR_CART } from '../../types';

export const addToCart = (product:IProduct):ADD_TO_CART => {
    return {
        type: 'ADD_TO_CART',
        product: product
    }
}

export const removeFromCart = (productId:string):REMOVE_FROM_CART => {
    return {
        type: 'REMOVE_FROM_CART',
        productId: productId
    }
}

export const clearCart = ():CLEAR_CART => {
    return {
        type: 'CLEAR_CART'
    }
}