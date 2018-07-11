import React, { Component } from "react";

import { Image, View, StyleSheet } from "react-native";

export default class LogoTitle extends Component {
  render() {
    return (
      <View style={styles.wrapperIconTitle}>
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
  logoTitle: {
    width: 50,
    height: 50
  }
});
