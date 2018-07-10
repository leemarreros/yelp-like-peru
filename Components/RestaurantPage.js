import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView,
  TouchableOpacity
} from "react-native";

import Rating from "./Rating";
import { credentialGoogle } from "../keys";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";

var { height, width } = Dimensions.get("window");

class PhotosCarousel extends Component {
  state = {
    imageUrl:
      "https://lh3.googleusercontent.com/p/AF1QipNVtrsACExpL_opYUpr1TMW8lGfU5Yz5gLcZbRQ=s1600-w150-h150",
    data: []
  };

  addToDataState = uriObject => {
    this.setState(({ data }) => {
      return { data: [...data, uriObject] };
    });
  };

  createGoogleLink = photo_reference => {
    return `https://maps.googleapis.com/maps/api/place/photo?photoreference=${photo_reference}&sensor=false&maxheight=500&maxwidth=500&key=${credentialGoogle}`;
  };

  componentDidUpdate(prevProps) {
    const { photos } = this.props;
    if (JSON.stringify(photos) !== JSON.stringify(prevProps.photos)) {
      if (photos.length > 0) {
        photos.forEach((item, i) => {
          fetch(this.createGoogleLink(item.photo_reference))
            .then(data => this.addToDataState({ uri: data.url }))
            .catch(e => console.log(e));
        });
      }
    }
  }
  render() {
    const { data } = this.state;
    return (
      <FlatList
        style={styles.listImagesFlat}
        keyExtractor={(x, i) => i.toString()}
        pagingEnabled={true}
        horizontal={true}
        data={data}
        renderItem={({ item }) => {
          return (
            <Image style={styles.imageReference} source={{ uri: item.uri }} />
          );
        }}
      />
    );
  }
}

class RestaurantPage extends Component {
  state = {
    item: {},
    formatted_address: "",
    geometry: { location: { lat: -12.0498958, long: -77.0803742 } },
    name: "",
    photos: [],
    rating: "",
    reviews: [],
    international_phone_number: "",
    opening_hours: {},
    region: {
      latitude: -12.0498958,
      longitude: -77.0803742,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002
    },
    marker: {
      latitude: -12.0498958,
      longitude: -77.0803742
    }
  };
  componentWillMount() {
    const { item, fetch, fetching } = this.props.navigation.getParam(
      "fetch",
      {}
    );
    this.setState({
      item
    });
    console.log("RestaurantPage");
    if (fetching) {
      fetch.then(data => data.json()).then(data => {
        const {
          formatted_address = "",
          geometry = {},
          name = "",
          photos = [],
          rating = "",
          reviews = [],
          international_phone_number = "",
          opening_hours = {}
        } = data.result;
        console.log("geometry", geometry);
        this.setState({
          formatted_address,
          geometry,
          name,
          photos,
          rating,
          reviews,
          international_phone_number,
          opening_hours,
          region: {
            latitude: geometry.location.lat,
            longitude: geometry.location.lng,
            latitudeDelta: 0.002,
            longitudeDelta: 0.002
          },
          marker: {
            latitude: geometry.location.lat,
            longitude: geometry.location.lng
          }
        });
      });
    }
  }
  onRegionChange = region => {};
  render() {
    const {
      itemData,
      formatted_address,
      geometry,
      name,
      photos,
      rating,
      reviews,
      international_phone_number,
      opening_hours
    } = this.state;

    const reviewsRender = (
      <View>
        <Text style={{ textAlign: "center", fontWeight: "bold" }}>Reviews</Text>
        {reviews.map((review, i) => {
          return (
            <View key={i} style={styles.wrapEachReview}>
              <Image
                style={styles.avatarAuthor}
                source={{ uri: review.profile_photo_url }}
              />

              <Text numberOfLines={1}>
                <Text style={{ fontWeight: "bold" }}>
                  {review.author_name} {review.rating}
                </Text>
              </Text>
              <Rating rating={review.rating} />
              <Text>{review.text}</Text>
            </View>
          );
        })}
      </View>
    );
    console.log("region", this.state.region);
    console.log("marker", this.state.marker);
    return (
      <ScrollView style={styles.restaurantPage}>
        <PhotosCarousel style={styles.listImages} photos={photos} />
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating rating={rating} style={styles.ratingWrapper} />
        <Text>Esta {opening_hours.open_now ? "abierto" : "cerrado"} ahora</Text>
        <Text numberOfLines={1}>Dirección: {formatted_address}</Text>
        <Text numberOfLines={1}>Teléfono: {international_phone_number}</Text>

        <View style={styles.mapView} pointerEvents="none">
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={this.state.region}
            onRegionChange={region => {
              console.log(region);
            }}>
            <Marker
              coordinate={this.state.marker}
              image={require("../img/place.png")}
            />
          </MapView>
        </View>

        {reviews.length > 0 ? reviewsRender : null}
      </ScrollView>
    );
  }
}

export default RestaurantPage;

const styles = StyleSheet.create({
  restaurantPage: {
    flex: 1
  },
  listImages: {
    flex: 1,
    flexDirection: "row"
  },
  listImagesFlat: {
    height: 200
  },
  imageReference: {
    height: 200,
    width: width
  },
  nameRestaurant: {
    fontSize: 40,
    textAlign: "center"
  },
  ratingWrapper: {},
  wrapEachReview: {
    flex: 1,
    backgroundColor: "grey"
  },
  avatarAuthor: {
    width: 50,
    height: 50,
    flex: 1
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 200,
    width: width,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "yellow"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: width,
    backgroundColor: "yellow"
  },

  mapView: {
    height: 200,
    backgroundColor: "yellow",
    width: width,
    justifyContent: "flex-end",
    alignItems: "center"
  }
});
