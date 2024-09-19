import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Image,
  Text,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor_50,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
const { width, height } = new Dimensions.get("screen");
import EmptyState from "./EmptyState";
import InAppNotification from "../utils/InAppNotification";
export default function SubjectList({ classID }) {
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
      .getTeachersDetails(classID, startIndex, endIndex)
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
      teacher_info: { avatar, id, name },
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
        <Image
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            borderWidth: borderWidth,
            borderColor: borderColor,
          }}
          // source={{ uri: avatar }}
          defaultSource={require("../assets/DefaultImage.jpg")}
        />
        <View style={{ flex: 1, paddingHorizontal:16}}>
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
            {name}
          </Text>
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
      contentContainerStyle={{ marginTop: 8 }}
      data={studentList.slice(0,4)}
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
