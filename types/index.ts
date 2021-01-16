import {Reducer} from 'react';

export interface IProduct {
    id: string;
    ownerId: string;
    title: string;
    imageUrl: string;
    description: string;
    price: number;
    ownerUserPushToken: string;
}

export interface ProductsState {
    availabeProducts: IProduct[],
    userProducst: IProduct[]
}

/*export interface ProductAction {
    type: 'ADD' | 'REMOVE',
    [props: string]: any
}*/

export interface RootReducer {
    products: ProductsState,
    cart: CartState,
    orders: OrdersState
}

export type RootStackParamList = {
    ProductOverview: undefined,
    ProductDetails: IProduct,
    CartScreen: undefined
}
export type AdminStackParamList = {
    UserProductScreen: undefined,
    EditProductScreen: {
        product?: IProduct
    }
}

export interface CartProduct {
    product: IProduct,
    quantity: number
}

export type ADD_TO_CART = {
    type: 'ADD_TO_CART',
    product: IProduct
}
export type REMOVE_FROM_CART = {
    type: 'REMOVE_FROM_CART',
    productId: string
}
export type CLEAR_CART = {
    type: 'CLEAR_CART'
}

export type CartActions = ADD_TO_CART | REMOVE_FROM_CART | CLEAR_CART | DELETE_PRODUCT;

export interface CartState {
    items: CartProduct[],
    totalAmount: number
}

export interface Order extends CartState {
    id:string;
    //items: CartProduct[];
    //totalAmount: number;
    date: Date
}

export interface OrdersState {
    orders: Order[]
}
export type ADD_ORDER = {
    type: 'ADD_ORDER',
    orderData: {
        items: CartProduct[],
        totalAmount: number,
        id: string,
        date: Date
    }
}
export type SET_ORDERS = {
    type: 'SET_ORDERS',
    orders: Order[]
}

export type OrderActions = ADD_ORDER | SET_ORDERS; 

export type DELETE_PRODUCT = {
    type: 'DELETE_PRODUCT',
    productId: string
}
export type ADD_PRODUCT = {
    type: 'ADD_PRODUCT',
    product: IProduct
}
export type EDIT_PRODUCT = {
    type: 'EDIT_PRODUCT',
    editableData: {
        productId: string,
        newTitle: string;
        newImageUrl: string;
        newDescription: string;
    }
}

export type SET_PRODUCTS = {
    type: 'SET_PRODUCTS',
    products: IProduct[],
    userId: string
}




export type ProductActions = DELETE_PRODUCT | ADD_PRODUCT | EDIT_PRODUCT | SET_PRODUCTS;

export type LOGOUT = {
    type: 'LOGOUT'
}

export type AUTHENTICATE = {
    type: 'AUTHENTICATE',
    idToken: string,
    userId: string
}

export type AUTH_ACTIONS = AUTHENTICATE | LOGOUT;

export interface InitialAuthState {
    isLoggedIn: boolean
};
export interface AuthState extends InitialAuthState {
    token: string
    //email: string
    //refreshToken: string
    //expiresIn: string
    userId: string
}

export type FullReduxState = {
    products: ProductsState,
    auth: AuthState,
    cart: CartState,
    orders: OrdersState
  } 
