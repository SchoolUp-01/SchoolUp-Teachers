import React, { useState, useEffect, useRef } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import PagerView from "react-native-pager-view";
import { PanGestureHandler, State } from "react-native-gesture-handler";

const { width, height } = new Dimensions.get("screen");
export default function AnnouncementTab() {
  const [selectedPage, setSelectedPage] = useState(0);
  const pagerRef = useRef();
  useEffect(() => {
    const interval = setInterval(() => {
      setSelectedPage((prevPage) => {
        if (prevPage === 2) {
          return 0;
        } else {
          return prevPage + 1;
        }
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let finalTranslateValue = -selectedPage * width + 16 * selectedPage;

    // For circular behavior
    if (selectedPage === 3) {
      finalTranslateValue = -(selectedPage - 1) * width; // To adjust for the last page
      setSelectedPage(0);
    }
    Animated.timing(translateX, {
      toValue: finalTranslateValue, // Adjust windowWidth based on your screen width
      duration: 500, // Adjust the duration of the transition
      useNativeDriver: true,
    }).start();
  }, [selectedPage]);
  const handleSwipe = (event) => {
    if (event.nativeEvent.translationX > 100) {
      let page = selectedPage + 1;
      if (page < 3) setSelectedPage(page);
      else {
        setSelectedPage(0);
      }
    } else if (event.nativeEvent.translationX < -100) {
      let page = selectedPage - 1;
      if (page < 0) setSelectedPage(2);
      else {
        setSelectedPage(page);
      }
    }
  };
  const AnnouncementItem = ({ title, background }) => {
    return (
      <PanGestureHandler
        onGestureEvent={handleSwipe}
        onHandlerStateChange={({ nativeEvent }) => {
          if (nativeEvent.state === State.END) {
            // Reset or handle when the gesture ends
            console.log(selectedPage + 1);
          }
        }}
      >
        <View style={[styles.feedItem]}>
          <ImageBackground
            style={styles.BackgroundItem}
            imageStyle={{ borderRadius: 8 }}
            source={{
              uri: background,
            }}
          >
            <LinearGradient
              style={{ flex: 1, justifyContent: "flex-end", borderRadius: 8 }}
              colors={["#00000000", "#0000001a", "#0000007a", "#0000007a"]}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingBottom: 4,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  marginBottom: 8,
                }}
              >
                <View style={{ flex: 0.8, marginEnd: 8 }}>
                  <Text
                    style={{
                      fontSize: 18,
                      lineHeight: 27,
                      color: "#FFFFFF",
                      fontFamily: "RHD-Bold",
                    }}
                    numberOfLines={2}
                  >
                    {title}
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity
                    style={{
                      backgroundColor: "#fff",
                      alignSelf: "center",
                      justifyContent: "center",
                      borderRadius: 8,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "RHD-Medium",
                        fontSize: 16,
                        lineHeight: 24,
                      }}
                    >
                      Sign up
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </PanGestureHandler>
    );
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          flexDirection: "row",
          transform: [{ translateX }],
        }}
      >
        <AnnouncementItem
          title="Young Minds Challenge: Unleash Your Creativity!"
          background="https://cdn.dribbble.com/users/812639/screenshots/4845279/media/c58aa58796be6bf32ea550f14a46562a.jpg"
        />
        <AnnouncementItem
          title="Artistic Wonders - Creative art projects and craft ideas."
          background="https://img.freepik.com/free-vector/abstract-orange-background-with-lines-halftone-effect_1017-32107.jpg?w=1800&t=st=1703155118~exp=1703155718~hmac=fe30295bf7b74cc7d9f1827c9990c3c1b1a03d825cd9e12427a3b8911447dc81"
        />
        <AnnouncementItem
          title="Math Magic - Fun math challenges and games."
          background="https://img.freepik.com/free-vector/futuristic-technology-background_23-2148460426.jpg?w=1800&t=st=1703157568~exp=1703158168~hmac=590ad7cc57edfd2a9fbe95b812313676590a58b5fbc928e1eb133986d4554569"
        />
      </Animated.View>
      <View style={styles.indicatorContainer}>
        <View
          style={[
            styles.indicator,
            { backgroundColor: 0 === selectedPage ? "blue" : "gray" },
          ]}
        />
        <View
          style={[
            styles.indicator,
            { backgroundColor: 1 === selectedPage ? "blue" : "gray" },
          ]}
        />
        <View
          style={[
            styles.indicator,
            { backgroundColor: 2 === selectedPage ? "blue" : "gray" },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flexDirection: "row",
    marginVertical:8
  },
  feedItem: {
    borderRadius: 8,
    marginEnd: 16,
    flexDirection: "column",
    width: width - 32,
    height: 152,
  },
  BackgroundItem: {
    width: width - 32,
    height: 152,
    justifyContent: "flex-end",
    borderRadius: 8,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
