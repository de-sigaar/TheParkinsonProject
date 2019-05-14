import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, Text, Platform } from "react-native";
import PropTypes from "prop-types";

import Colors from "../../constants/Colors";
import ProductSans from "../../constants/fonts/ProductSans";

export default class Button extends Component {
  static propTypes = {
    onPress: PropTypes.func,
    value: PropTypes.string,
    type: PropTypes.string.isRequired
  };

  render() {
    const { onPress, value, type } = this.props;
    const styleBackground = type === "dark" ? styles.darkBackground : styles.lightBackground;
    const styleText = type === "dark" ? styles.lightText : styles.darkText;
    const androidButtonStyle = Platform.OS === "android" && styles.androidButton;
    const androidTextStyle = Platform.OS === "android" && styles.androidText;

    return (
      <TouchableOpacity
        style={[styles.button, styleBackground, androidButtonStyle]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <Text style={[styles.text, styleText, androidTextStyle]}>{value}</Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    paddingTop: 15,
    paddingRight: 25,
    paddingBottom: 15,
    paddingLeft: 25,
    marginBottom: 10
  },
  androidButton: {
    paddingTop: 10,
    paddingRight: 20,
    paddingBottom: 10,
    paddingLeft: 20
  },
  text: {
    fontFamily: ProductSans.regular,
    fontSize: 20
  },
  androidText: {
    fontSize: 16
  },
  darkText: {
    color: Colors.darkGray
  },
  lightText: {
    color: Colors.white
  },
  darkBackground: {
    backgroundColor: Colors.darkGray
  },
  lightBackground: {
    backgroundColor: Colors.white
  }
});
