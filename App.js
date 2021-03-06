import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyleSheet, View, Platform, StatusBar } from "react-native";
import { AppLoading, Asset, Font } from "expo";
import * as firebase from "firebase";
import { Provider } from "react-redux";
import store from "./store";

import ApiKeys from "./constants/ApiKeys";

import AppNavigator from "./navigation/AppNavigator";
import AuthNavigator from "./navigation/AuthNavigator";

import { MaterialIcons, AntDesign } from "@expo/vector-icons";

export default class App extends Component {
  static propTypes = {
    skipLoadingScreen: PropTypes.any
  };

  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
      isAuthenticationReady: false,
      isAuthenticated: false
    };

    // Initialize Firebase only when it hasn't been initialized yet
    if (!firebase.apps.length) firebase.initializeApp(ApiKeys.FirebaseConfig);
    firebase.auth().languageCode = "nl";
    firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged = user => {
    this.setState({
      ...this.state,
      isAuthenticationReady: true,
      isAuthenticated: !!user
    });
  };

  _loadResourcesAsync = async () => {
    // Load any resources needed within the application here
    cacheImages = images => {
      return images.map(image => {
        if (typeof image === "string") {
          return Image.prefetch(image);
        } else {
          return Asset.fromModule(image).downloadAsync();
        }
      });
    };
    cacheFonts = fonts => {
      return fonts.map(font => Font.loadAsync(font));
    };

    const imageAssets = cacheImages([
      require("./assets/images/auth/background.jpg"),
      require("./assets/images/icon/icon.png"),
      require("./assets/images/icon/splash.png"),
      require("./assets/images/icon/home/activiteiten.png"),
      require("./assets/images/icon/home/community.png"),
      require("./assets/images/icon/home/medicatie.png"),
      require("./assets/images/icon/home/oefeningen.png"),
      require("./assets/images/icon/home/schema.png"),
      require("./assets/images/icon/home/tipsTricks.png"),
      require("./assets/images/icon/moments/avondeten.png"),
      require("./assets/images/icon/moments/lunch.png"),
      require("./assets/images/icon/moments/ontbijt.png"),
      require("./assets/images/icon/moments/opstaan.png"),
      require("./assets/images/icon/moments/slapen.png"),
      require("./assets/images/icon/moments/tussendoortje.png"),
      require("./assets/images/icon/moments/tandenpoetsen.png")
    ]);
    const fontAssets = cacheFonts([
      AntDesign.font,
      MaterialIcons.font,
      { "product-sans": require("./assets/fonts/ProductSans/ProductSansRegular.ttf") },
      { "product-sans-bold": require("./assets/fonts/ProductSans/ProductSansBold.ttf") },
      { "product-sans-italic": require("./assets/fonts/ProductSans/ProductSansItalic.ttf") },
      { "product-sans-bold-italic": require("./assets/fonts/ProductSans/ProductSansBoldItalic.ttf") }
    ]);

    await Promise.all([...imageAssets, ...fontAssets]);
  };

  _handleLoadingError = error => {
    // eslint-disable-next-line no-console
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

  render() {
    const { isLoadingComplete, isAuthenticationReady, isAuthenticated } = this.state;
    const { skipLoadingScreen } = this.props;

    if ((!isLoadingComplete || !isAuthenticationReady) && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          {Platform.OS === "ios" && (
            <StatusBar animated={true} barStyle={isAuthenticated ? "default" : "light-content"} />
          )}
          <View style={styles.container}>{isAuthenticated ? <AppNavigator /> : <AuthNavigator />}</View>
        </Provider>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
