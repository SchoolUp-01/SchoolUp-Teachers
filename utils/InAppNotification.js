import { Notifier } from "react-native-notifier";
import { View, Text, Alert, StatusBar, Image,Animated } from "react-native";
import React from "react";

class InAppNotification {
  constructor() {
    this.animatedValue = new Animated.Value(0);
  }

  showErrorNotification = ({ title, description }) => {
    try {
      Notifier.showNotification({
        title: title,
        description: description,
        translucentStatusBar: false,
        Component: this.errorComponent,
        duration: title === "No Internet Connection" ? 0 : 3000,
        swipeEnabled: title === "No Internet Connection" ? false : true,
      });
    } catch (error) {
      Alert.alert("Notifier Error", error + "");
    }
  };

  errorComponent = ({ title, description }) => {
    return (
      <View
        style={{
          backgroundColor: "#e03737",
          flexDirection: "column",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 24,
          
        }}
      >
        <Text style={{ fontFamily: "RHD-Bold", color: "#fff", marginTop: 24 }}>
          {title}
        </Text>
        {description !== null && description !== "" && (
          <Text
            style={{
              fontFamily: "RHD-Medium",
              color: "#fff",
              marginTop: 4,
              paddingHorizontal: 16,
              textAlign: "center",
            }}
          >
            {description}
          </Text>
        )}
      </View>
    );
  };

  showWarningNotification = ({ title, description }) => {
    try {
      Notifier.showNotification({
        title: title,
        description: description,
        translucentStatusBar: false,
        Component: this.warningComponent,
        duration: title === "No Internet Connection" ? 0 : 3000,
        swipeEnabled: title === "No Internet Connection" ? false : true,
      });
    } catch (error) {
      Alert.alert("Notifier Error", error + "");
    }
  };

  warningComponent = ({ title, description }) => {
    return (
      <View
        style={{
          backgroundColor: "#ffac00",
          flexDirection: "column",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 24,
        }}
      >
        <Text style={{ fontFamily: "RHD-Bold", color: "#fff", marginTop: 24 }}>
          {title}
        </Text>
        {description !== null && description !== "" && (
          <Text
            style={{
              fontFamily: "RHD-Medium",
              color: "#fff",
              marginTop: 4,
              paddingHorizontal: 16,
              textAlign: "center",
            }}
          >
            {description}
          </Text>
        )}
      </View>
    );
  };

  // showSuccessNotification = ({ title, description }) => {
  //   Notifier.showNotification({
  //     title: title,
  //     description: description,
  //     translucentStatusBar: false,
  //     Component: this.successComponent,
  //     animationIn: 'slideFromRight', // Specify the animation type
  //     animationDuration: 500, // 
  //   });
  // };

  // successComponent = ({ title, description }) => {
  //   return (
  //     <View
  //       style={{
  //         backgroundColor: "#00b104",
  //         flexDirection: "column",
  //         alignItems: "center",
  //         paddingVertical: 16,
  //       }}
  //     >
  //       <Text style={{ fontFamily: "RHD-Bold", color: "#fff", marginTop: 24 }}>
  //         {title}
  //       </Text>
  //       {description !== null && description !== "" && (
  //         <Text
  //           style={{
  //             fontFamily: "RHD-Medium",
  //             color: "#fff",
  //             marginTop: 4,
  //             paddingHorizontal: 16,
  //             textAlign: "center",
  //           }}
  //         >
  //           {description}
  //         </Text>
  //       )}
  //     </View>
  //   );
  // };

  showSuccessNotification = ({ title, description }) => {
    Notifier.showNotification({
      title: title,
      description: description,
      translucentStatusBar: false,
      Component: this.animatedSuccessComponent,
            animationIn: 'slideFromRight', // Specify the animation type
      animationDuration: 500, // 
    });
  
    // Start the animation
    Animated.timing(this.animatedValue, {
      toValue: 1,
      duration: 500, // Adjust the duration as needed
      useNativeDriver: true,
    }).start();
  };
  
