import React, { useRef, useState } from "react";
import { StyleSheet, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { Container, MenuItem, Toolbar } from "../../components/styledComponents";
import CustomStatusBarView from "../../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import { backgroundColor, primaryColor, primaryText } from "../../utils/Color";

export default function TermsOfServiceScreen() {
  const navigation = useNavigation();
  const [isLoaded, setIsLoaded] = useState(false); // State to track if the WebView has loaded
  const progressAnim = useRef(new Animated.Value(0)).current;

  const handleProgress = (value) => {
    Animated.timing(progressAnim, {
      toValue: value,
      duration: 200,
      useNativeDriver: false,
    }).start();
  };

  const handleScrollProgress = ({ nativeEvent }) => {
    if (!nativeEvent.contentSize || !nativeEvent.contentOffset) return;

    const { contentSize, contentOffset } = nativeEvent;
    const scrollProgress = contentOffset.y / (contentSize.height - contentOffset.height);

    handleProgress(scrollProgress);
  };

  return (
    <Container style={styles.container}>
      <CustomStatusBarView
        barStyle="dark-content"
        backgroundColor={backgroundColor}
      />
      <Toolbar>
        <MenuItem onPress={() => navigation?.goBack?.()}>
          <Feather name="x" size={24} color={primaryText} />
        </MenuItem>
      </Toolbar>

      {/* Animated Progress Bar */}
      <Animated.View
        style={[
          styles.progressBar,
          {
            width: progressAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          },
        ]}
      />

      <WebView
        source={{ uri: "https://schoolup.co/terms" }}
        style={styles.webview}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        setSupportZoom
        onLoadEnd={() => setIsLoaded(true)} // Switch to scroll progress after loading
        onScroll={(e) => isLoaded && handleScrollProgress(e)}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor,
    flex: 1,
  },
  progressBar: {
    height: 3,
    backgroundColor: primaryColor,
  },
  webview: {
    flex: 1,
  },
});
