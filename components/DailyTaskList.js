import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text,
  RefreshControl,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor_50,
  secondaryText,
  primaryColor,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
const { width, height } = new Dimensions.get("screen");
import EmptyState from "./EmptyState";
import DailyActivityItem from "./DailyActivityItem";
import ErrorLogger from "../utils/ErrorLogger";
export default function DailyTaskList({ setCallback }) {
  const navigation = useNavigation();
  const limit = 5;
  const [dailyTaskList, setDailyTaskList] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [lastItem, setLastItem] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    retrieveData();
    return () => {};
  }, []);

  useEffect(() => {
    if (setCallback) setCallback(itemDeletedCallback);
  }, []);

  const itemDeletedCallback = (deletedItemId) => {
    setRefresh(true);
    console.log("DeletedID: ", deletedItemId);
    console.log("DailyTaskList: ", dailyTaskList);
    const updatedLeaveList = dailyTaskList.filter(
      (item) => item.id === deletedItemId
    );
    console.log("UpdatedLeaveList: ", updatedLeaveList);
    // setLeaveList(updatedLeaveList);
    setRefresh(false);
    return;
  };

  const retrieveData = () => {
    supabase_api.shared
      .getDailyTaskApplication(0, limit)
      .then((res) => {
        setDailyTaskList(res);
        setLastItem(res.length < limit);
        setLastVisible(res.length);
        setLoading(true);
        setRefresh(false)
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "DailyTaskList: getDailyTaskApplication: ",
          error
        );
      })
      .finally(() => setLoading(false));
  };

  const retrieveMore = () => {
    // supabase_api.shared
    //     .getLeaveApplication(0, limit)
    //     .then((res) => {
    //       setLeaveList([...dailyTaskList,res]);
    //       setLastItem(res.length < limit)
    //       setLastVisible(dailyTaskList.length)
    //     })
    //     .catch((error) => {
    //       ErrorLogger.shared.ShowError("LeaveList: getLeaveApplication: ", error);
    //     })
    //     .finally(() => setLoading(false));
  };

  const renderEmpty = () => {
    if (!loading&&!refresh && dailyTaskList?.length == 0) {
      return (
        <EmptyState
          title="No Information available"
          description="No Activities available at the moment, please check back later."
          animation={require("../assets/animations/no_data.json")}
        />
      );
    } else {
      return <View></View>;
    }
  };

  const Header = () => {
    return null;
  };

  const handleRefresh = () => {
    setRefresh(true);
    setLastVisible(0);
    setDailyTaskList([]);
    setLastItem(false);
    retrieveData();
  };

  const renderItem = ({ item, index }) => {
    // Add any additional logic or checks you need here
    let sameDay = false;
    let givenDate = new Date(item.created_at);
    if (index == 0) {
      sameDay = false;
    } else {
      let previousDate = new Date(dailyTaskList[index - 1].created_at);
      sameDay = givenDate.getDate() === previousDate.getDate();
    }
    return (
      <View>
        {!sameDay && <Text style={styles.label}>{formatDate(givenDate)}</Text>}
        <DailyActivityItem item={item} />
      </View>
    );
  };

  const formatDate = (date) => {
    // Implement your custom date formatting logic here
    const options = { weekday: "short", month: "short", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  return (
    <FlatList
      data={dailyTaskList}
      renderItem={renderItem}
      keyExtractor={(item, index) => String(index)}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
      ListHeaderComponent={Header}
      onEndReached={retrieveMore}
      refreshing={refresh}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          onRefresh={handleRefresh}
          colors={[primaryColor]}
          tintColor={primaryColor}
        />
      }
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
  infoItem: {
    flex: 1,
    alignItems: "center",
  },
  infoLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    textAlign: "left",
  },
  infoValue: {
    fontFamily: "RHD-Bold",
    fontSize: 24,
    lineHeight: 36,
    color: primaryText,
    textAlignVertical: "bottom",
  },
  label: {
    fontFamily: "RHD-Medium",
    fontSize: 14,
    lineHeight: 21,
    color: secondaryText,
    textAlign: "left",
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
});
