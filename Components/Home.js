/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Modal } from "react-native";
import Header from "./Header";
import BodyResults from "./BodyResults";
import RestaurantList from "./RestaurantList";
import { createStackNavigator } from "react-navigation";
import { credentialGoogle } from "../keys";
import { NavigationActions } from "react-navigation";
import { generateLinkGoogle } from "./utils";

type Props = {};
export default class Home extends Component<Props> {
  static navigationOptions = {
    header: null
  };
  state = {
    textQueryFood: "",
    textQueryPlace: "Ubicación Actual",
    onFocusInputBarFood: false,
    onFocusInputBarPlace: false,
    geolocationActive: false, // when phone's gps has gotten location
    onClickPlaceSelected: false,
    lat: -12.0498958,
    long: -77.0803742,
    locationUpdated: false,
    radius: 500,
    firstItemListPlace: {},
    nextPageToken: "",
    listResultRestaurants: [],
    currentListRender: []
  };

  onClickItemList = item => {
    const {
      onFocusInputBarPlace,
      onFocusInputBarFood,
      textQueryFood,
      lat,
      long,
      radius
    } = this.state;

    // clic on place search from list
    if (onFocusInputBarPlace) {
      this.setState({
        textQueryPlace: item.description,
        currentListRender: [],
        onFocusInputBarPlace: false,
        onFocusInputBarFood: true
      });

      fetch(
        generateLinkGoogle(item.place_id, "placeDetails", {}, lat, long, radius)
      )
        .then(data => data.json())
        .then(data => {
          const { lat, lng } = data.result.geometry.location;
          this.setState(
            {
              lat,
              long: lng,
              onClickPlaceSelected: true
            },
            () => {
              if (textQueryFood !== "") this.fetchFoodListData(textQueryFood);
            }
          );
        });
    }

    // clic on food term from list
    if (onFocusInputBarFood) {
      // if item is an establishment
      if (!!item.types && item.types.includes("establishment")) {
        // goes to page description
        console.log("click on item");
        this.props.navigation.navigate("RestaurantPage", {
          fetch: {
            item,
            fetch: fetch(
              generateLinkGoogle(
                item.place_id,
                "placeDetails",
                {},
                lat,
                long,
                radius
              )
            ),
            fetching: true
          }
        });

        return;
      }

      if (item.description !== "") {
        this.props.navigation.navigate("RestaurantList", {
          fetch: {
            fetch: fetch(
              generateLinkGoogle(
                textQueryFood,
                "searchListFood",
                {},
                lat,
                long,
                radius
              )
            ),
            fetching: true,
            lat,
            long
          }
        });
        return;
      }
    }
  };

  fetchFoodListData = textQueryFood => {
    const { lat, long, radius } = this.state;
    fetch(generateLinkGoogle(textQueryFood, "food", {}, lat, long, radius))
      .then(data => data.json())
      .then(data => {
        const currentListRender = data.predictions;
        this.setState({
          currentListRender: [...currentListRender]
        });
      });
  };

  handleChangeQueryFood = textQueryFood => {
    this.setState({
      textQueryFood
    });
    if (textQueryFood !== "") this.fetchFoodListData(textQueryFood);
  };

  fetchPlacesListData = (textQueryFood, type) => {
    const { lat, long, radius } = this.state;
    fetch(generateLinkGoogle(textQueryFood, type, {}, lat, long, radius))
      .then(data => data.json())
      .then(data => {
        const currentListRender = data.predictions;
        this.setState({
          currentListRender: [...currentListRender],
          firstItemListPlace:
            data.predictions.length > 0 ? data.predictions[0] : {}
        });
      });
  };

  handleChangeQueryPlace = textQueryPlace => {
    this.setState({
      textQueryPlace
    });
    if (textQueryPlace !== "")
      this.fetchPlacesListData(textQueryPlace, "placeAuto");
  };

  handleOnFocusInputBarFood = () => {
    const { textQueryFood, onFocusInputBarFood } = this.state;

    this.setState({
      onFocusInputBarFood: true,
      onFocusInputBarPlace: false,
      currentListRender: []
    });

    if (textQueryFood !== "") this.fetchFoodListData(textQueryFood);
  };

  handleOnFocusInputBarPlace = () => {
    const { textQueryPlace } = this.state;
    // if text is current location
    if (textQueryPlace === "Ubicación Actual")
      this.setState({
        textQueryPlace: ""
      });

    this.setState({
      currentListRender: [],
      onFocusInputBarPlace: true,
      onFocusInputBarFood: false
    });
    if (textQueryPlace !== "" && textQueryPlace !== "Ubicación Actual")
      this.fetchPlacesListData(textQueryPlace, "placeAuto");
  };

  cancelSearch = () => {
    this.setState({
      onFocusInputBarFood: false,
      onFocusInputBarPlace: false,
      textQueryFood: "",
      textQueryPlace: "Ubicación Actual",
      currentListRender: []
    });
  };

