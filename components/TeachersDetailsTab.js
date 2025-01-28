import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor_50,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import Teacher from "../state/TeacherManager";
import Avatar from "./Avatar";

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
        <Avatar width={36} height={36} user={Teacher.shared.getAllDetails()}/>
        <View style={styles.middleView}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 20,
              fontFamily: "RHD-Bold",
            }}
          >
            {userInfo?.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 16,
              fontFamily: "RHD-Medium",
              color: secondaryText,
            }}
          >
           {'Shanti Niketan '}
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
