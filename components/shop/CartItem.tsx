import React, {FC} from 'react';
import {StyleSheet, View, Text, Platform} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomTouchable from '../UI/Touchable';
import { CartProduct } from '../../types';


type CartItemPropTypes = {
    onRemove?: () => void,
    cartItem: CartProduct
}

const CartItem:FC<CartItemPropTypes> = props => {


    return (
        <View style={styles.cartItem}>
            <View style={styles.itemData}>
                <Text style={styles.quantity}>{props.cartItem.quantity} </Text>
                <Text style={styles.mainText}> {props.cartItem.product.title}</Text>
            </View>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>{(props.cartItem.product.price * props.cartItem.quantity).toFixed(2)}</Text>
                {
                    props.onRemove && 
                        <CustomTouchable
                            style={styles.deleteButton} 
                            onPress={props.onRemove}
                        >
                            <Ionicons 
                                name={Platform.OS === "android" ? 'md-trash':'ios-trash'}
                                size={23}
                                color="red"
                            />
                        </CustomTouchable>
                }
            </View>
        </View>
    );

}

const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemData:{
        flexDirection: 'row',
        alignItems: 'center'
    },
    quantity: {
        fontFamily: 'open-sans',
        color: '#888',
        fontSize: 16
    },
    mainText: {
        fontFamily:'open-sans-bold',
        fontSize: 16,
        marginRight: 20
    },
    deleteButton:{
        marginLeft: 20
    }
});

export default CartItem;