import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  ImageBackground,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { borderColor, borderWidth, defaultImageBgColor } from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import ProgressiveImage from "./ProgressiveImage";

// Screen Dimensions
const { height, width } = Dimensions.get("window");

const PreviewContentList = (props) => {
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const callBackFunctionDelete = () => {
    if (props?.removeMedia) props.removeMedia(selectedIndex);
    return null
  };

  useEffect(() => {
    // Component Did Mount (equivalent)
  }, []);

  const renderItem = (item, index) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => {
          setSelectedIndex(index);
          navigation.navigate("MediaScreen", {
            image: item,
            title: props.title,
            callBackFunctionDelete: callBackFunctionDelete,
          });
        }}
      >
        <View style={styles.feedItem}>
          {/* <ImageBackground
            style={{
              width:  props.mediaList.length === 1 ? width-56: 120,
              height: 160,
              borderRadius: 8,
              borderColor: borderColor,
              borderWidth: borderWidth,
              backgroundColor: defaultImageBgColor,
              opacity: 10,
              justifyContent: "center",
            }}
            imageStyle={{ borderRadius: 8 }}
            source={{
              uri: item.uri,
            }}
          ></ImageBackground>
           */}
          <ProgressiveImage
            style={{
              width: props.mediaList.length === 1 ? width - 56 : 120,
              height: 160,
              borderRadius: 8,
            }}
            resizeMode="cover"
            source={{ uri: item.uri }}
            thumbnailSource={{ uri: item?.thumbnail_uri }}
            borderRadius={8}
            // margin={this.props.margin}
            // callback={this.callBack}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderFooter = () => {
    try {
      if (props.mediaList.length < 9 && props.showFooter) {
        return (
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            <TouchableOpacity
              onPress={() => {
                if (!props.refreshing) props.pickImage();
              }}
              style={{
                width: 120,
                height: 160,
                borderStyle: "dashed",
                borderRadius: 8,
                borderWidth: borderWidth,
                borderColor: borderColor,
                backgroundColor: defaultImageBgColor,
                justifyContent: "center",
              }}
            >
              <Feather
                name="plus"
                size={48}
                color="#c7c7c7"
                style={{ alignSelf: "center" }}
              />
            </TouchableOpacity>
          </View>
        );
      } else {
        return null;
      }
    } catch (error) {
      //   console.log(error);
    }
  };

  return (
    <FlatList
      nestedScrollEnabled
      ref={flatListRef}
      contentContainerStyle={styles.feed}
      data={props.mediaList}
      renderItem={({ item, index }) => renderItem(item, index)}
      keyExtractor={(item, index) => String(index)}
      ListFooterComponent={renderFooter}
      horizontal={true}
      refreshing={props.refreshing}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      onContentSizeChange={() => {
        // You can add your logic here
      }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    height: height,
    width: width,
  },
  text: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "400",
    color: "#222222",
  },
  feedItem: {
    marginEnd: 12,
  },
  feed: {
    marginTop: 8,
  },
  button: {
    borderRadius: 4,
    borderWidth: borderWidth,
    borderColor: "#80D0C7",
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#80D0C7",
    borderRadius: 4,
    borderWidth: borderWidth,
    borderColor: "#80D0C7",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PreviewContentList;
