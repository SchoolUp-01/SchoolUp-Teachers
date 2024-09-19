import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import {
  backgroundColor,
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

const FeeDueItem = ({ amount, date }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height] = useState(new Animated.Value(0));

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    Animated.timing(height, {
      toValue: isCollapsed ? 60 * 3+8 : 0,
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
            Due Date: {date}
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
              <Text style={styles.paidText}>Pending</Text>
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
            <View>
              <TransactionInfo
                name={"School ID"}
                value={Student.shared.getMasterStudentSchoolID()}
              />
            </View>

            <View>
              <TransactionInfo
                name={"School Name"}
                value={Student.shared.getMasterStudentSchoolName()}
              />
            </View>

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TransactionInfo name={"UPI ID"} value={"snems@ybl"} />
              <TouchableOpacity
                style={{
                  marginEnd: 16,
                  backgroundColor: primaryColor,
                  alignSelf: "center",
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontFamily: "RHD-Medium",
                    color: "#fff",
                  }}
                >
                  Pay using SchoolUp
                </Text>
              </TouchableOpacity>
            </View>
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
    paddingBottom:8,
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

export default FeeDueItem;
