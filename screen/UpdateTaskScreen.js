import React, { useState, useEffect } from "react";

import {
  ButtonItem,
  ButtonLabel,
  Container,
  ContentView,
  ScreenHint,
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
  Platform,
  Image,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  itemBorder,
  itemColor,
  primaryColor,
  primaryColor_300,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import BottomModal, { InformationView } from "../components/Modals";
import InAppNotification from "../utils/InAppNotification";
import CollapsableHeader from "../components/CollapsableHeader";
import { formatDate } from "../utils/DateUtils";
const { width, height } = new Dimensions.get("screen");
const UpdateTaskScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [taskInfo, setTaskInfo] = useState(route?.params?.item ?? null);
  const [reason, setReason] = useState("");
  const [reasonFocused, setReasonFocused] = useState(false);
  const [leaveType, setLeaveType] = useState("General");
  const [startDate, setStartDate] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [classInfoList, setClassInfoList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [absentList, setAbsentList] = useState([]);

  useEffect(() => {
    supabase_api.shared
      .getClassChildrenInfo(taskInfo?.class_id,0,100)
      .then((res) => {
        setClassInfoList(res);
        setSearchList(res);
      })
      .catch((error) => {
        InAppNotification.shared.showErrorNotification(
          "UpdateTaskScreen: getClassChildrenInfo: ",
          error
        );
      });

    return () => {};
  }, []);

  const handleSubmit = () => {
    if (loading) return;
    let absentees = absentList.map((item) => item.id);
    console.log(absentees);
    setLoading(true);
    supabase_api.shared
      .updateDailyTask(taskInfo.subject_id, null, absentees, taskInfo.id)
      .then(() => {
        InAppNotification.shared.showSuccessNotification({
          title: "Task Updated Successfully",
          description: "",
        });
        navigation.goBack();
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("UpdateTaskScreen: handleSubmit: ", error);
      })
      .finally(() => setLoading(false));
  };

  const renderUser = (item) => {
    if (item === null) return;
    const { avatar, id, name, roll_no } = item;
    return (
      <View
        key={item?.roll_no}
        style={{
          flexDirection: "row",
          backgroundColor: itemColor,
          borderWidth: itemBorder,
          borderColor: borderColor,
          paddingVertical: 4,
          paddingHorizontal: 8,
          marginEnd: 8,
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        <Image
          style={{
            width: 20,
            height: 20,
            borderRadius: 10,
            marginEnd: 8,
            backgroundColor: defaultImageBgColor,
          }}
          defaultSource={require("../assets/DefaultImage.jpg")}
        />
        <Text style={{ color: primaryText, overflow: "hidden" }}>
          {name + ", " + roll_no}
        </Text>
      </View>
    );
  };

  const renderStudent = (item, index) => {
    if (item === null) return;
    const { avatar, id, name, roll_no } = item;
    return (
      <View
        key={roll_no}
        style={{
          alignItems: "center",
          borderWidth: borderWidth,
          borderColor: borderColor,
          width: (width - 48) / 3,
          height: (width - 48) / 3,
          marginBottom: 8,
          marginEnd: 8,
          justifyContent: "center",
          borderRadius: 8,
        }}
      >
        <Image
          style={{ width: 48, height: 48, marginBottom: 8, borderRadius: 24 }}
          // source={{ uri: avatar }}
          defaultSource={require("../assets/DefaultImage.jpg")}
        />
        <Text
          style={{ fontFamily: "RHD-Medium", lineHeight: 21, fontSize: 14 }}
          numberOfLines={2}
        >
          {name}
        </Text>
        <Text style={{ marginTop: 4 }}>{roll_no}</Text>
      </View>
    );
  };

  const searchStudents = (searchText) => {
    setRefreshing(true);
    setSearchText(searchText);
    // Split the searchText by commas and trim each item
    const allSearchTerms = searchText.split(",").map((term) => term.trim());
    const searchTerms = allSearchTerms.filter((term) => term !== "");

    if (
      searchTerms.length === 0 ||
      (searchTerms.length === 1 && searchTerms[0] === "")
    ) {
      setSearchList(classInfoList);
      setRefreshing(false);
    } else {
      const filteredStudents = classInfoList.filter((student) => {
        const nameMatch = searchTerms.some((term) =>
          String(student.name)
            .toLowerCase()
            .includes(String(term).toLowerCase())
        );
        const rollNoMatch = searchTerms.includes(String(student.roll_no));
        return rollNoMatch || nameMatch;
      });
      setSearchList(filteredStudents);
      setRefreshing(false);
    }
  };

  const toggleModal = () => {
    setShowStudentDialog(false);
  };

  const renderClassDetails = () => {
    if (taskInfo === null)
      return <Text>Something went wrong, please try again.</Text>;
    const {
      class_id,
      day,
      end_hour,
      end_minute,
      location,
      start_hour,
      start_minute,
      subject_id,
      subject_info: {
        subject,
        teacher_id,
        teacher_info: { avatar, name },
      },
      class_info: { section, standard },
      title,
    } = taskInfo;
    return (
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <InformationView label={"Subject"} value={title} />
        <InformationView
          label={"Class"}
          value={standard + section + " Section"}
        />
        <InformationView
          label={"Period"}
          value={
            start_hour +
            ":" +
            start_minute +
            " - " +
            end_hour +
            ":" +
            end_minute
          }
        />
        <InformationView
          label={"Date"}
          value={"Today (" + formatDate(new Date().toISOString()) + ")"}
        />
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <BottomModal isVisible={showStudentDialog} onClose={toggleModal}>
        <View style={styles.searchView}>
          <Feather name="search" size={16} color={secondaryText} />
          <TextInput
            style={styles.searchInput}
            selectionColor={primaryColor}
            placeholder="Search Students by name or roll no"
            onChangeText={(search) => searchStudents(search)}
            value={searchText}
            autoCapitalize="none"
          />
          {searchText.length !== 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x" size={16} color={secondaryText} />
            </TouchableOpacity>
          )}
        </View>
        <ScreenHint>
          Select multiple students by entering their roll numbers separated by
          commas. Example: 12, 24, 32
        </ScreenHint>
        <View style={{ height: (height * 1) / 2 }}>
          <FlatList
            nestedScrollEnabled
            data={searchList}
            renderItem={({ item, index }) => renderStudent(item, index)}
            keyExtractor={(item) => item.roll_no.toString()}
            numColumns={3} // Number of columns per row
            contentContainerStyle={{
              marginVertical: 16,
              marginBottom: 16,
            }}
            refreshing={refreshing}
          />
        </View>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => {
            setAbsentList(searchList);
            toggleModal();
          }}
        >
          {loading && <ActivityIndicator size={36} color={"#fff"} />}
          {!loading && <Text style={styles.primaryText}>Add Absentees</Text>}
        </TouchableOpacity>
      </BottomModal>
      <ContentView
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "space-between" }}
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
                <Text style={styles.headerText}>Update Task</Text>
              </View>
              <Text style={styles.subText}>
                Fill out essential class details! Share topics covered, track
                attendance, and add remarks. Your input shapes a better learning
                experience! 📚✏️
              </Text>
            </View>
            <CollapsableHeader>{renderClassDetails()}</CollapsableHeader>
            <View>
              <View
                style={{
                  borderTopWidth: borderWidth,
                  borderColor: borderColor,
                  marginTop: 8,
                }}
              >
                <View style={styles.inputView}>
                  <Text style={styles.inputText}>Absentees</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowStudentDialog(true);
                    }}
                    style={{
                      marginVertical: 8,
                      overflow: "hidden",
                      borderRadius: 8,
                    }}
                  >
                    {absentList.length > 0 ? (
                      <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                        {absentList.map((searchItem, index) =>
                          renderUser(searchItem)
                        )}
                      </View>
                    ) : (
                      <ButtonItem>
                        <ButtonLabel>{"No Student Added"}</ButtonLabel>
                        <Feather
                          name={"chevron-right"}
                          size={20}
                          color={secondaryText}
                        />
                      </ButtonItem>
                    )}
                  </TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                  <Text style={styles.inputText}>Topic</Text>
                  <TouchableOpacity
                    onPress={() => {}}
                    style={{
                      marginVertical: 8,
                      overflow: "hidden",
                      borderRadius: 8,
                    }}
                  >
                    <ButtonItem>
                      <ButtonLabel>{"No Topic Selected"}</ButtonLabel>
                      <Feather
                        name={"chevron-right"}
                        size={20}
                        color={secondaryText}
                      />
                    </ButtonItem>
                  </TouchableOpacity>
                </View>
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
          </View>
          <View>
            <TouchableOpacity onPress={() => handleSubmit()}>
              <View style={styles.primaryButton}>
                {loading && <ActivityIndicator size={36} color={"#fff"} />}
                {!loading && (
                  <Text style={styles.primaryText}>Submit Details</Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
    width: width - 32,
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
});

export default React.memo(UpdateTaskScreen);
