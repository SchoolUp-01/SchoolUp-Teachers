import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, FlatList, TouchableWithoutFeedback, ImageBackground } from "react-native";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor_50,
  defaultImageBgColor,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
const { width, height } = new Dimensions.get("screen");
import EmptyState from "./EmptyState";
import AttendanceItem from "./AttendanceItem";
import ErrorLogger from "../utils/ErrorLogger";
import { LinearGradient } from "expo-linear-gradient";
export default function MemoriesList() {
  const navigation = useNavigation();
  const limit = 5;
  const [leaveList, setLeaveList] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [lastItem, setLastItem] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase_api.shared
      .getStudentMemories(0, limit)
      .then((res) => {
        console.log("Memories: ", res);
        setLeaveList(res)
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("LeaveList: getLeaveApplication: ", error);
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  const retrieveMore = () => {
    // supabase_api.shared
    //     .getLeaveApplication(0, limit)
    //     .then((res) => {
    //       setLeaveList([...leaveList,res]);
    //       setLastItem(res.length < limit)
    //       setLastVisible(leaveList.length)
    //     })
    //     .catch((error) => {
    //       ErrorLogger.shared.ShowError("LeaveList: getLeaveApplication: ", error);
    //     })
    //     .finally(() => setLoading(false));
  };
  const MemoryItem = (item) => {
    console.log("URL:",item?.item?.caption)
    return (
      <View
        style={{
          width: width * 0.275,
          height: width / 2,
          marginHorizontal: 4,
          marginVertical: 8,
        }}
      >
        <TouchableWithoutFeedback
          style={styles.memoryItem}
          onPress={() => {
            
          }}
        >
          <View>
            <ImageBackground
              style={{
                width: "100%",
                height: width / 2,
                borderRadius: 8,
              }}
              imageStyle={{ borderRadius: 8 }}
              source={{
                uri: item?.item?.url,
              }}
            >
              
            </ImageBackground>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderEmpty = () => {
    if (!loading && leaveList?.length == 0) {
      return (
        <EmptyState
          title="Congratulations"
          description={
            Student.shared.getMasterStudentName() +
            " hasn't taken a single leave this academic year, keep going strong!"
          }
          animation={require("../assets/animations/no_leave.json")}
        />
      );
    } else {
      return <View></View>;
    }
  };

  return (
    <FlatList
      contentContainerStyle={{ paddingHorizontal:16}}
      data={leaveList}
      renderItem={({ item }) => <MemoryItem item={item} />}
      keyExtractor={(item, index) => String(index)}
      horizontal={true}
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
  memoryItem: {
    width: width / 3 - 48,
    height: width / 2,
    marginVertical: 6,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});
