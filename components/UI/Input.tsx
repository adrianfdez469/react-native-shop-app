import React, { FC, useReducer, Reducer, useEffect, useCallback } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TextInputProps,
  TextInputIOSProps,
  TextInputAndroidProps,
} from "react-native";

type InputChange = {
  type: "INPUT_CHANGE";
  payload: {
    value: string;
    isValid: boolean;
  };
};
type InputBlur = {
  type: "INPUT_BLUR";
};
type Action = InputChange | InputBlur;
type State = {
  value: string;
  valid: boolean;
  touched: boolean;
};
const inputReducer: Reducer<State, Action> = (prevState, action) => {
  switch (action.type) {
    case "INPUT_CHANGE":
      return {
        ...prevState,
        value: action.payload.value,
        valid: action.payload.isValid,
      };
    case "INPUT_BLUR":
      return {
        ...prevState,
        touched: true,
      };
    default:
      return prevState;
  }
};

interface Props
  extends TextInputProps,
    TextInputIOSProps,
    TextInputAndroidProps {
  id: string;
  label: string;
  initialValue?: string;
  initialValidity?: boolean;
  onInputChange: (id: string, value: string, isValid: boolean) => void;
  errorText: string;
  required?: boolean;
  email?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
}

const Input: FC<Props> = (props) => {
  // hooks
  const [inputState, inputDispacher] = useReducer(inputReducer, {
    value: props.initialValue || "",
    valid: props.initialValidity || false,
    touched: false,
  });

  const { onInputChange, id } = props;
  const { touched, value, valid } = inputState;
  useEffect(() => {
    if (touched) {
      onInputChange(id, value, valid);
    }
  }, [touched, valid, value, onInputChange, id]);

  // handlers
  const textChangeHandler = (text: string) => {
    // validations
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let isValid = true;
    if (props.required && text.trim().length === 0) {
      isValid = false;
    }
    if (props.email && !emailRegex.test(text.toLowerCase())) {
      isValid = false;
    }
    if (props.min && +text < props.min) {
      isValid = false;
    }
    if (props.max && +text > props.max) {
      isValid = false;
    }
    if (props.minLength && text.length < props.minLength) {
      isValid = false;
    }

    // dispatcher
    inputDispacher({
      type: "INPUT_CHANGE",
      payload: { value: text, isValid: isValid },
    });
  };

  /*const lostFocusHandler = () => {
    inputDispacher({ type: "INPUT_BLUR" });
  };*/
  const onTouched = () => {
    inputDispacher({ type: "INPUT_BLUR" });
  };

  return (
    <View style={styles.formControl}>
      <Text style={styles.label}>{props.label}</Text>
      <TextInput
        {...props}
        style={styles.input}
        value={inputState.value}
        onChangeText={textChangeHandler}
        //onBlur={lostFocusHandler}
        onFocus={onTouched}
      />

      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {!inputState.valid && inputState.touched ? props.errorText : ""}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formControl: {
    width: "100%",
  },
  label: {
    fontFamily: "open-sans-bold",
    marginVertical: 8,
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: "#888",
    borderBottomWidth: 1,
  },
  errorText: {
    color: "red",
    fontFamily: "open-sans",
    fontSize: 12,
  },
  errorContainer: {
    marginVertical: 5,
  },
});

export default React.memo(Input);
