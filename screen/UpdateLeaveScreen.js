import React, { useState, useEffect } from "react";

import {
  Container,
  ContentView,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
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
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import { InformationView } from "../components/Modals";
import { formatDate } from "../utils/DateUtils";
import InAppNotification from "../utils/InAppNotification";

const UpdateLeaveScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [leaveInfo, setLeaveInfo] = useState(route.params?.leave ?? null);
  const [reason, setReason] = useState("");
  const [reasonFocused, setReasonFocused] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);

  useEffect(() => {
    console.log("Leave Item: ", leaveInfo);

    return () => {};
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    supabase_api.shared
      .updateLeaveRequest(leaveInfo?.id,reason,true)
      .then(() => {
        navigation.goBack();
        InAppNotification.shared.showSuccessNotification({
          title: "Leave Application Approved!",
          description:""
        });
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("ApplyLeaveScreen: handleSubmit: ", error);
      })
      .finally(() => setLoading(false));
  };

  toggleModal = () => {
    setShowStudentDialog(!showStudentDialog);
  };



  const renderLeaveInfo = () => {
    if (leaveInfo == null) return;
    const {
      created_at,
      parent_info: { name: parentName },
      student_info: {
        class_info: { section, standard },
        name: studentName,
      },
      type,
    } = leaveInfo;
    return (
      <View
        style={{
          paddingHorizontal: 16,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row" }}>
          <InformationView label={"Name"} value={studentName} />
          <InformationView
            label={"Class"}
            value={standard + section + " Standard"}
          />
          <InformationView label={"Type"} value={type} />
        </View>
        <InformationView
          label={"From"}
          value={formatDate(startDate.toISOString())}
        />
        <InformationView
          label={"To"}
          value={formatDate(endDate.toISOString())}
        />
        <InformationView label={"Submitted By"} value={parentName} />
        <InformationView
          label={"Submitted On"}
          value={formatDate(new Date(created_at).toISOString())}
        />
      </View>
    );
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
              <Text style={styles.headerText}>Update Leave Request</Text>
            </View>
            <Text style={styles.subText}>
              Efficiently manage student leave requests here! ✅ Review,
              approve, or decline leave applications promptly, ensuring a smooth
              learning journey for all.
            </Text>
          </View>
          <Text style={styles.basicHeaderText}>Student Details</Text>
          {renderLeaveInfo()}
          <View
            style={{
              justifyContent: "space-between",
              borderTopWidth: borderWidth,
              borderColor: borderColor,
              marginTop: 8,
            }}
          >
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Remarks</Text>
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
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View style={styles.secondaryButton}>
              {loading && <ActivityIndicator size={36} color={"#fff"} />}
              {!loading && (
                <Text style={styles.secondaryButtonLabel}>Decline</Text>
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View style={styles.primaryButton}>
              {loading && <ActivityIndicator size={36} color={"#fff"} />}
              {!loading && <Text style={styles.primaryText}>Approve</Text>}
            </View>
          </TouchableOpacity>
        </View>
      </ContentView>
    </Container>
  );
};

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
    paddingTop: 16,
    paddingBottom: 8,
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
  inputView: {
    marginTop: 16,
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
    borderRadius: 48,
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
    marginEnd: 8,
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
  searchView: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 12,
    marginBottom: 12,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontFamily: "RHD-Medium",
    marginHorizontal: 16,
  },
  secondaryButton: {
    borderColor: primaryColor,
    borderWidth: 1,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonLabel: {
    color: primaryColor,
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    fontSize: 16,
    alignSelf: "center",
  },
});

export default React.memo(UpdateLeaveScreen);
