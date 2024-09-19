import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor_50,
  secondaryText,
  primaryColor_300,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
const { width, height } = new Dimensions.get("screen");
import EmptyState from "./EmptyState";
import InAppNotification from "../utils/InAppNotification";
import { getFormattedDay } from "../utils/DateUtils";
import CircularProgress from "react-native-circular-progress-indicator";
import { Feather } from "@expo/vector-icons";

export default function TeacherSubjectList({ classID }) {
  const navigation = useNavigation();
  const limit = 5;
  const [studentList, setStudentList] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [lastItem, setLastItem] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    retrieveData(0, 5);
    return () => {};
  }, []);

  const retrieveData = (startIndex, endIndex) => {
    supabase_api.shared
      .getTeacherSubjectDetails(classID, startIndex, endIndex)
      .then((res) => {
        console.log("Res: ", res);
        setStudentList(res);
      })
      .catch((error) => {
        InAppNotification.shared.showErrorNotification(
          "StudentList: getClassChildrenInfo: ",
          error
        );
      });
  };

  const retrieveMore = () => {
    // supabase_api.shared
    //     .getStudentApplication(0, limit)
    //     .then((res) => {
    //       setStudentList([...studentList,res]);
    //       setLastItem(res.length < limit)
    //       setLastVisible(studentList.length)
    //     })
    //     .catch((error) => {
    //       ErrorLogger.shared.ShowError("StudentList: getStudentApplication: ", error);
    //     })
    //     .finally(() => setLoading(false));
  };

  const RenderStudent = ({ item, index }) => {
    if (item === null) return;
    const {
      progress,
      subject,
      class_info: { id, standard, section, student_count },
    } = item;
    return (
      <View
        key={index}
        style={{
          alignItems: "center",
          borderWidth: borderWidth,
          borderColor: borderColor,
          marginBottom: 8,
          justifyContent: "space-between",
          borderRadius: 8,
          flexDirection: "row",
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              lineHeight: 24,
              fontSize: 16,
              color: primaryText,
            }}
            numberOfLines={2}
          >
            {subject}
          </Text>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              lineHeight: 21,
              fontSize: 14,
              color: secondaryText,
            }}
            numberOfLines={2}
          >
            {getFormattedDay(standard) + " standard " + section + " section"}
          </Text>
        </View>
        <View style={{flexDirection:"row"}}>
        <CircularProgress
          value={progress * 100}
          radius={20}
          duration={100}
          progressValueColor={primaryText}
          maxValue={100}
          valueSuffix={"%"}
          activeStrokeWidth={4}
          inActiveStrokeWidth={4}
          activeStrokeColor={ primaryColor_300}
          inActiveStrokeColor={primaryColor_50}
        />
        <TouchableOpacity style={{alignSelf:"center",marginStart:16}}>
          <Feather name="chevron-right" size={24} color={primaryText}/>
        </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          style={{
            marginTop: 8,
            backgroundColor: primaryColor,
            paddingHorizontal: 16,
            paddingVertical: 4,
            borderRadius: 20,
          }}
        >
          <Text
            style={{
              fontFamily: "RHD-Medium",
              color: "#fff",
            }}
          >
            View
          </Text>
        </TouchableOpacity> */}
      </View>
    );
  };

  const renderHeader = () => {
    return null;
  };

  const renderEmpty = () => {
    if (!loading && studentList?.length == 0) {
      return (
        <EmptyState
          title=""
          description={"You don't have any pending student requests."}
          animation={require("../assets/animations/no_leave.json")}
        />
      );
    } else {
      return <View></View>;
    }
  };

  return (
    <FlatList
      contentContainerStyle={{ marginTop: 16, paddingHorizontal: 16 }}
      data={studentList.slice(0, 4)}
      renderItem={({ item, index }) => (
        <RenderStudent item={item} index={index} />
      )}
      keyExtractor={(item, index) => String(index)}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
      onEndReached={retrieveMore}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    // marginVertical: 8,
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    flexDirection: "row",
  },
  subView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 24,
    textAlignVertical: "center",
    alignSelf: "center",
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: "center",
    alignSelf: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: primaryColor_50,
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: borderWidth,
    borderBottomColor: borderColor,
  },
  subLabel: {
    fontSize: 14,
    color: primaryText,
    marginTop: 8,
    fontFamily: "RHD-Medium",
    flexShrink: 1,
    textAlign: "center",
  },
  shimText: {
    height: 15,
    marginTop: 3,
  },
});
