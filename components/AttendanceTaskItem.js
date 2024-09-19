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
  primaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";

const AttendanceTaskItem = ({ completed = false, item, index }) => {
  const navigation = useNavigation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height] = useState(new Animated.Value(0));

  if (item === null) return;
  const {
    class_id,
    day,
    end_hour,
    end_minute,
    location,
    start_hour,
    start_minute,
    subject_id,
    subject_info: {
      subject,
      teacher_id,
      teacher_info: { avatar, name },
    },
    class_info: { section, standard },
    title,
  } = item;

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
            {`${title} • ${standard}${section} Section`}
          </Text>
          <Text
            style={[
              styles.examSubHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {`${start_hour}:${start_minute} - ${end_hour}:${end_minute} • ${
              completed ? "ToDO" : "Today"
            }`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {completed ? (
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => navigation.navigate("UpdateTaskScreen")}
            >
              <Text style={styles.mangeButtonLabel}>View</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() =>
                navigation.navigate("UpdateTaskScreen", {
                  item: item,
                })
              }
            >
              <Text style={styles.addButtonLabel}>Update</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
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

export default React.memo(AttendanceTaskItem);
