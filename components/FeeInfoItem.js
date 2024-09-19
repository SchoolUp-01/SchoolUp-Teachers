import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_300,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import CircularProgress from "react-native-circular-progress-indicator";

const FeeInfoItem = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height] = useState(new Animated.Value(0));

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    Animated.timing(height, {
      toValue: isCollapsed ? 56 +64 + 52 * 3 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  

  const MarksItem = ({ subject, scored }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          alignItems: "center",
          paddingVertical: 8,
          // backgroundColor: primaryColor_50,
          height: 52,
          borderBottomWidth: borderWidth,
          borderColor: borderColor,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontFamily: "RHD-Medium",
            fontSize: 16,
            lineHeight: 24,
          }}
        >
          {subject}
        </Text>
        
        <Text
          style={{
            flex: 1,
            textAlign: "right",
            fontFamily: "RHD-Medium",
            fontSize: 16,
            lineHeight: 24,
          }}
        >
          ₹ {scored}
        </Text>
      </View>
    );
  };

  const MarksFooter = ({}) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          alignItems: "center",
          paddingVertical: 12,

          height: 64,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontFamily: "RHD-Bold",
            fontSize: 14,
            lineHeight: 21,
            color: primaryText,
          }}
        >
          Total
        </Text>
        <View>
        <Text
          style={{
            flex: 1,
            fontFamily: "RHD-Bold",
            fontSize: 14,
            lineHeight: 21,
            color: primaryColor_800,
            textAlign: "right",
          }}
        >
         ₹ 16000
        </Text>
        <Text
          style={{
            flex: 1,
            fontFamily: "RHD-Bold",
            fontSize: 14,
            lineHeight: 21,
            color: primaryColor_800,
            textAlign: "right",
          }}
        >
         Sixteen thousand Rupees Only
        </Text>
        </View>
      </View>
    );
  };

  const ButtonView = ({}) => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          alignItems: "center",
          paddingVertical: 12,
          height: 52,
          borderBottomLeftRadius:8,
          borderBottomRightRadius:8,
          backgroundColor: primaryColor_800,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontFamily: "RHD-Bold",
            fontSize: 14,
            lineHeight: 21,
            color: "#fff",
          }}
        >
          View Complete Report
        </Text>
        <Feather name="chevron-right" size={24} color={"#fff"} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isCollapsed ? "#fff" : primaryColor,
          borderBottomLeftRadius: !isCollapsed ? 0 : 8,
          borderBottomRightRadius: !isCollapsed ? 0 : 8,
        }}
      >
        <View>
          <Text
            style={[
              styles.examHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {Student.shared.getMasterStudentSchoolName()}
          </Text>
          <Text
            style={[
              styles.examSubHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {Student.shared.getMasterStudentCurrentYear()+" Standard • " +new Date().getFullYear()}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {/* <Text
            style={{ marginEnd: 16, color: isCollapsed ? primaryText : "#fff" }}
          >
            100%
          </Text> */}
          <TouchableOpacity onPress={() => toggleCollapse()}>
            <Feather
              name={isCollapsed ? "chevron-right" : "chevron-down"}
              size={24}
              color={isCollapsed ? primaryText : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={[styles.content, { height: height }]}>
        {!isCollapsed && (
          <>
            <MarksItem subject={"Tuition Fee"} scored={12000} />
            <MarksItem subject={"Computer Fee"} scored={2000-350} />
            <MarksItem subject={"Smart class"} scored={2000} />
            <MarksItem subject={"Digital Fee"} scored={350} />
            <MarksFooter />
            {/* <ButtonView /> */}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,

    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "lightblue",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  contentText: {
    color: "black",
    fontSize: 16,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "center",
  },
  examHeader: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    color: primaryText,
  },
  examSubHeader: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "RHD-Regular",
    color: primaryText,
  },
});

export default FeeInfoItem;
