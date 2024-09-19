import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Dimensions,
} from "react-native";
import { Container, ToolbarBorder } from "./styledComponents";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  itemColor,
  primaryText,
  underlayColor,
  primaryColor_50,
  primaryColor_800,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import AnimatedLottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
const { width, height } = new Dimensions.get("screen");
export default function HolidayList() {
  const navigation = useNavigation();
  const [holidayList, setHolidayList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase_api.shared
      .getStudentHolidayList(null)
      .then((res) => {
        setHolidayList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "HolidayList: getStudentHolidayList: ",
          error
        );
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  const MenuItem = ({ icon, label, screen, date, animation }) => {
    return (
      <TouchableHighlight
        activeOpacity={0.95}
        underlayColor={underlayColor}
        onPress={() => {
          navigation.navigate("ActionStack", { screen });
        }}
      >
        <View
          style={{
            flexShrink: 1,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 8,
            width: width * 0.2,
          }}
        >
          {icon && <View style={styles.iconContainer}>
            <Feather
              style={[{ justifyContent: "center", alignSelf: "center" }]}
              size={20}
              color={primaryText}
              name={icon}
            />
          </View>}
          {animation && (
            <AnimatedLottieView
              autoPlay
              style={{
                width: 64,
                height: 64,
                backgroundColor: "transparent",
                alignSelf: "center",
              }}
              source={{
                uri: animation,
              }}
            />
          )}
          <Text style={styles.subLabel} numberOfLines={2}>
            {label}
          </Text>
          {/* <Text style={[styles.subLabel,{color:primaryColor_800}]}  numberOfLines={1}>{date}</Text> */}
        </View>
      </TouchableHighlight>
    );
  };
  return (
    <ScrollView horizontal={true}>
      {!loading && (
        <View
          style={{
            marginTop: 8,
            marginBottom: 16,
            flexDirection: "row",
            flex: 1,
            flexShrink: 1,
            flexGrow: 1,
          }}
        >
          <MenuItem
            animation={holidayList[0].avatar}
            label={holidayList[0].type}
            screen={"HolidayCalenderScreen"}
            date={holidayList[0].start_date}
          />
          <MenuItem
            animation={holidayList[1].avatar}
            label={holidayList[1].type}
            screen={"HolidayCalenderScreen"}
            date={holidayList[1].start_date}
          />
          <MenuItem
            animation={holidayList[2].avatar}
            label={holidayList[2].type}
            screen={"HolidayCalenderScreen"}
            date={holidayList[2].start_date}
          />
          <MenuItem
            icon={"chevron-right"}
            label={"See All\nHolidays"}
            screen={"HolidayCalenderScreen"}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    // marginVertical: 8,
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    flexDirection: "row",
  },
  subView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 24,
    textAlignVertical: "center",
    alignSelf: "center",
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: "center",
    alignSelf: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor:primaryColor_50
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: borderWidth,
    borderBottomColor: borderColor,
  },
  subLabel: {
    fontSize: 14,
    color: primaryText,
    marginTop: 8,
    fontFamily: "RHD-Medium",
    flexShrink: 1,
    textAlign: "center",
  },
});
