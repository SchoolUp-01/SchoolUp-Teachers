import { View, Text, StyleSheet } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
} from "../../utils/Color";
import SkeletonLoading from "./SkeletonLoader";

export default function ManageChildrenScreenShimmer() {
  const renderStudentItem = () => {
    return (
      <View style={styles.studentInfoView}>
        <View style={styles.container}>
          <View style={styles.avatar}></View>
          <View style={styles.middleView}>
            <View style={styles.headerText} />
            <View style={styles.subText} />
          </View>

          <View style={styles.editView} />
        </View>
        <View
          style={{
            marginTop: 16,
            borderTopColor: borderColor,
            borderTopWidth: borderWidth,
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <View
              style={{
                justifyContent: "space-between",
                paddingVertical: 8,
                // backgroundColor: primaryColor_50,
                height: 60,
                flexShrink: 1,
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 16,
                }}
              ></View>
              <View
                style={{
                  width: 72,
                  height: 20,
                  marginTop: 4,
                }}
              ></View>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                paddingVertical: 8,
                // backgroundColor: primaryColor_50,
                height: 60,
                flexShrink: 1,
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  width: 64,
                  height: 16,
                }}
              />
              <View
                style={{
                  width: 120,
                  height: 20,
                }}
              ></View>
            </View>
            <View
              style={{
                justifyContent: "space-between",
                paddingVertical: 8,
                // backgroundColor: primaryColor_50,
                height: 60,
                flexShrink: 1,
                flexGrow: 1,
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 16,
                }}
              />

              <View
                style={{
                  width: 72,
                  height: 20,
                  marginTop:4
                }}
              />
            </View>
          </View>
          <View
            style={{
              justifyContent: "space-between",
              paddingVertical: 8,
              // backgroundColor: primaryColor_50,
              height: 60,
              flexShrink: 1,
              flexGrow: 1,
            }}
          >
            <View
              style={{
                width: 164,
                height: 16,
              }}
            />
            <View
              style={{
                width: 180,
                height: 24,
              }}
            />
          </View>
        </View>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 48,
            borderRadius: 8,
            marginVertical: 8,
          }}
        />
      </View>
    );
  };
  return (
    <SkeletonLoading borderRadius={4}>
      {renderStudentItem()}
      {renderStudentItem()}
      {renderStudentItem()}
    </SkeletonLoading>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
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
  headerText: {
    width: 120,
    height: 20,
  },
  subText: {
    width: 160,
    height: 16,
    marginTop: 4,
  },
  editView: {
    width: 80,
    height: 20,
    borderRadius: 4,
  },
  editText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "RHD-Medium",
  },
  studentInfoView: {
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
});
