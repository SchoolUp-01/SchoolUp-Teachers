import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  View,
  Dimensions,
  StatusBar,
  Image,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { MenuItem, Title, Toolbar } from "../components/styledComponents";
import { useNavigation, useRoute } from "@react-navigation/native";


const { height, width } = Dimensions.get("window");

const MediaScreen = ({ }) => {
  const route = useRoute();
  const navigation = useNavigation();
  const [callBackFunction, setCallBackFunction] = useState(
    route?.params?.callBackFunctionDelete ?? null
  );
  const [image, setImage] = useState(route?.params?.image ?? null);
  const [title, setTitle] = useState(route?.params?.title ?? null);
    const callBack = useRef(route.params.callBackFunctionDelete)
  useEffect(() => {
    // componentDidMount logic can go here
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000",
        flex: 1,
      }}
    >
      <StatusBar
        animated
        barStyle="light-content"
        showHideTransition="fade"
        backgroundColor="#16192420"
        translucent
      ></StatusBar>
      <Toolbar
        style={{
          marginTop: StatusBar.currentHeight,
          backgroundColor: "#00000080",
        }}
      >
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color="#fff" />
        </MenuItem>
        <Title style={{ color: "#fff" }}>{title}</Title>
        {callBack.current !== null &&
        <MenuItem
        onPress={() => {
          if(callBack) callBack.current()
          navigation.goBack();
          // console.log("CallBackFuncation: ",callBack)
        }}
      >
        <Feather name="trash" size={20} color="#fff" />
      </MenuItem>}
      </Toolbar>

      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingBottom: 56 + StatusBar.currentHeight,
        }}
      >
        <Image
          style={{
            width: width,
            height: 240,
            alignSelf: "center",
          }}
          source={{ uri: image.uri }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MediaScreen;
