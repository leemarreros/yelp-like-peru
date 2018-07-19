import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Button,
  Linking,
  Platform
} from "react-native";

import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
var { height, width } = Dimensions.get("window");

export default class FullMapPage extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: (
        <Text style={{ color: "white", fontSize: 16 }}>
          {navigation.getParam("name", "")}
        </Text>
      ),
      headerRight: (
        <TouchableOpacity
          onPress={navigation.getParam("triggerMap")}
          style={styles.headerRightButton}>
          <Text style={styles.headerRightText}>Navegar</Text>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: "#BC070A"
      }
    };
  };
  state = {
    marker: {},
    region: {},
    name: ""
  };
  componentWillMount() {
    const { marker, region } = this.props.navigation.getParam("map", {});
    const name = this.props.navigation.getParam("name", "");
    this.setState({
      marker,
      region,
      name
    });
  }
  componentDidMount() {
    this.props.navigation.setParams({ triggerMap: this._triggerMap });
  }
  _triggerMap = () => {
    const { marker, name } = this.state;
    // let url = `geo:${marker.latitude},${marker.longitude};`;

    const scheme = Platform.OS === "ios" ? "maps:0,0?q=" : "geo:0,0?q=:";
    const latLng = `${marker.latitude},${marker.longitude}`;
    const url =
      Platform.OS === "ios"
        ? `${scheme}${name}@${latLng}`
        : `${scheme}${latLng}(${name})`;

    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
        return;
      }
      Alert.alert("Error", "¡No se puede redirigir!", [{ text: "OK" }], {
        cancelable: false
      });
    });
  };
  render() {
    const { marker, region } = this.state;
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
    width: width
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: height,
    width: width,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  headerRightButton: {
    marginRight: 10
  },
  headerRightText: {
    color: "white",
    fontSize: 14
  }
});
