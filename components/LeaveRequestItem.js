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
import { formatDate } from "../utils/DateUtils";
import { useNavigation } from "@react-navigation/native";

const LeaveRequestItem = ({ completed = false }) => {
  const navigation = useNavigation();
   const [isCollapsed, setIsCollapsed] = useState(true);
  const [height] = useState(new Animated.Value(0));





  return (
    <TouchableOpacity onPress={()=>{
      navigation.navigate("UpdateLeaveScreen")
    }}>
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
        <View style={{flexShrink:1,marginEnd:16}}>
          <Text
            style={[
              styles.examHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {Student.shared.getMasterStudentName() +" • " + Student.shared.getMasterStudentSectionDetails()}
          </Text>
          <Text
            style={[
              styles.examSubHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {"25th December 2024 - 4th January 2024"}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {completed ? (
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate("UpdateTaskScreen")}
            >
              <Text style={styles.mangeButtonLabel}>Inquire</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => navigation.navigate("UpdateTaskScreen")}
            >
              <Text style={styles.addButtonLabel}>Approve</Text>
            </TouchableOpacity>
          )}
          {!completed &&<TouchableOpacity style={{alignSelf:"center",marginStart:16}}>
            <Feather name="x" size={24} color={secondaryText} />
          </TouchableOpacity>}
        </View>
      </View>
    </View>
    </TouchableOpacity>
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
  addButton: {
    borderRadius: 24,
    backgroundColor: primaryColor,
    paddingVertical: 8,
    alignItems: "center",
  },
  addButtonLabel: {
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontFamily: "RHD-Bold",
  },
  manageButton: {
    borderRadius: 24,
    borderColor: primaryColor,
    borderWidth: borderWidth,
    marginTop: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  mangeButtonLabel: {
    paddingHorizontal: 16,
    color: primaryColor,
    fontFamily: "RHD-Bold",
  },
});

export default React.memo(LeaveRequestItem);
