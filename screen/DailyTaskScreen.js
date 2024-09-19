import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  MenuItem,
  Title,
  Toolbar,
} from "../components/styledComponents";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import CustomStatusBarView from "../components/CustomStatusBarView";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import AttendanceTaskItem from "../components/AttendanceTaskItem";
import DailyTaskList from "../components/DailyTaskList";
import PagerView from "react-native-pager-view";
export default function DailyTaskScreen() {
  const navigation = useNavigation();
  const [currentTask, setCurrentTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Pending");
  const [selectedPage, setSelectedPage] = useState(0);
  const pagerRef = useRef();
  const tabList = ["Pending", "Completed"];

  const TabItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ alignSelf: "center", justifyContent: "center", flex: 1 }}
        onPress={() => {
          pagerRef.current.setPage(tabList.indexOf(item));
        }}
      >
        <View
          style={[
            styles.tabItem,
            {
              borderColor: item == tab ? primaryColor : borderColor,
              borderBottomWidth: item == tab ? 1 : 0,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: item == tab ? primaryColor : primaryText,
                fontFamily: item == tab ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    supabase_api.shared
      .getRemainingTimeTable()
      .then((res) => {
        console.log("Res: ", res);
        setCurrentTask(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "DailyTaskScreen: getRemainingTimeTable: ",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });
    return () => {};
  }, []);

  const renderEmpty = () => {
    if (loading) return;
    return (
      <View style={styles.feedItem}>
        <View
          style={{
            flexGrow: 1,
            flexDirection: "column",
            flexShrink: 1,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              marginTop: 6,
              marginStart: 6,
              lineHeight: 24,
              fontFamily: "RHD-Medium",
              color: primaryText,
            }}
          >
            You have no pending tasks for today.
          </Text>
          <Text
            style={{
              marginHorizontal: 8,
              marginBottom: 8,
              fontSize: 14,
              lineHeight: 21,
              overflow: "hidden",
              color: secondaryText,
              fontFamily: "RHD-Medium",
            }}
            numberOfLines={2}
          >
            Great news! You don't have any pending tasks for today. Enjoy your
            day.📚✨
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView />
      <Toolbar>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <Title>Daily Tasks</Title>
        <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Daily Task",
            });
          }}
        >
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </Toolbar>
      <View style={styles.tabView}>
        <TabItem item={tabList[0]} />
        <TabItem item={tabList[1]} />
      </View>
      <PagerView
        ref={pagerRef}
        style={{
          flex: 1,
        }}
        initialPage={selectedPage}
        onPageSelected={(position) => {
          setSelectedPage(position.nativeEvent.position);
          setTab(tabList[position.nativeEvent.position])
        }}
      >
        <View style={{ flex: 1 }}>
          <FlatList
            scrollEnabled={false}
            data={currentTask}
            renderItem={({ item, index }) => <AttendanceTaskItem item={item} />}
            keyExtractor={(item) => String(item.id).toString()}
            ListEmptyComponent={renderEmpty}
          />
        </View>
        <View style={{ flex: 1 }}>
          <DailyTaskList />
        </View>
      </PagerView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
  },
  subLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryText,
    marginBottom: 16,
  },
  leaveView: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  leaveType: { fontFamily: "RHD-Medium", fontSize: 16, lineHeight: 24 },
  leaveReason: { fontFamily: "RHD-Regular", fontSize: 14, lineHeight: 18 },
  leaveSubView: {
    flex: 1,
    flexDirection: "row",
    marginStart: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontFamily: "RHD-Bold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
  },
  dateView: {
    backgroundColor: primaryColor_800,
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
  },
  progressView: {
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 14,
    marginTop: 8,
    fontFamily: "RHD-Medium",
  },
  shimText: {
    height: 15,
    marginTop: 3,
  },
  feeItem: {
    flex: 1,
    alignItems: "center",
  },
  feeLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    textAlign: "left",
  },
  feeValue: {
    fontFamily: "RHD-Bold",
    fontSize: 24,
    lineHeight: 36,
    color: primaryText,
    textAlignVertical: "bottom",
  },
  subView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 16,
  },
  subText: {
    fontSize: 16,
    fontFamily: "RHD-Medium",
    color: primaryText,
    textTransform: "capitalize",
  },
  feedItem: {
    marginHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    marginVertical: 8,
    minWidth: 64,
    alignItems: "center",
    // backgroundColor: itemColor,
  },
  tagText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  label: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    color: secondaryText,
    textAlign: "left",
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  tabItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "center",
    // backgroundColor: itemColor,
  },
  tabView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
});

{
  /* <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            marginVertical: 20,
          }}
        >
          <View style={styles.progressView}>
            <CircularProgress
              value={((totalDays - totalLeaves) / totalDays) * 100}
              radius={32}
              duration={100}
              progressValueColor={primaryText}
              maxValue={100}
              valueSuffix={"%"}
            />
            <Text style={styles.progressLabel}>Attendance</Text>
          </View>
          <View>
            <CircularProgress
              value={(totalLeaves / totalDays) * 100}
              radius={32}
              duration={100}
              progressValueColor={primaryText}
              maxValue={100}
              valueSuffix={"%"}
            />
            <Text style={styles.progressLabel}>Total Leave</Text>
          </View>
          <View>
            <CircularProgress
              value={(sickLeaves / totalDays) * 100}
              radius={32}
              duration={100}
              progressValueColor={primaryText}
              maxValue={100}
              valueSuffix={"%"}
            />
            <Text style={styles.progressLabel}>Sick Leave</Text>
          </View>
        </View> */
}
{
  /* <View style={styles.subView}>
          <Text style={styles.subText}>History</Text>
          <Feather name="calendar" color={primaryText} size={20} />
        </View>
        <View style={{
          paddingHorizontal:16,
                    flexDirection: "row",
                    marginTop: 8,
                    flexWrap: "wrap",
                  }}>
        <OptionItem item={"All"} />
                  <OptionItem item={"Approved"} />
                  <OptionItem item={"Sick Leave"} />
        </View> */
}
