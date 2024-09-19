import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  itemBorder,
  itemColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
} from "../utils/Color";
import supabase_api from "../backend/supabase_api";
import { DrawerActions, useNavigation } from "@react-navigation/native";

export default function SidebarStudentItem({ item }) {
  const navigation = useNavigation();
  const [studentInfo, setStudentInfo] = useState(item);
  const [isMasterStudent, setMasterStudent] = useState(false);
  useEffect(() => {
    if (studentInfo?.id === Student.shared.studentID) {
      setMasterStudent(true);
      setStudentInfo(Student.shared.StudentInfoComplete);
    } 

    return () => {};
  }, []);

  useEffect(() => {
    handleStudentDataUpdate = (newData) => {
      setMasterStudent(newData?.id === studentInfo?.id)
    };

    Student.shared.subscribe(handleStudentDataUpdate);

    return () => {
      Student.shared.unsubscribe(handleStudentDataUpdate);
    };
  
  }, [])

  return (
    <TouchableOpacity
      onPress={() => {
        supabase_api.shared.updateMasterChild(studentInfo?.id)
        Student.shared.setStudentID(studentInfo?.id);
        Student.shared.setStudentInfoComplete(studentInfo);
        setMasterStudent(true);
        navigation.dispatch(DrawerActions.closeDrawer());
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 8,
          marginBottom: 8,
          borderRadius: 8,
          backgroundColor: isMasterStudent ? primaryColor_50 : itemColor,
          borderWidth: itemBorder,
          borderColor: isMasterStudent ? primaryColor_800 : borderColor,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              marginHorizontal: 8,
              backgroundColor: defaultImageBgColor,
            }}
            defaultSource={require("../assets/DefaultImage.jpg")}
            source={{ uri: studentInfo?.avatar }}
          />
          <View style={{ marginStart: 8, flexShrink: 1 }}>
            <Text
              style={{
                fontFamily: "RHD-Medium",
                color: primaryText,
                fontSize: 14,
              }}
            >
              {studentInfo?.name}
            </Text>
            <Text
              style={{
                fontFamily: "RHD-Regular",
                color: primaryText,
                fontSize: 12,
                marginTop: 2,
                overflow: "hidden",
                flexShrink: 1,
              }}
            >
              {studentInfo?.school_info?.name}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leaveView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  leaveType: { fontFamily: "RHD-Medium", fontSize: 16, lineHeight: 24 },
  leaveReason: { fontFamily: "RHD-Regular", fontSize: 14, lineHeight: 18 },
  leaveSubView: {
    flex: 1,
    flexDirection: "row",
    marginStart: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontFamily: "RHD-Bold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
  },
  dateView: {
    flexDirection: "column",
    backgroundColor: primaryColor_800,
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    width: 72,
  },
});
