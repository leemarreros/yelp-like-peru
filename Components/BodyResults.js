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
          <Text>{item.description}</Text>
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
    backgroundColor: "white"
  },
  itemDisplayWrapper: {
    flex: 1,
    minHeight: 40,
    borderWidth: 1,
    borderBottomColor: "grey",
    justifyContent: "center",
    paddingHorizontal: 10
  }
});
