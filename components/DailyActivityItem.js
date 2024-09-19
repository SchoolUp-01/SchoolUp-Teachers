import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import {
  borderColor,
  borderWidth,
  primaryColor,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";

export default function DailyActivityItem({ item }) {
  const navigation = useNavigation();

  const navigateToScreen = () => {
    navigation.navigate("ViewTaskScreen", {
      item: item,
    });
  };
  if (item === null) return;
  const {
    absent_list,
    id,
    remark,
    subject_id,
    subject_info: {
      class_id,
      subject,
      class_info: { section, standard },
    },
    timetable_info: { slot },
    topic,
  } = item;
  return (
    <TouchableOpacity
      onPress={() => {
        navigateToScreen();
      }}
    >
      <View style={styles.leaveView}>
        <View style={styles.dateView}>
          <Text style={styles.date}>{standard + section}</Text>
        </View>

        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 12,
          }}
        >
          <Text style={styles.leaveType}>{subject}</Text>

          <Text style={styles.leaveReason} numberOfLines={1}>
            Topic: {topic ?? "No Information"}
          </Text>
        </View>
        <View style={{ alignSelf: "center" }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigateToScreen()}
          >
            <Text style={styles.addButtonLabel}>View</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leaveView: {
    flexDirection: "row",
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    justifyContent: "space-between",
    alignItems: "center",
  },
  leaveType: { fontFamily: "RHD-Medium", fontSize: 16, lineHeight: 24 },
  leaveReason: {
    fontFamily: "RHD-Regular",
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4,
  },
  leaveSubView: {
    flexDirection: "row",
    marginStart: 16,
    justifyContent: "space-between",
  },
  date: {
    fontFamily: "RHD-Bold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#f74c06",
  },
  dateView: {
    flexDirection: "column",
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f74c061a",
  },
  addButton: {
    borderRadius: 24,
    backgroundColor: primaryColor,
    paddingVertical: 8,
    alignItems: "center",
    marginHorizontal: 16,
  },
  addButtonLabel: {
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontFamily: "RHD-Bold",
  },
});