  animatedSuccessComponent = ({ title, description }) => {
    const animatedStyle = {
      transform: [
        {
          translateX: this.animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0], // Adjust the initial and final position as needed
          }),
        },
      ],
    };
  
    return (
      <Animated.View style={[animatedStyle]}>
        <View
          style={{
            backgroundColor: "#00b104",
            flexDirection: "column",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <Text style={{ fontFamily: "RHD-Bold", color: "#fff", marginTop: 24 }}>
            {title}
          </Text>
          {description !== null && description !== "" && (
            <Text
              style={{
                fontFamily: "RHD-Medium",
                color: "#fff",
                marginTop: 4,
                paddingHorizontal: 16,
                textAlign: "center",
              }}
            >
              {description}
            </Text>
          )}
        </View>
      </Animated.View>
    );
  };

  showNormalNotification = ({ title, description, navigation }) => {
    Notifier.showNotification({
      title: title,
      description: description,
      translucentStatusBar: false,
      Component: this.animatedSuccessComponent,
      animationIn: 'slideFromRight', // Specify the animation type
      animationDuration: 500, // 
      componentProps: {
        containerStyle: {
          marginTop: StatusBar.currentHeight,
          backgroundColor: "#fff",
        },
        titleStyle: { color: "#777" },
      },
      onPress: () => this.handleOnPress(title, navigation),
    });
  };

  handleOnPress = (title, navigation) => {
    if (title?.type === "chat") {
      navigation.navigate("Message", {
        userID: title?.sid,
        MessageID: title?.cid,
      });
    } else {
      navigation.navigate("Profile", { userID: title?.sid });
    }
  };

  normalNotification = ({ title, description }) => {
    return (
      <View
        style={{
          flexDirection: "column",
          paddingVertical: 16,
          marginTop: StatusBar.currentHeight + 8,
          marginHorizontal: 12,
          elevation: 1,
          shadowColor: "#e5e5e5",
          paddingHorizontal: 12,
          flexShrink: 1,
          backgroundColor: "#fff",
          borderRadius: 4,
        }}
      >
        <View style={{ flexDirection: "row", backgroundColor: "#fff" }}>
          <Image
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              alignSelf: "center",
            }}
            source={{ uri: title?.title }}
          />
          <View style={{ marginHorizontal: 16, flexShrink: 1 }}>
            <Text
              style={{
                fontFamily: "RHD-Bold",
                color: "#555",
              }}
            >
              {title?.type === "chat" ? "New Message" : "New Follower"}
            </Text>
            <Text
              style={{ fontFamily: "RHD-Medium", color: "#000", marginTop: 4 }}
              numberOfLines={1}
            >
              {description}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  showBottomNotification = ({ title, description, navigation }) => {
    Notifier.showNotification({
      title: title,
      description: description,
      translucentStatusBar: false,
      Component: this.bottomNotification,
      duration: 3000,
      // onPress: () => this.handleonPress(title, navigation),
    });
  };

  bottomNotification = ({ title, description }) => {
    return (
      <View
        style={
          {
            // position: "absolute",
            // bottom: 0,
            // flex: 1,
            // flexDirection: "column",
            // elevation: 1,
            // shadowColor: "#e5e5e5",
            // paddingHorizontal: 12,
            // flexShrink: 1,
            // backgroundColor: underlayColor,
            // borderRadius: 4,
            // alignSelf: "flex-end",
            // justifyContent: "flex-end",
          }
        }
      >
        <View style={{ flexDirection: "row" }}>
          <View style={{ marginHorizontal: 16, flexShrink: 1 }}>
            <Text
              style={{
                fontFamily: "RHD-Bold",
                color: "#000",
              }}
            >
              {title}
            </Text>
            {description !== null ||
              (description != "" && (
                <Text
                  style={{
                    fontFamily: "RHD-Medium",
                    color: "#000",
                    marginTop: 4,
                  }}
                  numberOfLines={1}
                >
                  {description}
                </Text>
              ))}
          </View>
        </View>
      </View>
    );
  };
}
InAppNotification.shared = new InAppNotification();
export default InAppNotification;
