import React, { FC } from "react";
import { StyleSheet, View } from "react-native";

type PropTypes = {
  style?: {
    [prop: string]: any;
  };
};

const Card: FC<PropTypes> = (props) => {
  return (
    <View style={{ ...styles.card, ...props.style }}>{props.children}</View>
  );
};

const styles = StyleSheet.create({
  card: {
    shadowColor: "black",
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
    borderRadius: 10,
    backgroundColor: "white",
  },
});

export default Card;
