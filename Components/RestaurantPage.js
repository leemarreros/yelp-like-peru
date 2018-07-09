import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  ScrollView
} from "react-native";

import Rating from "./Rating";
import { credentialGoogle } from "../keys";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

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
    geometry: {},
    name: "",
    photos: [],
    rating: "",
    reviews: [],
    international_phone_number: "",
    opening_hours: {}
  };
  componentWillMount() {
    const { item, fetch, fetching } = this.props.navigation.getParam(
      "fetch",
      {}
    );
    this.setState({
      item
    });
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
        this.setState({
          formatted_address,
          geometry,
          name,
          photos,
          rating,
          reviews,
          international_phone_number,
          opening_hours
        });
      });
    }
  }
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
    return (
      <ScrollView style={styles.restaurantPage}>
        <PhotosCarousel style={styles.listImages} photos={photos} />
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating rating={rating} style={styles.ratingWrapper} />
        <Text>Esta {opening_hours.open_now ? "abierto" : "cerrado"} ahora</Text>
        <Text numberOfLines={1}>Dirección: {formatted_address}</Text>
        <Text numberOfLines={1}>Teléfono: {international_phone_number}</Text>
        
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
    height: 400,
    width: 400,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
