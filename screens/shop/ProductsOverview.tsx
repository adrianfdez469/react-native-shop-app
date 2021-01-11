import React, { FC, useEffect, useState, useCallback } from "react";
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Button,
} from "react-native";
import { useSelector } from "react-redux";
import { RootReducer, IProduct, RootStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import ProductItem from "../../components/shop/ProductItem";
import { useDispatch } from "react-redux";
import { addToCart } from "../../store/actions/cart";
import { loadProducts } from "../../store/actions/products";
import Colors from "../../constants/colors";

type ProductOverviewScreenNavigationProp = StackScreenProps<
  RootStackParamList,
  "ProductOverview"
>;

const ProductsOverviewScreen: FC<ProductOverviewScreenNavigationProp> = (
  props
) => {
  const { navigation } = props;
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState(false);
  const products = useSelector<RootReducer, IProduct[]>(
    (state) => state.products.availabeProducts
  );
  const dispatch = useDispatch();

  const addToCardHandler = (product: IProduct) => {
    dispatch(addToCart(product));
  };

  const viewDeatailHandler = (product: IProduct) => {
    navigation.navigate("ProductDetails", product);
  };

  const load = useCallback(async () => {
    try {
      setError(false);
      setIsRefreshing(true);
      await dispatch(loadProducts());
    } catch (error) {
      setError(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, setLoading, setError]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener("focus", load);
    return unsubscribe;
  }, [load]);

  useEffect(() => {
    setLoading(true);
    load().then(() => {
      setLoading(false);
    });
  }, [load]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isLoading && products.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={{ fontFamily: "open-sans", fontSize: 15 }}>
          No products found!
        </Text>
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
        <Button title="Try again" onPress={load} color={Colors.primary} />
      </View>
    );
  }

  return (
    <>
      <FlatList<IProduct>
        onRefresh={load}
        refreshing={isRefreshing}
        data={products}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={(item) => {
          return (
            <ProductItem
              product={item.item}
              primaryAction={{
                action: viewDeatailHandler.bind(this, item.item),
                text: "View Details",
              }}
              secondaryAction={{
                action: addToCardHandler.bind(this, item.item),
                text: "Add to Cart",
              }}
            />
          );
        }}
      />
      {isLoading && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0, 0.5)",
            zIndex: 10,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              fontFamily: "open-sans",
              fontSize: 30,
              zIndex: 99,
              color: "black",
            }}
          >
            LOADING...
          </Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ProductsOverviewScreen;
