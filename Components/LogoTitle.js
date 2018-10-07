import React, { Component } from "react";

import { Image, View, StyleSheet, Platform } from "react-native";

export default class LogoTitle extends Component {
  render() {
    return (
      <View
        style={[
          styles.wrapperIconTitle,
          Platform.OS === "android" ? styles.adjutTitleAndroid : null
        ]}>
        <Image
          source={require("../img/logoTop.png")}
          style={styles.logoTitle}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapperIconTitle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  adjutTitleAndroid: {
    marginRight: 45
  },
  logoTitle: {
    width: 50,
    height: 50
  }
});
