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

const TransactionItem = ({ amount, date }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height] = useState(new Animated.Value(0));

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    Animated.timing(height, {
      toValue: isCollapsed ?  60 * 3 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  const TransactionInfo = ({ name, value }) => {
    return (
      <View
        style={{
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 8,
          // backgroundColor: primaryColor_50,
          height: 60,
          flexShrink: 1,
          flexGrow: 1,
        }}
      >
        <Text
          style={{
            fontFamily: "RHD-Medium",
            fontSize: 12,
            lineHeight: 16,
            color: secondaryText,
            textAlign: "left",
          }}
        >
          {name}
        </Text>
        <Text
          style={{
            flex: 1,
            textAlign: "right",
            fontFamily: "RHD-Medium",
            fontSize: 16,
            lineHeight: 24,
            textAlign: "left",

          }}
        >
          {value}
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

          height: 56,
        }}
      >
        <Text
          style={{
            flex: 1,
            fontFamily: "RHD-Bold",
            fontSize: 14,
            lineHeight: 21,
            color: primaryColor_800,
          }}
        >
          Total Marks
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
          600
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
          534
        </Text>
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
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
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
              styles.examSubHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {date}
          </Text>
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <Text
              style={[
                styles.examHeader,
                { color: isCollapsed ? primaryText : "#fff" },
              ]}
            >
              ₹ {amount}
            </Text>
            <View style={styles.paidView}>
              <Text style={styles.paidText}>Paid</Text>
            </View>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
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
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TransactionInfo
                name={"Transaction ID"}
                value={"NA"}
              />
              <TransactionInfo name={"Mode"} value={"CASH"} />
              <TransactionInfo name={"Due"} value={"4000"} />
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TransactionInfo
                name={"Verified By"}
                value={"Akash Mendi (Fee Administration)"}
              />
            </View>
            <TransactionInfo name={"Updated on"} value={"1:05pm on "+date} />

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
  paidView: {
    alignSelf: "center",
    marginStart: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: primaryColor_300,
  },
  paidText: {
    fontSize: 12,
    fontFamily: "RHD-Medium",
  },
});

export default TransactionItem;
