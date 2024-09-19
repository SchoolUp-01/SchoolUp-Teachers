import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { borderColor, primaryColor, primaryColor_800 } from "../../utils/Color";

export default function ExamScreenShimmer() {
  return (
    <View>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.examView}>
          <View>
            <View style={styles.examHeader} />
            <View style={styles.examSubHeader} />
          </View>
          <View style={styles.examContent}></View>
        </View>
      </SkeletonPlaceholder>
      <View style={{marginTop:160}}>
        <ActivityIndicator size={24} color={primaryColor} />
        <Text
          style={{
            marginTop: 8,
            textAlign: "center",
            alignSelf: "center",
            fontFamily: "RHD-Regular",
            color: primaryColor_800,
          }}
        >
          Exams timetable coming up, hold tight.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  examView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  examHeader: {
    width: 180,
    height: 24,
  },
  examSubHeader: {
    height: 18,
    width: 80,
    marginTop: 8,
  },
  examContent: {
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: 8,
    borderRadius: 8,
    height: 24,
    width: 80,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: borderColor,
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  headerText: {
    lineHeight: 24,
    width: 80,
  },
});
