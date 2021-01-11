import React, { FC, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  StyleSheet,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { RootReducer, OrdersState } from "../../types";
import OrderItem from "../../components/shop/OrderItem";
import { loadOrders } from "../../store/actions/orders";
import Colors from "../../constants/colors";

const OrderScreen: FC = (props) => {
  const orders = useSelector<RootReducer, OrdersState>((state) => state.orders)
    .orders;
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await dispatch(loadOrders());
      setIsLoading(false);
    };
    load();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No orders to found!!!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={(item) => <OrderItem order={item.item} />}
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default OrderScreen;
