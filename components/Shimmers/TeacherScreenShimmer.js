import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import { View, Text, StyleSheet } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
} from "../../utils/Color";

export default function TeacherScreenShimmer() {
  const renderTeacherItem = () => {
    return (
      <View style={styles.examView}>
        <View
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
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
    );
  };
  return <SkeletonPlaceholder borderRadius={4}>
    {renderTeacherItem()}
    {renderTeacherItem()}
    {renderTeacherItem()}
    {renderTeacherItem()}
    {renderTeacherItem()}
    {renderTeacherItem()}
    {renderTeacherItem()}
    {renderTeacherItem()}
  </SkeletonPlaceholder>;
}

const styles = StyleSheet.create({
  examView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
    paddingBottom: 16,
  },
  examHeader: {
    marginTop: 4,
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
