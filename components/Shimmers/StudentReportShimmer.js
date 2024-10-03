import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { borderColor, defaultImageBgColor, primaryColor, primaryColor_800 } from "../../utils/Color";
import SkeletonLoading from "./SkeletonLoader";

export default function StudentReportShimmer() {
  return (
    <View>
      <SkeletonLoading borderRadius={4}>
        <View style={styles.examView}>
          <View>
            <View style={styles.examHeader} />
            <View style={styles.examSubHeader} />
          </View>
          <View style={styles.examContent}></View>
        </View>
      </SkeletonLoading>
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
          Exam results coming up, All the best :).
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
    backgroundColor: defaultImageBgColor
  },
  examSubHeader: {
    height: 18,
    width: 80,
    marginTop: 8,
    backgroundColor: defaultImageBgColor

  },
  examContent: {
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: 8,
    borderRadius: 8,
    height: 24,
    width: 80,
    backgroundColor: defaultImageBgColor

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
