import React, { FC, useEffect } from "react";
import {
  FlatList,
  View,
  StyleSheet,
  Text,
  Button,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootReducer, CartProduct } from "../../types";
import Colors from "../../constants/colors";
import CartItem from "../../components/shop/CartItem";
import { removeFromCart } from "../../store/actions/cart";
import { addOrder } from "../../store/actions/orders";
import { clearCart } from "../../store/actions/cart";
import Card from "../../components/UI/Card";

const CartScreen: FC = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const cartTotalAmount = useSelector<RootReducer, number>(
    (state) => state.cart.totalAmount
  );
  const cartItems = useSelector<RootReducer, CartProduct[]>(
    (state) => state.cart.items
  );

  const dispatch = useDispatch();

  const removeCartItemHandler = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const addOrderHandler = async (
    cartItems: CartProduct[],
    totalAmount: number
  ) => {
    setError(false);
    setIsLoading(true);
    try {
      await dispatch(addOrder(cartItems, totalAmount));
      dispatch(clearCart());
    } catch (error) {
      setError(true);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (error) {
      Alert.alert("An error ocurred!", "Can't create the order", [
        { text: "Okay" },
      ]);
    }
  }, [error]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Card style={styles.summary}>
        <Text style={styles.summaryText}>
          Total:{" "}
          <Text style={styles.amount}>${cartTotalAmount.toFixed(2)}</Text>
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : (
          <Button
            color={Colors.accent}
            title="Order Now"
            disabled={cartItems.length === 0}
            onPress={() => {
              addOrderHandler(cartItems, cartTotalAmount);
            }}
          />
        )}
      </Card>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.product.id}
        renderItem={(item) => (
          <CartItem
            cartItem={item.item}
            onRemove={() => removeCartItemHandler(item.item.product.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    margin: 20,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    padding: 10,
  },
  summaryText: {
    fontFamily: "open-sans-bold",
    fontSize: 18,
  },
  amount: {
    color: Colors.primary,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CartScreen;
