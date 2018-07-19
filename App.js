/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Modal } from "react-native";
import { createStackNavigator } from "react-navigation";
import Home from "./Components/Home";
import RestaurantList from "./Components/RestaurantList";
import RestaurantPage from "./Components/RestaurantPage";
import FullMapPage from "./Components/FullMapPage";
console.disableYellowBox = true;
import { YellowBox } from "react-native";
YellowBox.ignoreWarnings([
  "Warning: isMounted(...) is deprecated",
  "Module RCTImageLoader"
]);

const instructions = Platform.select({
  ios: "Press Cmd+R to reload,\n" + "Cmd+D or shake for dev menu",
  android:
    "Double tap R on your keyboard to reload,\n" +
    "Shake or press menu button for dev menu"
});

const RootStack = createStackNavigator(
  {
    Home: {
      screen: Home
    },
    RestaurantList: {
      screen: RestaurantList
    },
    RestaurantPage: {
      screen: RestaurantPage
    },
    FullMapPage: {
      screen: FullMapPage
    }
  },
  {
    initialRouteName: "Home"
  }
);

export default class App extends Component {
  render() {
    return <RootStack />;
  }
}
