import React, { useState, useEffect } from "react";

import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  TitleHeader,
  TitleSubHeader,
  TitleView,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import {
  primaryColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import LeaveItem from "../components/LeaveItem";
import { Calendar } from "react-native-calendars";

export default function HolidayCalenderScreen() {
  const navigation = useNavigation();
  const [holidayList, setHolidayList] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    supabase_api.shared
      .getStudentHolidayList(Student.shared.getMasterStudentSchoolID())
      .then((res) => {
        setHolidayList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "HolidayCalenderScreen: getStudentHolidayList: ",
          error
        );
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);


  function setMarkedDates() {
    // holidayList.forEach((holiday) => {
    //   let marked = getMarked(holiday.start_date, holiday.end_date);
    //   console.log("Marked: ",marked)
    //   setMarkedHolidays([markedHolidays, ...marked]);
    // });
    getMarked(holidayList[0]?.start_date, holidayList[0]?.end_date);
  }

  const getMarked = () => {
    let marked = {};

    holidayList.forEach((range) => {
      const startDate = range.start_date;
      const endDate = range.end_date;

      const startYear = parseInt(startDate.split("-")[0], 10);
      const startMonth = parseInt(startDate.split("-")[1], 10);
      const startDay = parseInt(startDate.split("-")[2], 10);

      const endYear = parseInt(endDate.split("-")[0], 10);
      const endMonth = parseInt(endDate.split("-")[1], 10);
      const endDay = parseInt(endDate.split("-")[2], 10);

      const startDateObj = new Date(startYear, startMonth - 1, startDay);
      const endDateObj = new Date(endYear, endMonth - 1, endDay);

      let currentDate = new Date(startDateObj);

      while (currentDate <= endDateObj) {
        let day = currentDate.getDate().toString().padStart(2, "0");
        let month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        let year = currentDate.getFullYear();

        let formattedDate = `${year}-${month}-${day}`;

        marked[formattedDate] = {
          startingDay: formattedDate === startDate,
          endingDay: formattedDate === endDate,
          color: primaryColor_800,
          textColor: primaryColor_50,
          disabled: true,
        };

        currentDate.setDate(currentDate.getDate() + 1); // Move to the next day
      }
    });
    return marked;
  };


  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ContentView>
        <ToolbarBorder>
          <MenuItem onPress={() => navigation.goBack()}>
            <Feather name={"arrow-left"} size={24} color={primaryText} />
          </MenuItem>
          <TitleView>
            <TitleSubHeader>Holiday Calendar</TitleSubHeader>
            <TitleHeader numberOfLines={1}>
              {Student.shared.getMasterStudentSchoolName()}
            </TitleHeader>
          </TitleView>
          <MenuItem onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Holiday Calendar",
            });
          }}>
            <Feather name={"alert-circle"} size={20} color={primaryText} />
          </MenuItem>
        </ToolbarBorder>

        {loading ? (
          <ActivityIndicator
            style={{ alignSelf: "center",flex:1 }}
            size={24}
            color={primaryColor}
          />
        ) : (
          <>
            <Calendar
              // Customize the appearance of the calendar
              style={{
                width: "100%",
              }}
              // Specify the current date
              // current={new Date().toLocaleDateString()}
              // Callback that gets called when the user selects a day
              onDayPress={(day) => {
                console.log("selected day", day);
              }}
              theme={{
                backgroundColor: "#ffffff",
                calendarBackground: "#ffffff",
                textSectionTitleColor: "#b6c1cd",
                selectedDayBackgroundColor: "#00adf5",
                selectedDayTextColor: "#ffffff",
                todayTextColor: primaryColor,
                dayTextColor: primaryText,
                textDisabledColor: secondaryText,
                arrowColor: "black",
                arrowStyle: { padding: 0 },
                monthTextColor: primaryColor,
                textMonthFontSize: 16,
                textMonthFontFamily: "RHD-Medium",
              }}
              // Mark specific dates as marked
              markingType="period"
              markedDates={getMarked()}
            />
            <FlatList
              contentContainerStyle={{ marginTop: 24 }}
              data={holidayList}
              renderItem={({ item }) => <LeaveItem item={item} />}
              keyExtractor={(item, index) => String(index)}
              horizontal={false}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  subLabel: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryText,
    marginBottom: 16,
  },
});
