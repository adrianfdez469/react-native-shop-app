import React, { FC } from "react";
import { Platform } from "react-native";
import { useDispatch } from 'react-redux';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from "@react-navigation/drawer";
import ProductOverviewScreen from "../screens/shop/ProductsOverview";
import ProductDetailsScreen from "../screens/shop/ProductDetailsScreen";
import CartScreen from "../screens/shop/CartScreen";
import Colors from "../constants/colors";
import { RootStackParamList, AdminStackParamList, AuthState } from "../types";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/UI/HeaderButton";
import OrderScreen from "../screens/shop/OrdersScreen";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import UserProductScreen from "../screens/user/UserProductsScreen";
import EditProductScreen from "../screens/user/EditProductScreen";
import Auth from "../screens/user/AuthScreen";
import StartupScreen from '../screens/StartupScreen';
import { useSelector } from "react-redux";
import { Logout } from '../store/actions/auth';


const defaultStackOptions = {
  headerTintColor: Platform.OS === "android" ? "white" : Colors.primary,
  headerStyle: {
    backgroundColor: Platform.OS === "android" ? Colors.primary : "",
  },
  headerTitleStyle: {
    fontFamily: "open-sans-bold",
  },
  headerBackTitleStyle: {
    fontFamily: "open-sans",
  },
};

const MainStack = createStackNavigator<RootStackParamList>();
const MainStackNavigator: FC = () => {
  return (
    <MainStack.Navigator
      initialRouteName="ProductOverview"
      screenOptions={defaultStackOptions}
    >
      <MainStack.Screen
        name="ProductOverview"
        component={ProductOverviewScreen}
        options={({ navigation, route }) => ({
          title: "All Products",
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Cart"
                iconName={Platform.OS === "android" ? "md-cart" : "ios-cart"}
                onPress={() => {
                  navigation.navigate("CartScreen");
                }}
              />
            </HeaderButtons>
          ),
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
      <MainStack.Screen
        name="ProductDetails"
        component={ProductDetailsScreen}
        options={({ route }) => ({
          title: route.params.title,
        })}
      />
      <MainStack.Screen name="CartScreen" component={CartScreen} />
    </MainStack.Navigator>
  );
};

const OrderStack = createStackNavigator();
const OrderStackNavigator: FC = () => {
  return (
    <OrderStack.Navigator
      initialRouteName="OrderScreen"
      screenOptions={defaultStackOptions}
    >
      <OrderStack.Screen
        name="OrderScreen"
        component={OrderScreen}
        options={({ navigation }) => ({
          title: "Orders",
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
                onPress={() => {
                  navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
    </OrderStack.Navigator>
  );
};

const AdminStack = createStackNavigator<AdminStackParamList>();
const AdminStackNavigator: FC = () => {
  return (
    <AdminStack.Navigator screenOptions={defaultStackOptions}>
      <AdminStack.Screen
        name="UserProductScreen"
        component={UserProductScreen}
        options={(param) => ({
          title: "Your Products",
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName={Platform.OS === "android" ? "md-menu" : "ios-menu"}
                onPress={() => {
                  param.navigation.toggleDrawer();
                }}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
              <Item
                title="Menu"
                iconName={
                  Platform.OS === "android" ? "md-create" : "ios-create"
                }
                onPress={() => {
                  param.navigation.navigate("EditProductScreen");
                }}
              />
            </HeaderButtons>
          ),
        })}
      />
      <AdminStack.Screen
        name="EditProductScreen"
        component={EditProductScreen}
        options={({ route }) => ({
          title: route.params?.product
            ? `Edit ${route.params?.product?.title}`
            : "Add Product",
        })}
      />
    </AdminStack.Navigator>
  );
};

const StackLogin = createStackNavigator();
const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props:any) => {

    const dispatch = useDispatch();

    return (
        <DrawerContentScrollView {...props}>
          <DrawerItemList {...props} />
          <DrawerItem 
            label="Logout"
            icon={({color}) =>
                <AntDesign  name="logout" size={23} color={color} />
            }
            onPress={() => {
                dispatch(Logout());
            }}
            />  
        </DrawerContentScrollView>
    )
}

const DrawerShopNavigator: FC = () => {
  const isLoggedIn = useSelector<{ auth: AuthState }, boolean>((state) => {
    return state.auth.isLoggedIn;
  });

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        <Drawer.Navigator
          drawerContentOptions={{
            activeTintColor: Colors.primary,
          }}
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen
            name="MainStackNavigator"
            component={MainStackNavigator}
            options={{
              title: "Products",
              drawerIcon: ({ color }) => (
                <Ionicons
                  size={23}
                  name={Platform.OS === "android" ? "md-cart" : "ios-cart"}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="OrderStackNavigator"
            component={OrderStackNavigator}
            options={{
              title: "Orders",
              drawerIcon: ({ color }) => (
                <Ionicons
                  size={23}
                  name={Platform.OS === "android" ? "md-list" : "ios-list"}
                  color={color}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="AdminStackNavigator"
            component={AdminStackNavigator}
            options={{
              title: "Admin",
              drawerIcon: ({ color }) => (
                <Ionicons
                  size={23}
                  name={Platform.OS === "android" ? "md-create" : "ios-create"}
                  color={color}
                />
              ),
            }}
          />
        </Drawer.Navigator>
      ) : (
        <StackLogin.Navigator screenOptions={defaultStackOptions}>
          <StackLogin.Screen name="Startup" component={StartupScreen} />
          <StackLogin.Screen name={"Authenticate"} component={Auth}  />
        </StackLogin.Navigator>
      )}
    </NavigationContainer>
  );
};

export default DrawerShopNavigator;
