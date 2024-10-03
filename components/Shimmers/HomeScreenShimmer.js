import { View, StyleSheet, Dimensions } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
} from "../../utils/Color";
import SkeletonLoading from "./SkeletonLoader";
const { width } = new Dimensions.get("screen");
export default function HomeScreenShimmer() {
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
      <SkeletonLoading borderRadius={4}>
        <View style={styles.announcementView} />
        <View style={styles.studentView}>
          <View style={styles.avatar} />
          <View style={styles.middleView}>
            <View
              style={{
                height: 16,
                width: 120,
              }}
            />
            <View
              style={{
                height: 12,
                width: 180,
                marginTop: 4,
              }}
            />
          </View>
          <View
            style={{
              width: 80,
              height: 20,
            }}
          />
        </View>
        <View style={styles.timeTable} />
        <View style={styles.recentView}>
          <View style={{ width: 120, height: 20 }} />
          <View style={{ width: 20, height: 20 }} />
        </View>
        <View style={styles.recentActions}>
          <View style={{ width: 64, height: 64 }} />
          <View style={{ width: 64, height: 64 }} />
          <View style={{ width: 64, height: 64 }} />
          <View style={{ width: 64, height: 64 }} />
        </View>
        <View style={styles.recentView}>
          <View style={{ width: 120, height: 20 }} />
          <View style={{ width: 20, height: 20 }} />
        </View>
        <View style={styles.recentActions}>
          <View style={{ width: 64, height: 64 }} />
          <View style={{ width: 64, height: 64 }} />
          <View style={{ width: 64, height: 64 }} />
          <View style={{ width: 64, height: 64 }} />
        </View>
      </SkeletonLoading>
    </View>
  );
}

const styles = StyleSheet.create({
  announcementView: {
    borderRadius: 8,
    marginEnd: 16,
    flexDirection: "column",
    width: width - 32,
    height: 152,
    backgroundColor: defaultImageBgColor
  },
  studentView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginVertical: 8,
    backgroundColor: defaultImageBgColor

  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: defaultImageBgColor,
    borderWidth: borderWidth,
    borderColor: borderColor,
  },
  middleView: {
    marginHorizontal: 16,
    flex: 1,
  },
  timeTable: {
    height: 180,
    borderColor: borderColor,
    borderRadius: 8,
    width: width - 32,
    backgroundColor: defaultImageBgColor

  },
  recentView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  recentActions: {
    flexDirection: "row",
    paddingVertical: 8,
    alignItems:'center',
    justifyContent:"space-evenly",
    backgroundColor: defaultImageBgColor

  },
});
