import { Reducer } from 'react';
import { ProductsState, ProductActions } from '../../types/index';

const initialState: ProductsState = {
    availabeProducts: [],
    userProducst: []
}

const reducer: Reducer<ProductsState, ProductActions> = (state = initialState, action) => {

    switch (action.type) {
        case 'DELETE_PRODUCT': {
            return {
                ...state,
                userProducst: state.userProducst.filter(p => p.id !== action.productId),
                availabeProducts: state.availabeProducts.filter(p => p.id !== action.productId)
            }
        }
        case 'ADD_PRODUCT': {
            return {
                availabeProducts: [...state.availabeProducts, action.product],
                userProducst: [...state.userProducst, action.product]
            }
        }
        case 'EDIT_PRODUCT': {
            
            const availableProdIndex = state.availabeProducts.findIndex(p => p.id === action.editableData.productId);
            const userProdIndex = state.userProducst.findIndex(p => p.id === action.editableData.productId);

            return {
                availabeProducts: [...state.availabeProducts.slice(0,availableProdIndex), {
                    ...state.availabeProducts[availableProdIndex],
                    description: action.editableData.newDescription,
                    imageUrl:action.editableData.newImageUrl,
                    title: action.editableData.newTitle
                }, ...state.availabeProducts.slice(availableProdIndex+1)],
                userProducst: [...state.userProducst.slice(0,userProdIndex), {
                    ...state.userProducst[userProdIndex],
                    description: action.editableData.newDescription,
                    imageUrl:action.editableData.newImageUrl,
                    title: action.editableData.newTitle
                }, ...state.userProducst.slice(userProdIndex+1)],
            }
        }
        case 'SET_PRODUCTS': {
            return {
                availabeProducts: action.products,
                userProducst: action.products.filter(prod => prod.ownerId === action.userId)
            }
        }
        default: return state;
    }
}

export default reducer;