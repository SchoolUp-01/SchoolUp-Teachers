import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor_50,
  primaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import Teacher from "../state/TeacherManager";

export default function TeachersDetailsTab({ info }) {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(info);

  useEffect(() => {
    if (info == null) {
      setUserInfo(Teacher.shared.getTeacherInfo());
    }

    const handleTeacherDataUpdate = (newData) => {
      setUserInfo(newData);
    };

    Teacher.shared.subscribe(handleTeacherDataUpdate);

    return () => {
      Teacher.shared.unsubscribe(handleTeacherDataUpdate);
    };
  }, []);

  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("TeacherStack", {
          screen: "PunchInScreen",
        });
      }}
    >
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          defaultSource={require("../assets/DefaultImage.jpg")}
          source={{ uri: 'https://www.google.com/imgres?q=indian%20teacher%20url&imgurl=https%3A%2F%2Ft3.ftcdn.net%2Fjpg%2F04%2F48%2F03%2F56%2F360_F_448035690_o2uvf0WcCJcOkjoiDhCqHZdqoi8KzQzO.jpg&imgrefurl=https%3A%2F%2Fstock.adobe.com%2Fsearch%3Fk%3D%2522indian%2Bteacher%2522&docid=oZoCbbQoiBiexM&tbnid=O_MpKfOPGLH45M&vet=12ahUKEwjis82C2Z-IAxVF1DgGHbA7PF4QM3oECHUQAA..i&w=523&h=360&hcb=2&ved=2ahUKEwjis82C2Z-IAxVF1DgGHbA7PF4QM3oECHUQAA'}}
        ></Image>
        <View style={styles.middleView}>
          <Text
            style={{
              fontSize: 18,
              lineHeight: 27,
              fontFamily: "RHD-Medium",
            }}
          >
            {userInfo?.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              fontFamily: "RHD-Regular",
              color: primaryText,
            }}
          >
            Good Morning, have a nice day ahead :)
          </Text>
        </View>
        <View style={{backgroundColor:primaryColor_50,borderRadius:8,paddingHorizontal:16,paddingVertical:8}}>
        <TouchableOpacity
            onPress={() => {
              navigation.navigate("ActionStack", {
                screen: "SearchScreen",
              });
            }}
          >
            <Text>Check - out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    marginVertical:4,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 32,
    backgroundColor: defaultImageBgColor,
    borderWidth: borderWidth,
    borderColor: borderColor,
  },
  middleView: {
    marginHorizontal: 16,
    flex: 1,
  },
});
