import React, { Component } from "react";

import { View, Text, StyleSheet, Dimensions, Button } from "react-native";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
var { height, width } = Dimensions.get("window");

export default class FullMapPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("name", ""),
      headerRight: <Button title="Info" />
    };
  };
  render() {
    const { marker, region } = this.props.navigation.getParam("map", {});
    return (
      <View style={styles.container}>
        <MapView provider={PROVIDER_GOOGLE} style={styles.map} region={region}>
          <Marker coordinate={marker} image={require("../img/place.png")} />
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    backgroundColor: "yellow"
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: height,
    width: width,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "yellow"
  }
});
