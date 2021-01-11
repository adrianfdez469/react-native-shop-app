import React, {FC} from 'react';
import {View, Button, Text, StyleSheet, ScrollView, Image} from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../types';
import Colors from '../../constants/colors';
import {useDispatch} from 'react-redux';
import { addToCart } from '../../store/actions/cart';

type ProductDetailsScreenProps = StackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetails:FC<ProductDetailsScreenProps> = props => {
    
    const dispatch = useDispatch();

    return (
        <ScrollView>
            <Image 
                style={styles.image}  
                source={{uri:props.route.params.imageUrl}}/>
                <View style={styles.actions}>
                    <Button 
                        title="Add to Cart" 
                        color={Colors.primary}
                        onPress={() => {
                            dispatch(addToCart(props.route.params))
                        }} 
                    />
                </View>
            <Text style={styles.price}>${props.route.params.price.toFixed(2)}</Text>
            <Text style={styles.description}>{props.route.params.description}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    actions: {
        marginVertical: 10,
        alignItems:'center'
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'open-sans-bold'
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 20,
        fontFamily: 'open-sans'
    }
});




export default ProductDetails;