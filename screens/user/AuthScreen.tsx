import React, {
  FC,
  useState,
  Reducer,
  useReducer,
  useCallback,
  useEffect,
} from "react";
import {
  StyleSheet,
  ScrollView,
  Button,
  View,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useDispatch } from "react-redux";
import Card from "../../components/UI/Card";
import Input from "../../components/UI/Input";
import Colors from "../../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { SignUp, Login } from "../../store/actions/auth";

type formFields = "email" | "password";
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

const AuthScreen: FC = ({}) => {
  // hooks
  const [formState, formDispatcher] = useReducer(formReducer, {
    inputValues: {
      email: "",
      password: "",
    },
    inputValidities: {
      email: false,
      password: false,
    },
    formIsValid: false,
  });
  const dispatch = useDispatch();
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  // effects
  useEffect(() => {
    if (error) {
      Alert.alert("An error has occured", error, [
        {
          text: "Okay",
        },
      ]);
    }
  }, [error]);

  // handlers
  const onEmailChange = useCallback(
    (id: string, value: string, isValid: boolean) => {
      formDispatcher({
        type: "FORM_INPUT_UPDATE",
        payload: {
          field: "email",
          isValid,
          value,
        },
      });
    },
    [formDispatcher]
  );

  const onPassChange = useCallback(
    (id: string, value: string, isValid: boolean) => {
      formDispatcher({
        type: "FORM_INPUT_UPDATE",
        payload: {
          field: "password",
          isValid,
          value,
        },
      });
    },
    [formDispatcher]
  );

  const switchAuthHandler = () => {
    setIsSignUp((state) => !state);
  };

  const authHandler = async () => {
    if (!formState.formIsValid) {
      Alert.alert("Invalid fields", "Check out the invalid fields", [
        { text: "Okay", style: "default" },
      ]);
      return;
    }
    let action;
    if (isSignUp) {
      action = Login(
        formState.inputValues.email,
        formState.inputValues.password
      );
    } else {
      action = SignUp(
        formState.inputValues.email,
        formState.inputValues.password
      );
    }
    try {
      setError(undefined);
      setIsLoading(true);
      await dispatch(action);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior="height" style={styles.screen}>
      <LinearGradient colors={["#ffedff", "#ffe3ff"]} style={styles.gradient}>
        <Card style={styles.authContainer}>
          <ScrollView>
            <Input
              id="email"
              label="E-mail"
              keyboardType="email-address"
              required
              email
              errorText="Please enter a valid email address"
              onInputChange={onEmailChange}
              initialValue=""
            />
            <Input
              id="password"
              label="Password"
              keyboardType="default"
              secureTextEntry
              required
              minLength={5}
              autoCapitalize="none"
              errorText="Please enter a valid email password"
              onInputChange={onPassChange}
              initialValue=""
            />
            <View style={styles.Button}>
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Button
                  title={isSignUp ? "Login" : "Sign Up"}
                  color={Colors.primary}
                  onPress={authHandler}
                />
              )}
            </View>
            <View style={styles.Button}>
              <Button
                title={`Switch to ${isSignUp ? "Sign UP" : "Login"}`}
                color={Colors.accent}
                onPress={switchAuthHandler}
              />
            </View>
          </ScrollView>
        </Card>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  authContainer: {
    width: "80%",
    maxWidth: 400,
    maxHeight: 400,
    padding: 20,
  },
  Button: {
    marginTop: 10,
  },
});

export default AuthScreen;
