import { credentialGoogle } from "../keys";
import Rating from "./Rating";
import React, { Component } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
  Alert
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import LogoTitle from "./LogoTitle";
var { height, width } = Dimensions.get("window");

class PhotosCarousel extends Component {
  state = {
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
    const { data, source, loaded } = this.state;
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
  static navigationOptions = {
    // headerTitle instead of title
    headerTitle: <LogoTitle />,
    headerStyle: {
      backgroundColor: "#BC070A"
    }
  };

  state = {
    item: {},
    formatted_address: "",
    geometry: { location: { lat: -12.0498958, long: -77.0803742 } },
    name: "",
    photos: [],
    rating: "",
    reviews: [],
    international_phone_number: "",
    opening_hours: { open_now: true, weekday_text: [] },
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
        console.log("data.result", data.result);
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

  showFullMapPage = () => {
    console.log("showFullMapPage", this.state.marker, this.state.region);

    this.props.navigation.navigate("FullMapPage", {
      map: {
        region: this.state.region,
        marker: this.state.marker
      },
      name: this.state.name
    });
  };

  triggerPhoneCall = number => {
    if (number === "") {
      Alert.alert("Número de teléfono", "No encontrado", [{ text: "OK" }], {
        cancelable: false
      });
      return;
    }
    Linking.openURL(`tel:${number}`);
  };

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
      <View style={styles.reviewsBlock}>
        <Text style={styles.reviewsTitle}>COMENTARIOS</Text>
        {reviews.map((review, i) => {
          return (
            <View key={i} style={styles.wrapEachReview}>
              <View style={styles.leftSideReview}>
                <Image
                  style={styles.avatarAuthor}
                  source={{ uri: review.profile_photo_url }}
                />
              </View>
              <View style={styles.rightSideReview}>
                <Text numberOfLines={1}>
                  <Text style={{ fontWeight: "bold" }}>
                    {review.author_name} {review.rating}
                  </Text>
                </Text>
                <Rating rating={review.rating} />
                <Text>{review.text}</Text>
              </View>
            </View>
          );
        })}
      </View>
    );
    let today = new Date().getDay();
    const dayOfDate = today > 0 ? today - 1 : 6;

    return (
      <ScrollView style={styles.restaurantPage}>
        <PhotosCarousel style={styles.listImages} photos={photos} />
        <Text style={styles.nameRestaurant}>{name}</Text>
        <View style={styles.centerTextContainer}>
          <View style={styles.centerTextLeft}>
            <View style={styles.containerCal}>
              <Text style={[styles.fontLeft]}>CALIFICACIÓN</Text>
            </View>
            <View style={styles.containerHorario}>
              <Image
                resizeMode="contain"
                style={styles.imageHorario}
                source={require("../img/clock.png")}
              />
              <Text style={styles.fontLeft}>HORARIO</Text>
            </View>
            <View style={styles.containerLug}>
              <View>
                <Image
                  resizeMode="contain"
                  style={styles.imageHorario}
                  source={require("../img/place.png")}
                />
              </View>
              <View>
                <Text style={styles.fontLeft}>LUGAR</Text>
              </View>
            </View>
          </View>
          <View style={styles.centerTextRight}>
            <View style={styles.ratingWrapper}>
              <Rating rating={rating} />
            </View>
            <View style={styles.openTextWrapper}>
              <Text
                style={[
                  styles.openTextRight,
                  opening_hours.open_now ? styles.openNow : styles.closeNow
                ]}>
                {!!opening_hours.weekday_text &&
                  opening_hours.weekday_text[dayOfDate]}{" "}
                ({opening_hours.open_now ? "Abierto" : "Cerrado"})
              </Text>
            </View>
            <View style={styles.addressTextWrapper}>
              <Text style={styles.addressTextRight} numberOfLines={2}>
                {formatted_address}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.mapView} pointerEvents="none">
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={this.state.region}>
            <Marker
              coordinate={this.state.marker}
              image={require("../img/place.png")}
            />
          </MapView>
        </View>

        <TouchableOpacity
          style={styles.seeFullMapButton}
          onPress={this.showFullMapPage}>
          <Image
            resizeMode="contain"
            style={styles.imageHorario}
            source={require("../img/place-white-i.png")}
          />
          <Text style={styles.textFullMapB}>VER EN MAPA</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.llamarButton}
          onPress={() => this.triggerPhoneCall(international_phone_number)}>
          <Image
            resizeMode="contain"
            style={styles.imageHorario}
            source={require("../img/phone-icon.png")}
          />
          <Text style={styles.textFullMapB}>LLAMAR</Text>
        </TouchableOpacity>

        {reviews.length > 0 ? reviewsRender : null}
      </ScrollView>
    );
  }
}

export default RestaurantPage;

const styles = StyleSheet.create({
  restaurantPage: {
    flex: 1,
    backgroundColor: "white"
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
    fontSize: 35,
    marginTop: 13,
    marginBottom: 13,
    color: "#BC070A",
    textAlign: "center",
    fontFamily: "Helvetica-Bold"
  },
  ratingWrapper: {
    flex: 2,
    justifyContent: "center"
  },
  container: {
    ...StyleSheet.absoluteFillObject,
    height: 200,
    width: width,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    width: width
  },
  mapView: {
    height: 200,
    width: width,
    justifyContent: "flex-end",
    alignItems: "center"
  },
  centerTextContainer: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 25,
    marginBottom: 25
  },
  centerTextLeft: {
    flex: 3,
    flexDirection: "column",
    borderRightWidth: 1,
    borderColor: "#BC070A",
    paddingRight: 4,
    alignItems: "flex-end",
    justifyContent: "space-around"
  },
  containerCal: {
    flex: 1,
    marginVertical: 6
  },
  fontLeft: {
    fontStyle: "italic",
    fontFamily: "Helvetica",
    fontSize: 16,
    textAlign: "right",
    fontWeight: "200",
    paddingRight: 5
  },
  containerHorario: {
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center"
  },
  imageHorario: {
    width: 27,
    height: 27
  },
  containerLug: {
    flex: 1,
    flexDirection: "row",
    marginVertical: 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "stretch"
  },
  centerTextRight: {
    flex: 5,
    paddingLeft: 7,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  openTextWrapper: {
    flex: 2,
    justifyContent: "center"
  },
  openNow: {
    color: "#51a953"
  },
  closeNow: {
    color: "#BC070A"
  },
  openTextRight: {
    fontFamily: "Helvetica",
    fontSize: 13
  },
  addressTextWrapper: {
    flex: 1,
    justifyContent: "center",
    margin: 0,
    padding: 0
  },
  addressTextRight: {
    fontFamily: "Helvetica",
    fontSize: 12,
    overflow: "hidden"
  },
  seeFullMapButton: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 35
  },
  textFullMapB: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold"
  },
  llamarButton: {
    flex: 1,
    backgroundColor: "#BC070A",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 35
  },
  reviewsBlock: {
    flex: 1,
    paddingTop: 20,
    marginHorizontal: 15
  },
  wrapEachReview: {
    flexDirection: "row",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "black"
  },
  reviewsTitle: {
    textAlign: "left",
    fontWeight: "bold",
    color: "#BC070A",
    paddingBottom: 10
  },
  leftSideReview: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  avatarAuthor: {
    flex: 1,
    width: 50,
    height: 50,
    resizeMode: "contain"
  },
  rightSideReview: {
    paddingRight: 10,
    flex: 4
  }
});
