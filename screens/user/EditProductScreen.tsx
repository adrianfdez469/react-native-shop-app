import React, {
  FC,
  useReducer,
  useLayoutEffect,
  Reducer,
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator,
  Text,
} from "react-native";
import { useDispatch } from "react-redux";
import Input from "../../components/UI/Input";
import { AdminStackParamList } from "../../types";
import { StackScreenProps } from "@react-navigation/stack";
import CustomHeaderButton from "../../components/UI/HeaderButton";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { addProduct, editProduct } from "../../store/actions/products";
import Colors from "../../constants/colors";

type formFields = "title" | "imageUrl" | "description" | "price";
type State = {
  inputValues: { [field in formFields]: string };
  inputValidities: { [field in formFields]: boolean };
  formIsValid: boolean;
};
type FormInputUpdate = {
  type: "FORM_INPUT_UPDATE";
  payload: {
    value: string;
    isValid: boolean;
    field: formFields;
  };
};
type Action = FormInputUpdate;

const formReducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case "FORM_INPUT_UPDATE": {
      const newState = {
        inputValues: {
          ...state.inputValues,
          [action.payload.field]: action.payload.value,
        },
        inputValidities: {
          ...state.inputValidities,
          [action.payload.field]: action.payload.isValid,
        },
      };
      const formIsValid = Object.values(newState.inputValidities).reduce(
        (acum, validity) => acum && validity,
        true
      );
      return {
        ...newState,
        formIsValid: formIsValid,
      };
    }
    default:
      return state;
  }
};

type PropTypes = StackScreenProps<AdminStackParamList, "EditProductScreen">;

const EditProduct: FC<PropTypes> = ({ route, navigation }) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>();

  const dispatch = useDispatch();
  const [formState, formDispatcher] = useReducer(formReducer, {
    inputValues: {
      title: route?.params?.product?.title || "",
      imageUrl: route?.params?.product?.imageUrl || "",
      description: route?.params?.product?.description || "",
      price: "",
    },
    inputValidities: {
      title: route?.params?.product?.title ? true : false,
      imageUrl: route?.params?.product?.imageUrl ? true : false,
      description: route?.params?.product?.description ? true : false,
      price: route?.params?.product?.price ? true : false,
    },
    formIsValid: route?.params?.product?.title ? true : false,
  });

  const inputChangeHandler = useCallback(
    (field: string, inputValue: string, inputValidity: boolean) => {
      formDispatcher({
        type: "FORM_INPUT_UPDATE",
        payload: {
          field: field as formFields,
          isValid: inputValidity,
          value: inputValue,
        },
      });
    },
    [formDispatcher]
  );

  const saveHandler = async () => {
    if (!formState.formIsValid) {
      Alert.alert("Wrong input", "Check errors in the form", [
        { text: "Okay", style: "default" },
      ]);
      return;
    }
    setError(undefined);
    setIsLoading(true);
    try {
      if (route.params?.product) {
        await dispatch(
          editProduct(route.params.product.id, {
            description: formState.inputValues.description,
            imageUrl: formState.inputValues.imageUrl,
            ownerId: "",
            price: Number(formState.inputValues.price),
            title: formState.inputValues.title,
            id: route.params.product.id,
          })
        );
      } else {
        await dispatch(
          addProduct({
            id: new Date().getTime().toString(),
            description: formState.inputValues.description,
            imageUrl: formState.inputValues.imageUrl,
            ownerId: "",
            price: Number(formState.inputValues.price),
            title: formState.inputValues.title,
          })
        );
      }
      navigation.goBack();
    } catch (error) {
      setError(error.message);
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
          <Item
            title="Save"
            iconName={
              Platform.OS === "android" ? "md-checkmark" : "ios-checkmark"
            }
            onPress={saveHandler}
          />
        </HeaderButtons>
      ),
    });
  }, [navigation, formState]);

  useEffect(() => {
    if (error) {
      Alert.alert("An error has occurred!", error, [{ text: "OKay" }]);
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
    <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={20}>
      <ScrollView>
        <View style={styles.form}>
          <Input
            id="title"
            label="Title"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            errorText="Invalid title"
            initialValidity={route?.params?.product?.title ? true : false}
            initialValue={route?.params?.product?.title || ""}
            onInputChange={inputChangeHandler}
            required
            minLength={3}
          />
          <Input
            id="imageUrl"
            label="Image Url"
            keyboardType="default"
            returnKeyType="next"
            errorText="Invalid image url"
            initialValidity={route?.params?.product?.imageUrl ? true : false}
            initialValue={route?.params?.product?.imageUrl || ""}
            onInputChange={inputChangeHandler}
          />

          {!route.params?.product && (
            <Input
              id="price"
              label="Price"
              returnKeyType="next"
              keyboardType="decimal-pad"
              errorText="Invalid price"
              onInputChange={inputChangeHandler}
              required
              min={0}
              max={1000}
            />
          )}
          <Input
            id="description"
            label="Description"
            errorText="Invalid description"
            autoCapitalize="sentences"
            keyboardType="default"
            autoCorrect
            multiline
            numberOfLines={3}
            initialValidity={route?.params?.product?.description ? true : false}
            initialValue={route?.params?.product?.description || ""}
            onInputChange={inputChangeHandler}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  form: {
    margin: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default EditProduct;
