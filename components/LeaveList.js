import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, FlatList,ScrollView } from "react-native";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor_50,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
const { width, height } = new Dimensions.get("screen");
import EmptyState from "./EmptyState";
import AttendanceItem from "./AttendanceItem";
import ErrorLogger from "../utils/ErrorLogger";
export default function LeaveList({ onLeaveClicked }) {
  const navigation = useNavigation();
  const limit = 5;
  const [leaveList, setLeaveList] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [lastItem, setLastItem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [classList, setClassList] = useState([]);


  useEffect(() => {
    supabase_api.shared
      .getLeaveApplication(0, limit)
      .then((res) => {
        setLeaveList(res);
        setLastItem(res.length < limit);
        setLastVisible(res.length);
        setLoading(true);
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

  const renderHeader = () => {
    if (leaveList.length !== 0)
      return (
        <View style={{ height: 56 }}>
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              marginTop: 16,
              paddingHorizontal: 16,
              marginBottom: 8,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {classList &&
              classList.length > 0 &&
              classList.map((item, index) => (
                <OptionItem key={index} item={item} />
              ))}
          </ScrollView>
        </View>
      );
  };

  const renderEmpty = () => {
    if (!loading && leaveList?.length == 0) {
      return (
        <EmptyState
          title=""
          description={"You don't have any pending leave requests."}
          animation={require("../assets/animations/no_leave.json")}
        />
      );
    } else {
      return <View></View>;
    }
  };

  return (
    <FlatList
      contentContainerStyle={{}}
      data={leaveList}
      renderItem={({ item }) => (
        <AttendanceItem item={item} onLeaveClicked={onLeaveClicked} />
      )}
      keyExtractor={(item, index) => String(index)}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={renderHeader}
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
