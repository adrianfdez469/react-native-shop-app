import React, {FC} from 'react';
import {StyleSheet, View, Text, Image, Button, Platform,TouchableOpacity, TouchableNativeFeedback} from 'react-native';
import CustomTouchable from '../UI/Touchable';
import Colors from '../../constants/colors';
import {IProduct} from '../../types';
import Card from '../UI/Card';

type Action = {
    text:string,
    action: () => void
}
type ProductItemPropTypes = {
    product: IProduct;
    //onViewDetail: () => void;
    //onAddToCart: () => void;

    primaryAction: Action,
    secondaryAction: Action

}

const ProductItem:FC<ProductItemPropTypes> = ({product, primaryAction, secondaryAction}) => {

    return (

        <Card style={styles.product}>
            <View style={styles.touchable}>
                <CustomTouchable onPress={primaryAction.action} useForeground>
                <View>                    
                    <Image style={styles.image} source={{ uri: product.imageUrl }} />                    
                    <View style={styles.details}>
                    <Text style={styles.title}>{product.title}</Text>
                    <Text style={styles.price}>${product.price.toFixed(2)}</Text>
                    </View>                    
                    <View style={styles.actions}>
                        <Button title={primaryAction.text} onPress={primaryAction.action} color={Colors.primary}/>
                        <Button title={secondaryAction.text} onPress={secondaryAction.action} color={Colors.primary}/>
                    </View>
                </View>
                </CustomTouchable>
            </View>
        </Card>
    );
}

const styles = StyleSheet.create({
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    product: {
        
        height: 300,
        margin: 20,
        ///overflow: 'hidden'
    },
    details: {
        alignItems: 'center',
        height: '15%',
        padding: 10
    },
    image: {
        width: '100%',
        height: '60%'
    },
    title: {
        fontSize: 18,
        marginVertical:2,
        fontFamily: 'open-sans-bold'
    },
    price: {
        fontSize: 14,
        color: '#888',
        fontFamily: 'open-sans'
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '25%',
        paddingHorizontal: 20
    }
});

export default ProductItem;