import React, { Component } from "react";

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button
} from "react-native";

class DisplayItemList extends Component {
  render() {
    const { item, onClickItemList } = this.props;

    return (
      <View style={styles.itemDisplayWrapper}>
        <TouchableOpacity onPress={() => onClickItemList(item)}>
          <Text numberOfLines={1}>{item.description}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class BodyResults extends Component {
  render() {
    const { listResult, onClickItemList } = this.props;
    return (
      <View style={styles.bodyResultsContainer}>
        <FlatList
          keyboardShouldPersistTaps={"always"}
          keyExtractor={(x, i) => i.toString()}
          renderItem={({ item }) => {
            return (
              <DisplayItemList onClickItemList={onClickItemList} item={item} />
            );
          }}
          data={listResult}
        />
      </View>
    );
  }
}

export default BodyResults;

const styles = StyleSheet.create({
  bodyResultsContainer: {
    flex: 6,
    backgroundColor: "#BC070A"
  },
  itemDisplayWrapper: {
    flex: 1,
    minHeight: 40,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    marginTop: 1,
    backgroundColor: "white"
  },
  description: {
    fontFamily: "Helvetica"
  }
});
