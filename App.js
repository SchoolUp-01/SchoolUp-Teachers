import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NotifierWrapper } from "react-native-notifier";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Font from "expo-font";
import React, { useState, useEffect, useRef,useMemo } from "react";
import { Dimensions, LayoutAnimation, Platform, StyleSheet, View } from "react-native";
import * as NavigationBar from "expo-navigation-bar";

import WelcomeScreen from "./screen/LoginStack/WelcomeScreen";
import HomeScreen from "./screen/HomeScreen";
import Sidebar from "./components/Sidebar";
import ActionStack from "./route/ActionStack";
import ProfileStack from "./route/ProfileStack";
import ErrorLogger from "./utils/ErrorLogger";
import LoginStack from "./route/LoginStack";
import { supabase } from "./backend/supabaseClient";
import LoadingScreen from "./screen/LoadingScreen";
import CreateProfileScreen from "./screen/LoginStack/CreateProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import supabase_api from "./backend/supabase_api";
import SelectSchoolScreen from "./screen/LoginStack/SelectSchoolScreen";
import SettingStack from "./route/SettingStack";
import * as Linking from "expo-linking";

import { Container } from "./components/styledComponents";
import AnimatedLottieView from "lottie-react-native";
import { primaryColor } from "./utils/Color";
import TeacherStack from "./route/TeacherStack";
import PushNotification from "./components/PushNotification";
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
let customFonts = {
  "RHD-Medium": require("./assets/Fonts/RedHatDisplay-Medium_v2.ttf"),
  "RHD-Regular": require("./assets/Fonts/RedHatDisplay-Regular.ttf"),
  "RHD-Bold": require("./assets/Fonts/RedHatDisplay-Bold.ttf"),
};

const prefix = Linking.createURL("schoolup://app");
const login_prefix = Linking.createURL("login:");
const universal_url = Linking.createURL("https://schoolup.co");

const linking = {
  prefixes: [prefix, "login://", login_prefix, universal_url],
  config: {
    screens: {
      LoadingScreen: "redirect",
    },
  },
};

