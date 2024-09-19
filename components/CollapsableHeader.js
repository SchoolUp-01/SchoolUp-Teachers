import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import {
  primaryColor_300,
  primaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";

const CollapsableHeader = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height] = useState(new Animated.Value(0));

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    Animated.timing(height, {
      toValue: isCollapsed ? 60 * 2 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };



  return (
    <View style={styles.container}>
      <View
        style={{
          borderRadius: 8,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
       
        }}
      >
        <Text style={styles.basicHeaderText}>Class Details</Text>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => toggleCollapse()}>
            <Feather
              name={isCollapsed ? "chevron-right" : "chevron-down"}
              size={24}
              color={primaryText}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={[styles.content, { height: height }]}>
        {!isCollapsed && (
          <>
            {children}
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal:16
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
  basicHeaderText: {
    fontFamily: "RHD-Medium",
    fontSize: 18,
    lineHeight: 27,
  },
});

export default CollapsableHeader;
