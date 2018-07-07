import React, { Component } from "react";
import { View, Text, StyleSheet, Image } from "react-native";

export default class Rating extends Component {
  render() {
    const rating = Math.floor(this.props.rating);
    let arrayImage = [];
    for (let i = 0; i < 5; i++) {
      arrayImage.push(
        i < rating ? (
          <Image
            key={i}
            style={styles.ratingStart}
            source={require("../img/star_filled.png")}
          />
        ) : (
          <Image
            key={i}
            style={styles.ratingStart}
            source={require("../img/star_empty.png")}
          />
        )
      );
    }
    return <View style={styles.wrapperStars}>{arrayImage}</View>;
  }
}

const styles = StyleSheet.create({
  wrapperStars: {
    flexDirection: "row"
  },
  ratingStart: {
    height: 15,
    width: 15
  }
});
