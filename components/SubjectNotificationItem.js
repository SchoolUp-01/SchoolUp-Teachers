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
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";

const SubjectNotificationItem = ({ completed = false, onUpdate, item ,date}) => {
  const navigation = useNavigation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [height] = useState(new Animated.Value(0));
  const [reminder, setReminder] = useState(null);

  const {
    class_id,
    day,
    end_hour,
    end_minute,
    id,
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

  const onReminderCallBack = (reminderValue) => {
    console.log("ReminderValue: ", reminderValue);
    setReminder(reminderValue);
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
            {title + " • " + standard + section + " section"}
          </Text>
          <Text
            style={[
              styles.examSubHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {`${start_hour}:${start_minute} - ${end_hour}:${end_minute}`}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {reminder ? (
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => onUpdate(item, onReminderCallBack, reminder,date)}
            >
              <Text style={styles.mangeButtonLabel}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => onUpdate(item, onReminderCallBack, reminder,date)}
            >
              <Text style={styles.addButtonLabel}>Reminder</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
      {reminder && (
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 8,
            borderTopWidth: borderWidth,
            borderColor: borderColor,
          }}
        >
          <Text
            style={{
              fontFamily: "RHD-Medium",
              fontSize: 14,
              lineHeight: 21,
              marginBottom: 4,
              color: secondaryText,
            }}
          >
            Reminder
          </Text>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              fontSize: 16,
              lineHeight: 24,
              marginBottom: 8,
            }}
          >
            {reminder}
          </Text>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              fontSize: 12,
              lineHeight: 18,
              marginBottom: 4,
              color: secondaryText,
            }}
          >
            Notified at 12:56pm on 12th Jan 2024
          </Text>
        </View>
      )}
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

export default React.memo(SubjectNotificationItem);
