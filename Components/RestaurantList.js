import React, { Component } from "React";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image
} from "react-native";

import Rating from "./Rating";
import LogoTitle from "./LogoTitle";

import { generateLinkGoogle } from "./utils.js";

class DisplayItemList extends Component {
  state = {
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipNVtrsACExpL_opYUpr1TMW8lGfU5Yz5gLcZbRQ=s1600-w150-h150"
  };
  getDistance = (p1, p2) => {
    const rad = x => {
      return (x * Math.PI) / 180;
    };
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.lat - p1.lat);
    var dLong = rad(p2.lng - p1.lng);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.lat)) *
        Math.cos(rad(p2.lat)) *
        Math.sin(dLong / 2) *
        Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d; // returns the distance in meter
  };
  componentWillMount() {
    const { photo_reference } = this.props;
    if (photo_reference !== " ") {
      const link = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=150&maxheight=150&key=AIzaSyBRk4uEysUxoObBmGAzmz3eEbq_O48E7xg&photoreference=${photo_reference}`;
      fetch(link).then(data => {
        this.setState({
          imageUrl: data.url
        });
      });
    }
  }
  onClickRestListItem = () => {
    const { item, lat, long } = this.props;
    this.props.navigation.navigate("RestaurantPage", {
      fetch: {
        item,
        fetch: fetch(
          generateLinkGoogle(item.place_id, "placeDetails", {}, lat, long)
        ),
        fetching: true
      }
    });
  };
  render() {
    // current location
    const { item, lat, long, radius } = this.props;

    // place's location
    const coords = item.geometry.location;
    const distance = (
      this.getDistance(
        { lat, lng: long },
        { lat: coords.lat, lng: coords.lng }
      ) / 1000
    ).toFixed(2);

    const openNowExists = !!item.opening_hours;

    return (
      <TouchableOpacity
        onPress={this.onClickRestListItem}
        style={styles.itemDisplayWrapper}>
        <View style={styles.wrapperImage}>
          <Image
            style={styles.imageDisplayItemList}
            source={{
              uri: this.state.imageUrl
            }}
          />
        </View>
        <View style={styles.wrapperText}>
          <Text numberOfLines={1} style={styles.titleRest}>
            {item.name}
          </Text>
          {openNowExists ? (
            <Text
              style={[
                item.opening_hours.open_now
                  ? styles.openNowText
                  : styles.closeNowText
              ]}>
              Está {item.opening_hours.open_now ? "abierto" : "cerrado"}
            </Text>
          ) : (
            <Text />
          )}
          <Rating rating={item.rating} />
          <Text numberOfLines={1}>{item.vicinity}</Text>
          <Text>Está a {distance} km.</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class RestaurantList extends Component {
  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: "#BC070A"
    }
  };

  state = {
    partialRestaurantList: [],
    completeList: [],
    lat: -12.0498958,
    long: -77.0803742
  };
  handleLoadMore = () => {
    const lengthPartial = this.state.partialRestaurantList.length;
    const lengthComplete = this.state.completeList.length;
    if (lengthPartial !== lengthComplete) {
      this.setState({
        partialRestaurantList: [
          ...this.state.completeList.slice(0, lengthPartial + 7)
        ]
      });
    }
  };

  componentWillMount() {
    const {
      fetch,
      fetching,
      lat,
      long,
      generateLinkGoogle
    } = this.props.navigation.getParam("fetch", {});
    if (fetching) {
      fetch.then(data => data.json()).then(data => {
        this.setState(
          {
            completeList: [...data.results],
            nextPageToken: data.next_page_token || "",
            lat,
            long
          },
          this.handleLoadMore
        );
      });
      return;
    }
    this.setState(
      {
        completeList: this.props.navigation.getParam("restaurantList", [])
      },
      this.handleLoadMore
    );
  }

  render() {
    return (
      <View style={styles.bodyResultsContainer}>
        <FlatList
          keyExtractor={(x, i) => i.toString()}
          renderItem={({ item }) => {
            const photo_reference = !!item.photos
              ? item.photos[0].photo_reference
              : "";
            return (
              <DisplayItemList
                navigation={this.props.navigation}
                item={item}
                lat={this.state.lat}
                long={this.state.long}
                photo_reference={photo_reference}
              />
            );
          }}
          onEndReachedThreshold={0.25}
          onEndReached={this.handleLoadMore}
          data={this.state.partialRestaurantList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bodyResultsContainer: {
    flex: 1,
    flexDirection: "column"
  },
  itemDisplayWrapper: {
    minHeight: 100,
    flex: 1,
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#BC070A",
    marginHorizontal: 10,
    marginBottom: 6,
    paddingBottom: 6
  },
  wrapperImage: {
    flex: 1,
    padding: 4,
    borderRadius: 5
  },
  wrapperText: {
    flex: 3,
    marginLeft: 2
  },
  imageDisplayItemList: {
    flex: 1
  },
  titleRest: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "Helvetica",
    color: "#BC070A"
  },
  wrapperStars: {
    flexDirection: "row"
  },
  ratingStart: {
    height: 15,
    width: 15
  },
  openNowText: {
    color: "#51a953"
  },
  closeNow: {
    color: "#51a953"
  }
});