const { width, height } = new Dimensions.get("screen");
const App = () =>{
  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(null);
  const [fontsLoading, setFontLoading] = useState(true);
  const [defaultScreen, setDefaultScreen] = useState(null);
  const [data, setData] = useState(null);
  const [session, setSession] = useState(null);
  const [animationFinished, setAnimationFinished] = useState(true);
  const [linkerListener, setLinkerListener] = useState(null);

  const ref = useRef();

  useEffect(() => {
    // supabase.auth.signOut()
    LayoutAnimation.linear()
    setNavigationBar();
    loadFont();
    checkLoginStatus();
    startLinker();
    // Cleanup function
    return () => {};
  }, []);

  const checkLoginStatus = async () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Event: ", _event);
      if(_event === "TOKEN_REFRESHED") return
      if (_event !== "USER_UPDATED") checkStatus(session);
    });
  };

  const setUserMetaData = async (data) => {
    await AsyncStorage.setItem("user_metadata", JSON.stringify(data));
  };

  const getUserMetaData = async () => {
    return await AsyncStorage.getItem("user_metadata");
  };

  const setNavigationBar = () => {
    if (Platform.OS == "android") NavigationBar.setBackgroundColorAsync("#fff");
  };

  const checkStatus = async (mSession) => {
    try {
      setLoading(true);
      setLogin(false);
      setDefaultScreen("LoadingScreen");
      let user_metadata = null;
      if (mSession == null) {
        let metaData = await getUserMetaData();
        if (metaData == null) {
          const { data, error } = await supabase.auth.getUser();
          if (error) navigateToWelcomeScreen();
          else {
            metaData = data;
            setUserMetaData(data);
          }
        }

        if (metaData !== null) {
          user_metadata = metaData?.user?.user_metadata;
          supabase_api.shared.setUid(metaData?.user);
        }
      } else {
        user_metadata = mSession?.user?.user_metadata;
        setUserMetaData(user_metadata);
        setSession(mSession);
        supabase_api.shared.setUid(mSession?.user);
      }

      if (user_metadata !== null && user_metadata !== undefined) {
        setLogin(true);
        let newUser = null;
        if (Object.keys(user_metadata).length === 0) newUser = true;
        else newUser = user_metadata?.NewTeacher;
        let defaultScreen = newUser ? "CreateProfileScreen" : "HomeScreen";
        if (newUser === undefined) defaultScreen = "CreateProfileScreen";
        setDefaultScreen(defaultScreen);
        setLoading(false);
      } else {
        navigateToWelcomeScreen();
      }
      //getInitialURL();
    } catch (error) {
      ErrorLogger.shared.ShowError("Exception: App: CheckUser: ", error);
    }
  };

  navigateToWelcomeScreen = async () => {
    setLoading(false);
    setLogin(false);
    // setDefaultScreen("LoadingScreen");
  };

  const loadFont = async () => {
    await _loadFontsAsync();
    setFontLoading(false);
  };

  const _loadFontsAsync = async () => {
    try {
      await Font.loadAsync(customFonts);
    } catch (error) {
      ErrorLogger.shared.ShowError(
        "Exception: App.js: _loadFontsAsync: ",
        error
      );
    }
  };

  const startLinker = async () => {
    let linker = Linking.addEventListener("url", handleDeepLink);
    setLinkerListener(linker);
  };

  const handleDeepLink = (event) => {
    let data = Linking.parse(event.url);
    setData(data);
    console.log("Event: ", event.url);
    let urlString = event.url;
    if (event.url.includes("#")) {
      // urlString = event.url.replace("redirect/", "");
      urlString = event.url.replace("#", "?");
    }
    let url = new URL(urlString);
    // ToastAndroid.show("URL: "+url,ToastAndroid.LONG)
    const refreshToken = url.searchParams.get("refresh_token");
    const accessToken = url.searchParams.get("access_token");
    if (accessToken && refreshToken) {
      supabase.auth
        .setSession({
          refresh_token: refreshToken,
          access_token: accessToken,
        })
        .then((res) => {
          console.log({ res });
        })
        .catch((err) =>
          ErrorLogger.shared.ShowError("App: handleDeepLink: ", err)
        );
    } else {
      // navigateToCorrectScreen(event.url, ref?.current);
    }
  };

 

  const renderScreens = () => {
    if (loading || fontsLoading || login === null || animationFinished) {
      return (
        <Container style={{ alignItems: "center", justifyContent: "center" }}>
          <AnimatedLottieView
            loop={false}
            autoPlay
            style={{
              width: width * 0.75,
              height: width * 0.75,
              backgroundColor: "transparent",
              alignSelf: "center",
            }}
            source={require("./assets/school_main.json")}
            onAnimationFinish={() => setAnimationFinished(false)}
          />
        </Container>
      );
    } else
      return (
        <View style={styles.container}>
          {/* <PushNotification /> */}
          <NavigationContainer ref={ref} linking={linking}>
            {!loading && !fontsLoading && !login ? (
              <Stack.Navigator
                initialRouteName="WelcomeScreen"
                screenOptions={{
                  animation: "slide_from_right",
                  headerShown: false,
                  gestureEnabled: true, // Enable gestures for transitions
                }}
              >
                <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
                <Stack.Screen name="LoginStack" component={LoginStack} />
              </Stack.Navigator>
            ) : (
              <Stack.Navigator
                initialRouteName={defaultScreen}
                screenOptions={{
                  headerShown: false,
                  animation: "slide_from_right",
                }}
              >
                <Stack.Screen name="LoadingScreen" component={LoadingScreen} />

                <Stack.Screen
                  name="CreateProfileScreen"
                  component={CreateProfileScreen}
                />
                <Stack.Screen  name="HomeScreen" component={HomeScreen} />

                <Stack.Screen
                  name="SelectSchoolScreen"
                  component={SelectSchoolScreen}
                />

                <Stack.Screen name="ActionStack" component={ActionStack} />
                <Stack.Screen name="ProfileStack" component={ProfileStack} />
                <Stack.Screen name="SettingStack" component={SettingStack} />
                <Stack.Screen name="TeacherStack" component={TeacherStack} />

              </Stack.Navigator>
            )}
          </NavigationContainer>
        </View>
      );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotifierWrapper style={{ flex: 1, backgroundColor: primaryColor }}>
        {renderScreens()}
      </NotifierWrapper>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});


export default React.memo(App)