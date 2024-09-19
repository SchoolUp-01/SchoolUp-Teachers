import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { Container, ContentView } from "../components/styledComponents";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryColor,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import CustomStatusBarView from "../components/CustomStatusBarView";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import { AddNotificationModal } from "../components/Modals";
import { convertToIST } from "../utils/DateUtils";
import NotifyClassesList from "../components/NotifyClassesList";
import InAppNotification from "../utils/InAppNotification";
export default function AddNotificationScreen() {
  const navigation = useNavigation();
  const [totalDays, setTotalDays] = useState(0);
  const [sickLeaves, setSickLeaves] = useState(0);
  const [totalLeaves, setTotalLeaves] = useState(0);
  const [type, setType] = useState("All");
  const [showDialog, setShowDialog] = useState(false);
  const [leaveItem, setLeaveItem] = useState(null);
  const tabList = ["Classes", "Leave Request", "Concerns"];
  const [tab, setTab] = useState("Classes");
  const [classList,setClassList] = useState([]);
  const [startDate, setStartDate] = useState(new Date());
  const [data, setData] = useState([]);
  const [item, setItem] = useState(null);
  const [reminder, setReminder] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const callBackRef = useRef();
  useEffect(() => {
    let tomorrow = new Date();
    let tomorrowIST = convertToIST(tomorrow);
    tomorrowIST.setDate(tomorrowIST.getDate() + 1);
    setStartDate(tomorrowIST);
    generateDataForWeek(tomorrowIST);
    return () => {};
  }, []);

  useEffect (()=>{
    getClassesList()
    return () => {}
  },[])

  const getClassesList  =  () => {
    supabase_api.shared.getUniqueClassIds().then((res)=>{
      console.log(res[0])
      setClassList(res)
    }).catch((error)=>{
      ErrorLogger.shared.ShowError("AddNotificationScreen: getClassesList: ",error)
    })
  }

  const generateDataForWeek = (startOfWeek) => {
    const weekData = [];
    let currentDate = new Date(startOfWeek);

    // Skip Sundays and add classes for Monday to Saturday
    while (weekData.length < 7 || currentDate.getDay() === 0) {
      if (currentDate.getDay() !== 0) {
        weekData.push({ date: currentDate });
      }
      currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
    console.log("WeekData: ", weekData);
    setData((prevData) => [...prevData, ...weekData]);
  };

  const handleEndReached = () => {
    const nextWeekStartDate = new Date(
      data[data.length - 1].date.getTime() + 24 * 60 * 60 * 1000
    );
    if (data.length == 30) return; //Added limit to stop from crashing
    generateDataForWeek(nextWeekStartDate);
  };

  const renderItem = ({ item }) => (
    <NotifyClassesList date={item.date} onUpdate={onItemClicked} />
  );

  const OptionItem = ({ item }) => {
    return (
      <View
        style={[
          styles.optionItem,
          {
            borderColor: item == type ? primaryColor : borderColor,
          },
        ]}
      >
        <TouchableOpacity onPress={() => setType(item)}>
          <Text
            style={[
              styles.optionText,
              {
                color: item == type ? primaryColor : primaryText,
                fontFamily: item == type ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onItemClicked = (item, setReminderFunction, reminder, date) => {
    setItem(item);
    setReminder(reminder);
    setSelectedDate(date);
    callBackRef.current = setReminderFunction;
    setShowDialog(true);
  };

  const onAddNotification = (reminderValue) => {
    if (reminderValue == null) {
      InAppNotification.shared.showWarningNotification({
        title: "Reminders can't be empty.",
        description: "",
      });
    } else {
      supabase_api.shared
        .addSubjectNotification(item, reminderValue, selectedDate)
        .then((res) => {
          if (!!callBackRef.current) callBackRef.current(reminderValue);
          else console.log("Reminder CallBack is null");
          InAppNotification.shared.showSuccessNotification({
            title: "Notifications sent successfully!",
            description: "",
          });
        })
        .catch((error) => {
          ErrorLogger.shared.ShowError(
            "AddNotificationScreen: addSubjectNotification: ",
            error
          );
          InAppNotification.shared.showSuccessNotification({
            title: "Something went wrong!",
            description: "code:" + error?.code,
          });
        });
    }

    setShowDialog(false);
  };

  return (
    <Container>
      <CustomStatusBarView />
      <AddNotificationModal
        isVisible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={onAddNotification}
        item={item}
        reminderValue={reminder}
      />
      <View style={styles.toolbarView}>
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              style={{ marginEnd: 16 }}
              name="arrow-left"
              color={primaryText}
              size={24}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>Notify Parent</Text>
        </View>
        <Text style={styles.subText}>
          Notify parents about upcoming needs! Include class requirements or
          reminders. Keep it brief and informative!
        </Text>
      </View>
      <ContentView>
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
             <OptionItem key={0} item={"All"} />
            {classList &&
              classList.length > 0 &&
              classList.map((item, index) => (
                <OptionItem key={index+1} item={item?.class_info?.standard+" "+item?.class_info?.section} />
              ))}
          </ScrollView>
        </View>
        {/* <Text style={styles.label}>Upcoming classes</Text>
        <SubjectNotificationItem onUpdate={onItemClicked} />
        <SubjectNotificationItem onUpdate={onItemClicked} />
        <SubjectNotificationItem onUpdate={onItemClicked} />
        <SubjectNotificationItem onUpdate={onItemClicked} /> */}
        <FlatList
          data={data}
          renderItem={renderItem}
          keyExtractor={(item) => item.date.toISOString()}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.1}
          initialNumToRender={12} // Adjust as needed
          windowSize={6} // Adjust as needed
        />
      </ContentView>
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
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    marginBottom: 8,
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
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    textAlign: "left",
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  tabItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    // backgroundColor: itemColor,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  tabView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 8,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  optionText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  optionItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    backgroundColor: itemColor,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerText: {
    fontFamily: "RHD-Medium",
    fontSize: 20,
    lineHeight: 30,
  },
  subText: {
    fontFamily: "RHD-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: primaryText,
  },
  toolbarView: {
    marginHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
});
