import SkeletonPlaceholder from "expo-react-native-skeleton-placeholder";
import { View, Text, StyleSheet } from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
} from "../../utils/Color";

export default function AttendanceScreenShimmer() {
  const renderTeacherItem = () => {
    return (
      <View style={styles.examView}>
        <View
          style={{
            width: 64,
            height: 64,
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
    <View style={{marginHorizontal:16,marginVertical:8,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
      <View>
        <View  style={{width:80,height:16}}/>
        <View style={{width:80,height:12,marginTop:8}}/>
      </View>
      <View>
        <View  style={{width:80,height:16}}/>
        <View style={{width:80,height:12,marginTop:8}}/>
      </View>
      <View>
        <View  style={{width:80,height:16}}/>
        <View style={{width:80,height:12,marginTop:8}}/>
      </View>
    </View>
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
    paddingVertical: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    paddingBottom: 16,
    marginHorizontal:16,
    marginTop:16,
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
