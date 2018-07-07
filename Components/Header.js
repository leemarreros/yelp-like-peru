import React, { Component } from "react";
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  StatusBar,
  Platform,
  Dimensions,
  Image,
  TouchableOpacity
} from "react-native";

class StatusBarWrap extends Component {
  render() {
    const height = Platform.OS === "ios" ? 20 : 0;
    const { backgroundColor } = "yellow";

    return (
      <View style={{ height, backgroundColor }}>
        <StatusBar backgroundColor="#d8181c" />
      </View>
    );
  }
}

class IconBrandAndButtons extends Component {
  render() {
    const {
      onFocusInputBarFood,
      onFocusInputBarPlace,
      cancelSearch,
      makeSearchButton
    } = this.props;
    const imageBrand = (
      <Image style={styles.iconBrand} source={require("../img/logoTop.png")} />
    );
    const buttons = (
      <View style={styles.iconAndButtonWrapper}>
        <TouchableOpacity onPress={cancelSearch} style={styles.buttonTop}>
          <Text style={styles.textButton}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={makeSearchButton} style={styles.buttonTop}>
          <Text style={styles.textButton}>Buscar</Text>
        </TouchableOpacity>
      </View>
    );

    const showButtonsBool = onFocusInputBarPlace || onFocusInputBarFood;
    return (
      <View
        style={[
          styles.iconBrandWrapper,
          showButtonsBool ? styles.iconBrandWrapperActive : null
        ]}
      >
        {showButtonsBool ? buttons : imageBrand}
      </View>
    );
  }
}

class SearchBarFood extends Component {
  state = {
    placeholder: "Polleria, chifa, cevicheria, etc."
  };
  render() {
    const {
      handleChangeQueryFood,
      textQueryFood,
      handleOnFocusInputBarFood
    } = this.props;
    return (
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder={this.state.placeholder}
            style={styles.searchBar}
            onChangeText={handleChangeQueryFood}
            value={textQueryFood}
            onFocus={handleOnFocusInputBarFood}
          />
          <Image
            style={styles.iconInSearchBar}
            source={require("../img/zoom.png")}
          />
        </View>
      </View>
    );
  }
}

class SearchBarPlace extends Component {
  state = {
    placeholder: "Lima, Miraflores, San Miguel, etc."
  };
  render() {
    const {
      handleChangeQueryPlace,
      textQueryPlace,
      handleOnFocusInputBarFood,
      handleOnFocusInputBarPlace
    } = this.props;
    return (
      <View style={styles.searchBarWrapper}>
        <View style={styles.searchBarContainer}>
          <TextInput
            placeholder={this.state.placeholder}
            style={styles.searchBar}
            onChangeText={handleChangeQueryPlace}
            value={textQueryPlace}
            onFocus={handleOnFocusInputBarPlace}
          />
          <Image
            style={styles.iconInSearchBar}
            source={require("../img/place.png")}
          />
        </View>
      </View>
    );
  }
}

class Header extends Component {
  render() {
    const {
      handleChangeQueryFood,
      handleChangeQueryPlace,
      textQueryPlace,
      textQueryFood,
      handleOnFocusInputBarFood,
      handleOnFocusInputBarPlace,
      onFocusInputBarFood,
      onFocusInputBarPlace,
      cancelSearch,
      makeSearchButton
    } = this.props;

    const searchBarPlace = (
      <SearchBarPlace
        handleChangeQueryPlace={handleChangeQueryPlace}
        textQueryPlace={textQueryPlace}
        handleOnFocusInputBarFood={handleOnFocusInputBarFood}
        handleOnFocusInputBarPlace={handleOnFocusInputBarPlace}
      />
    );

    return (
      <View style={styles.headerContainer}>
        <StatusBarWrap />
        <IconBrandAndButtons
          onFocusInputBarFood={onFocusInputBarFood}
          onFocusInputBarPlace={onFocusInputBarPlace}
          cancelSearch={cancelSearch}
          makeSearchButton={makeSearchButton}
        />
        <SearchBarFood
          handleChangeQueryFood={handleChangeQueryFood}
          handleChangeQueryPlace={handleChangeQueryPlace}
          textQueryFood={textQueryFood}
          handleOnFocusInputBarFood={handleOnFocusInputBarFood}
        />
        {onFocusInputBarFood || onFocusInputBarPlace ? searchBarPlace : null}
      </View>
    );
  }
}

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "column",
    height: 150
  },
  iconBrandWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  iconBrandWrapperActive: {
    alignItems: "stretch"
  },
  iconBrand: {
    maxWidth: 65,
    maxHeight: 65
  },
  searchBarWrapper: {
    flex: 1,
    justifyContent: "center"
  },
  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    marginHorizontal: 3,
    maxHeight: 40
  },
  searchBar: {
    flex: 8,
    paddingHorizontal: 6
  },
  iconInSearchBar: {
    flex: 1,
    width: undefined,
    height: undefined
  },
  iconAndButtonWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  buttonTop: {
    justifyContent: "center",
    marginHorizontal: 10
  },
  textButton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15
  }
});
