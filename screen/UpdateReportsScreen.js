import React, { useState, useEffect, useRef } from "react";

import {
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
  Image,
  FlatList,
  Dimensions,
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
  secondaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import BottomModal, { InformationView } from "../components/Modals";
import InAppNotification from "../utils/InAppNotification";
import { formatDate } from "../utils/DateUtils";
import StudentAcademicReportItem from "../components/StudentAcademicReportItem";
const { width, height } = new Dimensions.get("screen");
const UpdateReportsScreen = () => {
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
  const flatListRef = useRef(null);

  useEffect(() => {
    supabase_api.shared
      .getClassChildrenInfo(taskInfo?.subject_info?.class_id, 0, 20)
      .then((res) => {
        setClassInfoList(res);
        setSearchList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "UpdateTaskScreen: getClassChildrenInfo: ",
          error
        );
      });

    return () => {};
  }, []);

  // Refs for TextInput items
  const textInputRefs = useRef([]);

  const handleFocusNextInput = (index) => {
    console.log("Text",textInputRefs)
    if (textInputRefs.current[index + 1]) {
      textInputRefs.current[index + 1].focus();
    }
  };

  const scrollToTop = (index) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index: index });
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.itemContainer}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              marginEnd: 16,
              borderWidth: borderWidth,
              borderColor: borderColor,
            }}
            // source={{ uri: avatar }}
            defaultSource={require("../assets/DefaultImage.jpg")}
          />
          <View style={{ alignSelf: "center" }}>
            <Text style={styles.itemLabel}>{item.name}</Text>
            <Text style={[styles.subLabel]}>Roll no: {item?.roll_no}</Text>
          </View>
        </View>
        <TextInput
          ref={inputRefs.current[index]}
          style={styles.input}
          placeholder={`Enter mark here`}
          keyboardType="numeric"
          onSubmitEditing={() => handleFocusNextInput(index)}
          placeholderTextColor={secondaryText}
        />
        {/* <TextInput
          // ref={inputRefs.current[index]}
          style={[styles.input,{height:120}]}
          placeholder={`Add a review`}
          keyboardType="default"
          // multiline
          onSubmitEditing={() => handleFocusNextInput(index)}
          placeholderTextColor={secondaryText}
        /> */}
      </View>
    );
  };

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

  const renderStudent = (item) => {
    if (item === null) return;
    const { name, roll_no } = item;
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

  const renderExamDetails = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 8,
        }}
      >
        <InformationView label={"Exam"} value={taskInfo?.exam_info?.title} />
        <InformationView
          label={"Subject"}
          value={taskInfo?.subject_info?.subject}
        />
        {/* <InformationView
          label={"Class"}
          value={
            taskInfo?.subject_info?.class_info?.standard +
            " " +
            taskInfo?.subject_info?.class_info?.section
          }
        /> */}
        <InformationView
          label={"Exam Date"}
          value={formatDate(taskInfo?.exam_date)}
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
          <Text style={styles.headerText}>Update Report</Text>
          <TouchableOpacity
            style={{
              marginEnd: 16,
              alignSelf: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              navigation.navigate("AddMemoriesScreen");
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontFamily: "RHD-Bold",
                color: primaryColor,
              }}
            >
              Save Report
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subText}>
          Fill out academic marks for diverse subjects to shape a successful
          learning journey📚✏️
        </Text>
        {renderExamDetails()}
      </View>
      <ContentView>
        {/* <CollapsableHeader>{renderClassDetails()}</CollapsableHeader> */}
        <View>
          <FlatList
            ref={flatListRef}
            contentContainerStyle={{ paddingVertical: 16 }}
            data={classInfoList}
            renderItem={({ item, index }) => (
              <StudentAcademicReportItem
                item={item}
                index={index}
                ref={textInputRefs.current[index]}
                handleNext={handleFocusNextInput}
              />
            )}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
          />
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
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerText: {
    fontFamily: "RHD-Medium",
    fontSize: 20,
    lineHeight: 30,
    flex: 1,
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
    height: 48,
    fontSize: 16,
    color: primaryText,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: "RHD-Medium",
    backgroundColor: itemColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
    marginTop: 12,
    textAlignVertical: "center",
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

  itemContainer: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  itemLabel: {
    fontSize: 16,
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    lineHeight: 24,
  },
  subLabel: {
    fontSize: 14,
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    lineHeight: 21,
    color: secondaryText,
  },
});

export default React.memo(UpdateReportsScreen);
