import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import AnimatedLottieView from "lottie-react-native";
import { primaryColor, primaryColor_50, primaryText } from "../utils/Color";

const { width, height } = Dimensions.get("window");

export default class EmptyState extends React.PureComponent {
  render() {
    return (
      <View
        style={{
          alignSelf: "center",
          width: width,
          marginTop: this.props.animated == null ? 48 : 0,
        }}
      >
        {this.props.animation != null && (
          <AnimatedLottieView
            autoPlay
            style={{
              width: width * 0.75,
              height: width * 0.75,
              backgroundColor: "transparent",
              alignSelf: "center",
            }}
            source={this.props.animation}
          />
        )}
        <Text
          style={{
            alignSelf: "center",
            fontFamily: "RHD-Bold",
            color: primaryText,
            fontSize: 20,
            maxWidth: width * 0.75,
            marginTop: 36,
          }}
        >
          {this.props.title}
        </Text>
        <Text
          style={{
            marginTop: 8,
            alignSelf: "center",
            fontFamily: "RHD-Medium",
            color: primaryText,
            fontSize: 16,
            maxWidth: width * 0.75,
            textAlign: "center",
          }}
        >
          {this.props.description}
        </Text>
        {this.props.primaryButtonText !== undefined && (
          <TouchableOpacity
          onPress={()=> this.props.primaryOnClick()}
            style={{
              marginTop: 24,
              marginHorizontal: 20,
              backgroundColor: primaryColor,
              borderRadius: 8,
              height: 52,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: primaryColor_50,
                fontSize: 18,
                fontFamily: "RHD-Bold",
              }}
            >
              {this.props.primaryButtonText}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
