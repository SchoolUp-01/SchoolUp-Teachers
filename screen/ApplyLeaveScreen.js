import React, { useState } from "react";

import { Container, ContentView } from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  borderColor,
  borderWidth,
  itemBorder,
  itemColor,
  primaryColor,
  primaryColor_300,
  primaryColor_50,
  primaryColor_800,
  primaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";

export default function ApplyLeaveScreen() {
  const navigation = useNavigation();
  const [reason, setReason] = useState("");
  const [reasonFocused, setReasonFocused] = useState(false);
  const [leaveType, setLeaveType] = useState("General");
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [showEndDate, setShowEndDate] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    supabase_api.shared
      .addLeaveRequest(startDate, endDate, leaveType, reason)
      .then((res) => {
        navigation.replace("AttendanceScreen");
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("ApplyLeaveScreen: handleSubmit: ", error);
      })
      .finally(() => setLoading(false));
  };

  const setDateStart = (event, date) => {
    setShowStartDate(false);
    setStartDate(date);
  };

  const setDateEnd = (event, date) => {
    setShowEndDate(false);
    setEndDate(date);
  };

  const MenuItem = ({ item }) => {
    return (
      <View
        style={[
          styles.feedItem,
          {
            borderColor: item == leaveType ? primaryColor : borderColor,
          },
        ]}
      >
        <TouchableOpacity onPress={() => setLeaveType(item)}>
          <Text
            style={[
              styles.tagText,
              {
                color: item == leaveType ? primaryColor : primaryText,
                fontFamily: item == leaveType ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderDatePicker = () => {
    if (Platform.OS == "ios") {
      return (
        <View style={{ paddingHorizontal: 16, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputText}>From Date</Text>
            <TouchableOpacity onPress={() => setShowStartDate(true)}>
              <View style={styles.dateView}>
                {/* <Text style={styles.dateText}>{startDate.toDateString()}</Text>
                    <Feather name="calendar" size={16} color={primaryText} /> */}
                {/* {showStartDate && ( */}
                <DateTimePicker
                  style={{ margin: 0, padding: 0, backgroundColor: "#fff" }}
                  testID="dateTimePicker"
                  value={startDate}
                  mode={"date"}
                  is24Hour={true}
                  onChange={setDateStart}
                  textColor={primaryColor}
                  accentColor={primaryColor}
                  backgroundColor={"#fff"}
                  minimumDate={new Date()}
                />
                {/* )} */}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputText}>To Date</Text>
            <TouchableOpacity>
              <View style={styles.dateView}>
                <DateTimePicker
                  style={{ margin: 0, padding: 0, backgroundColor: "#fff" }}
                  testID="dateTimePicker"
                  value={startDate}
                  mode={"date"}
                  is24Hour={true}
                  onChange={setDateEnd}
                  textColor={primaryColor}
                  accentColor={primaryColor}
                  backgroundColor={"#fff"}
                  minimumDate={startDate}
                />
                {/* <Text style={styles.dateText}>16th Jun 2023</Text>
                    <Feather name="calendar" size={16} color={primaryText} /> */}
                {/* <DateTimePicker
                    style={{ backgroundColor: 'white' }}
                      testID="start"
                      value={startDate}
                      textColor={primaryColor}
                      accentColor={primaryColor}
                      backgroundColor={"#fff"}
                      // style={{
                      //   backgroundColor: "#fff",
                      //   color: primaryColor,
                      //   alignSelf: "flex-start",
                      // }}
                      // customStyles={{
                      //   btnTextText: {
                      //     colorAccent: primaryColor,
                      //   },
                      //   btnTextConfirm: {
                      //     color: primaryColor,
                      //   },
                      // }}
                      mode={"date"}
                      is24Hour={true}
                      minimumDate={startDate}
                      onChange={setDateEnd}
                    /> */}
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ paddingHorizontal: 16, flexDirection: "row" }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputText}>From Date</Text>
            <TouchableOpacity onPress={() => setShowStartDate(true)}>
              <View style={styles.androidDateView}>
                <Text style={styles.dateText}>{startDate.toDateString()}</Text>
                <Feather name="calendar" size={16} color={primaryText} />
                {showStartDate && (
                  <DateTimePicker
                    style={{ margin: 0, padding: 0, backgroundColor: "#fff" }}
                    testID="dateTimePicker"
                    value={startDate}
                    mode={"date"}
                    is24Hour={true}
                    onChange={setDateStart}
                    textColor={primaryColor}
                    accentColor={primaryColor}
                    backgroundColor={"#fff"}
                    minimumDate={new Date()}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.inputText}>To Date</Text>
            <TouchableOpacity onPress={()=> setShowEndDate(true)}>
              <View style={styles.androidDateView}>
                {showEndDate && (
                  <DateTimePicker
                    style={{ margin: 0, padding: 0, backgroundColor: "#fff" }}
                    testID="dateTimePicker"
                    value={startDate}
                    mode={"date"}
                    is24Hour={true}
                    onChange={setDateEnd}
                    textColor={primaryColor}
                    accentColor={primaryColor}
                    backgroundColor={"#fff"}
                    minimumDate={startDate}
                  />
                )}
                <Text style={styles.dateText}>{new Date(endDate).toDateString()}</Text>
                <Feather name="calendar" size={16} color={primaryText} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    }
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ContentView
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View>
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
              <Text style={styles.headerText}>Apply Leave</Text>
            </View>
            <Text style={styles.subText}>
              To process your child's leave application smoothly, please provide
              the following details
            </Text>
          </View>
          <Text style={styles.basicHeaderText}>Leave Application</Text>
          <View
            style={{
              justifyContent: "space-between",
            }}
          >
            {renderDatePicker()}

            <View style={styles.inputView}>
              <Text style={styles.inputText}>Type</Text>
              <View style={{ flexDirection: "row", marginTop: 8 }}>
                <MenuItem item={"General"} />
                <MenuItem item={"Sick Leave"} />
              </View>
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Reason for leave</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    height: 120,
                    borderColor: reasonFocused ? primaryColor : borderColor,
                    borderWidth: reasonFocused ? 1 : borderWidth,
                  },
                ]}
                numberOfLines={6}
                multiline
                autoCapitalize="none"
                selectionColor={primaryColor}
                placeholder={""}
                onChangeText={(text) => setReason(text)}
                value={reason}
                placeholderTextColor={borderColor ?? underlayColor}
                onFocus={() => setReasonFocused(true)}
                onBlur={() => setReasonFocused(false)}
              ></TextInput>
            </View>
          </View>
        </View>
        <View>
          <Text style={styles.leaveInfoText}>
            {leaveType == "General"
              ? "Leave Application will be sent to Class Teacher "
              : "Class Teacher "}
            <Text style={{ fontFamily: "RHD-Bold" }}>{Student.shared.getMasterStudentTeacherName()}</Text>
            {leaveType == "General"
              ? " for approval "
              : " will be informed about pupil sick leave."}
          </Text>
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View style={styles.primaryButton}>
              {loading && <ActivityIndicator size={36} color={"#fff"} />}
              {!loading && (
                <Text style={styles.primaryText}>Send Leave Application</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ContentView>
    </Container>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    marginTop: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    marginTop: 5,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  recentView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: primaryColor_10, //c7c7c7
    borderBottomColor: primaryColor_300,
    borderBottomWidth: borderWidth,
  },
  label: {
    paddingVertical: 12,
    marginHorizontal: 16,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryColor, //979797
    fontWeight: "500",
  },
  textInput: {
    fontSize: 16,
    marginVertical: 8,
    color: primaryText,
    paddingVertical: 8,
    borderWidth: itemBorder,
    backgroundColor: itemColor,
    borderColor: borderColor,
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    minHeight: 84,
    fontFamily: "RHD-Medium",
  },
  button: {
    margin: 16,
    backgroundColor: primaryColor,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: borderColor,
    borderRadius: 12,
    borderWidth: borderWidth,
    marginEnd: 12,
    fontFamily: "RHD-Regular",
    fontSize: 14,
    lineHeight: 21,
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
  basicHeaderText: {
    fontFamily: "RHD-Medium",
    fontSize: 18,
    lineHeight: 27,
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 120,
    borderColor: borderColor,
    borderWidth: borderWidth,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    color: primaryText,
  },
  secondaryText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "RHD-Regular",
    color: primaryText,
  },
  secondaryButton: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: borderWidth,
    borderColor: borderColor,
    marginEnd: 12,
    fontFamily: "RHD-Medium",
    height: 40,
    textAlignVertical: "center",
    fontSize: 16,
    alignContent: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  inputView: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: primaryText,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: "RHD-Medium",
    backgroundColor: itemColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
    marginTop: 4,
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: primaryColor,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#fff",
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    fontSize: 16,
    alignSelf: "center",
  },
  dateText: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    marginEnd:8
    // textAlignVertical:"center"
  },
  tagText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
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
    // backgroundColor: itemColor,
  },
  dateView: {
    flexDirection: "row",
    justifyContent: "center",
    // borderColor: borderColor,
    // borderWidth: borderWidth,
    // paddingHorizontal: 12,
    // paddingVertical: 12,
    // borderRadius: 8,
    marginTop: 8,
    // marginEnd: 16,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    backgroundColor: primaryColor_50,
    marginStart: -16, //todo check for alternatives
  },
  androidDateView: {
    flexDirection: "row",
    justifyContent: "center",
    borderColor: borderColor,
    borderWidth: borderWidth,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    marginEnd: 16,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  leaveInfoText: {
    fontFamily: "RHD-Medium",
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
    color: primaryColor_800,
    backgroundColor: primaryColor_50,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#000000BC",
  },
});
