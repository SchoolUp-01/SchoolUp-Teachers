import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { borderColor, borderWidth, primaryColor } from "../utils/Color";
import { useNavigation } from "@react-navigation/native";

export default function AcademicReportItem({ item }) {
  const navigation = useNavigation();
  if (item === null) return;
  const {
    exam_id,
    exam_info: { id: exam_info_id, title: exam_title },
    subject_id,
    subject_info: {
      class_id,
      class_info: { id: class_info_id, section, standard },
      subject,
      teacher_id,
    },
  } = item;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("UpdateReportsScreen", {
          item: item,
        })
      }}
    >
      <View style={styles.leaveView}>
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
            {exam_title} • {standard + section}
          </Text>
        </View>
        <View style={{ alignSelf: "center" }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() =>
              navigation.navigate("UpdateReportsScreen", {
                item: item,
              })
            }
          >
            <Text style={styles.addButtonLabel}>Update</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leaveView: {
    marginTop: 8,
    flexDirection: "row",
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
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
