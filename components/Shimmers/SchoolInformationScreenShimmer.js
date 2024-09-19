import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import { View, StyleSheet, Dimensions } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
} from "../../utils/Color";
const { width, height } = new Dimensions.get("screen");
export default function SchoolInformationScreenShimmer() {
  const MenuItem = () => {
    return <View style={{ width: 64, height: 64 }} />;
  };
  return (
    <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
      <SkeletonPlaceholder borderRadius={4}>
        <View style={styles.galleryView} />
        <View style={styles.studentView}>
          <View style={styles.middleView}>
            <View
              style={{
                height: 12,
                width: 160,
              }}
            />
            <View
              style={{
                height: 24,
                width: width - 32,
                marginTop: 8,
              }}
            />
            <View
              style={{
                height: 24,
                width: 120,
                marginTop: 4,
              }}
            />
            <View
              style={{
                height: 16,
                width: width - 32,
                marginTop: 16,
              }}
            />
            <View
              style={{
                height: 16,
                width: width - 32,
                marginTop: 4,
              }}
            />
            <View
              style={{
                height: 16,
                width: 120,
                marginTop: 4,
              }}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", marginBottom: 16 }}>
          <View
            style={{ width: 80, height: 24, borderRadius: 8, marginEnd: 16 }}
          />
          <View
            style={{ width: 80, height: 24, borderRadius: 8, marginEnd: 16 }}
          />
          <View
            style={{ width: 80, height: 24, borderRadius: 8, marginEnd: 16 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: borderWidth,
            borderColor: borderColor,
          }}
        >
          <View
            style={{
              width: 120,
              height: 80,
              borderRadius: 4,
              alignSelf: "center",
            }}
          />
          <View>
            <View style={{ width: width - 184, height: 20, marginStart: 16 }} />
            <View
              style={{ width: 120, height: 20, marginStart: 16, marginTop: 4 }}
            />
            <View
              style={{
                width: width - 184,
                height: 16,
                marginStart: 16,
                marginTop: 8,
              }}
            />
            <View
              style={{ width: 120, height: 16, marginStart: 16, marginTop: 2 }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: borderWidth,
            borderColor: borderColor,
          }}
        >
          <View
            style={{
              width: 120,
              height: 80,
              borderRadius: 4,
              alignSelf: "center",
            }}
          />
          <View>
            <View style={{ width: width - 184, height: 20, marginStart: 16 }} />
            <View
              style={{ width: 120, height: 20, marginStart: 16, marginTop: 4 }}
            />
            <View
              style={{
                width: width - 184,
                height: 16,
                marginStart: 16,
                marginTop: 8,
              }}
            />
            <View
              style={{ width: 120, height: 16, marginStart: 16, marginTop: 2 }}
            />
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            marginBottom: 16,
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 8,
            borderWidth: borderWidth,
            borderColor: borderColor,
          }}
        >
          <View
            style={{
              width: 120,
              height: 80,
              borderRadius: 4,
              alignSelf: "center",
            }}
          />
          <View>
            <View style={{ width: width - 184, height: 20, marginStart: 16 }} />
            <View
              style={{ width: 120, height: 20, marginStart: 16, marginTop: 4 }}
            />
            <View
              style={{
                width: width - 184,
                height: 16,
                marginStart: 16,
                marginTop: 8,
              }}
            />
            <View
              style={{ width: 120, height: 16, marginStart: 16, marginTop: 2 }}
            />
          </View>
        </View>
       
      </SkeletonPlaceholder>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryView: {
    borderRadius: 8,
    width: width - 64,
    height: 220,
    alignSelf: "center",
    marginBottom: 16,
  },
  studentView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginVertical: 8,
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
    flex: 1,
  },
  timeTable: {
    height: 180,
    borderColor: borderColor,
    borderRadius: 8,
    width: width - 32,
  },
  recentView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  recentActions: {
    flexDirection: "row",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "space-evenly",
  },
});
