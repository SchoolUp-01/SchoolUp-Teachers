import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
} from "../../utils/Color";
const { width, height } = new Dimensions.get("screen");
export default function StudentInfoShimmer() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View style={styles.examView}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: defaultImageBgColor,
            borderColor: borderColor,
            borderWidth: borderWidth,
          }}
        />
        <View>
          <View style={styles.examHeader} />
          <View style={styles.examSubHeader} />
        </View>
        <View style={styles.examContent}></View>
      </View>
      <View
        style={{
          flexDirection: "row",
          paddingHorizontal: 16,
          justifyContent: "space-evenly",
          borderBottomWidth: borderWidth,
          borderColor: borderColor,
          paddingBottom: 16,
        }}
      >
        <View>
          <View style={{ width: 56, height: 20 }} />
          <View
            style={{ width: 48, height: 14, marginTop: 4, alignSelf: "center" }}
          />
        </View>
        <View>
          <View style={{ width: 56, height: 20 }} />
          <View
            style={{ width: 48, height: 14, marginTop: 4, alignSelf: "center" }}
          />
        </View>
        <View>
          <View style={{ width: 56, height: 20 }} />
          <View
            style={{ width: 48, height: 14, marginTop: 4, alignSelf: "center" }}
          />
        </View>
        <View>
          <View style={{ width: 56, height: 20 }} />
          <View
            style={{ width: 48, height: 14, marginTop: 4, alignSelf: "center" }}
          />
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          height: 200,
          width: width - 32,
          borderRadius: 8,
          marginHorizontal: 16,
          marginVertical: 16,
        }}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
        }}
      >
        <View style={{ width: 160, height: 24 }} />
        <View style={{ width: 24, height: 24 }} />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          marginTop: 12,
        }}
      >
        <View style={{ width: 120, height: 160 }} />
        <View style={{ width: 120, height: 160, marginStart: 16 }} />
        <View style={{ width: 120, height: 160, marginStart: 16 }} />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          marginTop: 16,
        }}
      >
        <View style={{ width: 160, height: 24 }} />
        <View style={{ width: 24, height: 24 }} />
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <View style={{ width: width - 32, height: 40, marginTop: 12 }} />
        <View style={{ width: width - 32, height: 40, marginTop: 12 }} />
        <View style={{ width: width - 32, height: 40, marginTop: 12 }} />
      </View>
    </SkeletonPlaceholder>
  );
}

const styles = StyleSheet.create({
  examView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  examHeader: {
    marginTop: 8,
    width: 160,
    height: 20,
  },
  examSubHeader: {
    height: 18,
    width: 120,
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
