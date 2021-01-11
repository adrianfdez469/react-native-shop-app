import React, {FC, useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import Colors from '../../constants/colors'
import CartItem from './CartItem';
import moment from 'moment';
import Card from '../UI/Card'
import { Order } from '../../types';

type PropTypes = {
    order: Order
}

const OrderItem:FC<PropTypes> = props => {

    const [showDetails, setShowDetails] = useState<boolean>(false);

    return (
        <Card style={styles.orderItem}>
            <View style={styles.summary}>
                <Text style={styles.totalAmount}>${props.order.totalAmount.toFixed(2)}</Text>
                <Text style={styles.date}>{moment(props.order.date).format('MMMM Do YYYY, hh:mm')  }</Text>
            </View>
            <Button color={Colors.primary} title={`${!showDetails?'Show':'Hide'} Details`} onPress={setShowDetails.bind(this, state => !state)} />
            {showDetails && 
                <View style={styles.detailItems}>
                    {props.order.items.map(item => <CartItem cartItem={item} key={item.product.id}/>)}
                </View>
            }
        </Card>
    );
}

const styles = StyleSheet.create({
    orderItem: {
        margin: 20,
        overflow: 'hidden',
        padding: 10,
        alignItems: 'center'
    },
    summary: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15
    },
    totalAmount: {
        fontFamily: 'open-sans-bold',
        fontSize: 15
    },
    date: {
        fontFamily: 'open-sans',
        fontSize: 15,
        color: "#888"
    },
    detailItems: {
        width: '100%'
    }
});

export default OrderItem;