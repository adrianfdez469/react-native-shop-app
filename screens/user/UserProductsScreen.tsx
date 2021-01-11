import React, { FC, useCallback } from "react";
import {
  FlatList,
  Alert,
  View,
  ActivityIndicator,
  StyleSheet,
  Text,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import { RootReducer, IProduct, AdminStackParamList } from "../../types";
import { deleteProduct } from "../../store/actions/products";
import { StackScreenProps } from "@react-navigation/stack";
import Colors from "../../constants/colors";

type PropTypes = StackScreenProps<AdminStackParamList, "UserProductScreen">;

const UserProductScreen: FC<PropTypes> = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);

  const userProducts = useSelector<RootReducer, IProduct[]>(
    (state) => state.products.userProducst
  );
  const dispatch = useDispatch();

  const deleteHandler = (item: IProduct) => {
    Alert.alert("Are you suer?", "Do you want to delete this item?", [
      { text: "No", style: "default" },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            setError(false);
            setIsLoading(true);
            await dispatch(deleteProduct(item.id));
          } catch (error) {
            setError(true);
          }
          setIsLoading(false);
        },
      },
    ]);
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text
          style={{ fontFamily: "open-sans", fontSize: 15, marginBottom: 10 }}
        >
          An error occurred!
        </Text>
      </View>
    );
  }

  if (userProducts.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No products created.</Text>
        <Text>You can start createing one!</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={userProducts}
      keyExtractor={(item) => item.id}
      renderItem={(item) => (
        <ProductItem
          product={item.item}
          primaryAction={{
            text: "Edit",
            action: () => {
              props.navigation.navigate("EditProductScreen", {
                product: item.item,
              });
            },
          }}
          secondaryAction={{
            text: "Delete",
            action: () => {
              deleteHandler(item.item);
            },
          }}
        />
      )}
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
export default UserProductScreen;