  //  {  lat, lon } are keys that come from google api
  generateLinkGoogle = (query, type, coords = {}, lat, long, radius) => {
    const queryFixed = query.trim().replace(/  +/g, "+");
    if (type === "food") {
      // filter those resultst that don't have the place_id key within
      return `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?key=${credentialGoogle}&location=${lat},${long}&radius=${radius}&language=es&input=${queryFixed}`;
    }
    if (type === "placeAuto") {
      let link = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${queryFixed}&location=${lat},${long}&radius=2000&language=es&key=${credentialGoogle}`;
      return link;
    }
    if (type === "placeDetails")
      return `https://maps.googleapis.com/maps/api/place/details/json?placeid=${query}&language=es&key=${credentialGoogle}`;

    if (type === "searchListFood")
      return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${long}&types=restaurant&keyword=${queryFixed}&language=es&radius=3000&key=${credentialGoogle}`;
    // used to retrieve photos based on PHOTO_REFERENCE
    // "https://maps.googleapis.com/maps/api/place/photo?photoreference=PHOTO_REFERENCE&sensor=false&maxheight=MAX_HEIGHT&maxwidth=MAX_WIDTH&key=YOUR_API_KEY";

    if (type === "searchListFoodNoGeolocation")
      return `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${
        coords.lat
      },${
        coords.lng
      }&types=restaurant&keyword=${queryFixed}&language=es&radius=3000&key=${credentialGoogle}`;

    // use to retrieve next page results
    // https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${PAGE_TOKEN}
  };

  makeSearchButton = () => {
    const {
      textQueryFood,
      textQueryPlace,
      lat,
      long,
      geolocationActive,
      onClickPlaceSelected,
      firstItemListPlace,
      radius
    } = this.state;
    // if place has been searched and selected
    // if food input is entered
    // ||
    // if place was left as default
    // if text in food input box is entered
    if (
      (onClickPlaceSelected && textQueryFood !== "" && textQueryPlace !== "") ||
      (textQueryPlace !== "" && textQueryFood !== "")
    ) {
      this.props.navigation.navigate("RestaurantList", {
        fetch: {
          fetch: fetch(
            generateLinkGoogle(
              textQueryFood,
              "searchListFood",
              {},
              lat,
              long,
              radius
            )
          ),
          fetching: true,
          lat,
          long
        }
      });
      return;
    }

    // if food input is entered
    // if place input is entered but never selected one
    if (
      textQueryPlace !== "" &&
      textQueryPlace !== "Ubicación Actual" &&
      textQueryFood !== ""
    ) {
      // fetching list of restaurants
      const fetchingList = coords =>
        fetch(
          generateLinkGoogle(
            textQueryFood,
            "searchListFoodNoGeolocation",
            coords,
            lat,
            long,
            radius
          )
        );
      // fetching coords
      // returns a promise with the list that'll resolve
      const fetchingCoords = fetch(
        generateLinkGoogle(
          firstItemListPlace.place_id,
          "placeDetails",
          {},
          lat,
          long,
          radius
        )
      )
        .then(data => data.json())
        .then(data => {
          const coords = data.result.geometry.location;
          return fetchingList(coords);
        })
        .catch(e => console.log("fetchingCoords error"));
      this.props.navigation.navigate("RestaurantList", {
        fetch: {
          fetch: fetchingCoords,
          fetching: true,
          lat,
          long
        }
      });
      return;
    }
  };

  componentWillMount() {
    navigator.geolocation.getCurrentPosition(
      position => {
        this.setState({
          lat: position.coords.latitude,
          long: position.coords.longitude,
          geolocationActive: true
        });
      },
      error => console.warn("error geolocation", error),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  }

  render() {
    const {
      textQueryFood,
      textQueryPlace,
      onFocusInputBarFood,
      onFocusInputBarPlace,
      lat,
      long,
      geolocationActive,
      currentListRender
    } = this.state;

    return (
      <View style={styles.appContainer}>
        <Header
          makeSearchButton={this.makeSearchButton}
          cancelSearch={this.cancelSearch}
          textQueryFood={textQueryFood}
          textQueryPlace={textQueryPlace}
          onFocusInputBarFood={onFocusInputBarFood}
          onFocusInputBarPlace={onFocusInputBarPlace}
          handleChangeQueryFood={this.handleChangeQueryFood}
          handleChangeQueryPlace={this.handleChangeQueryPlace}
          handleOnFocusInputBarFood={this.handleOnFocusInputBarFood}
          handleOnFocusInputBarPlace={this.handleOnFocusInputBarPlace}
        />
        <BodyResults
          listResult={currentListRender}
          onFocusInputBarFood={onFocusInputBarFood}
          onFocusInputBarPlace={onFocusInputBarPlace}
          onClickItemList={this.onClickItemList}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: "#d11a1c"
  },
  bodyResultsContainer: {
    backgroundColor: "yellow"
  }
});
