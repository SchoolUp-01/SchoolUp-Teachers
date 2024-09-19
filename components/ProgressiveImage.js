import React from "react";
import {
  View,
  StyleSheet,
  Animated,
  Text,
  TouchableOpacity,
} from "react-native";

import { Feather } from "@expo/vector-icons";
import { buttonText, defaultImageBgColor } from "../utils/Color";

const styles = StyleSheet.create({
  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    backgroundColor: 'transparent',
  },
  container: {
    backgroundColor: 'transparent',
    borderRadius: 4,
  },
});
class ProgressiveImage extends React.PureComponent {
  state = {
    imageError: false,
  };

  componentDidMount() {
  }

  thumbnailAnimated = new Animated.Value(0);
  imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  onImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  handleImageError = () => {
    this.setState({
      imageError: true,
    });
  };

  render() {
    const { thumbnailSource, source, style,borderRadius, ...props } = this.props;
    return (
      <View style={[styles.container]}>
        {!this.state.imageError && (
          <Animated.Image
            {...this.props}
            source={thumbnailSource}
            style={[style, { backgroundColor: defaultImageBgColor }]}
            resizeMode={"cover"}
            blurRadius={2}
            borderRadius={borderRadius??0}
            progressiveRenderingEnabled
            onLoad={this.handleThumbnailLoad}
          />
        )}
        {!this.state.imageError && (
          <Animated.Image
            {...this.props}
            source={source}
            style={[
              styles.imageOverlay,
              { opacity: this.imageAnimated },
              style,
            ]}
            borderRadius={borderRadius??0}
            resizeMode={"cover"}
            onLoad={this.onImageLoad}
            onError={this.handleImageError}
            progressiveRenderingEnabled
            lazy
            onProgress={(progress) => {
            }}
          />
        )}
        {this.state.imageError && (
          <Animated.View
            {...this.props}
            style={[
              style,
              {
                backgroundColor: defaultImageBgColor,
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              },
            ]}
          >
            <TouchableOpacity
              style={{
                padding: 12,
                backgroundColor: "#00000087",
                borderRadius: 50,
              }}
            >
              <Feather
                style={{ alignSelf: "center", marginStart: 2 }}
                name={"rotate-cw"}
                size={16}
                color={buttonText}
              />
            </TouchableOpacity>
            <Text
              style={{
                textAlign: "center",
                fontSize: 14,
                fontFamily: "RHD-Medium",
                lineHeight: 24,
                marginTop: 16,
              }}
            >
              Couldn't load the image, please try again.
            </Text>
          </Animated.View>
        )}
      </View>
    );
  }
}
export default ProgressiveImage;
