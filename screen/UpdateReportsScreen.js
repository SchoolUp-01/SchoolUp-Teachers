import React, { useState, useEffect, useRef } from "react";
import { Container, ContentView } from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { borderColor, borderWidth, primaryColor, primaryText } from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import { InformationView } from "../components/Modals";
import StudentAcademicReportItem from "../components/StudentAcademicReportItem";
import InAppNotification from "../utils/InAppNotification";

const UpdateReportsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [taskInfo, setTaskInfo] = useState(route?.params?.item ?? null); // Storing report data
  const [loading, setLoading] = useState(false);
  const [classInfoList, setClassInfoList] = useState([]);
  const [searchList, setSearchList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [invalidIndexes, setInvalidIndexes] = useState([]); // Track indexes with invalid marks

  const flatListRef = useRef(null);
  const subjectInfo = route.params.subject;
  const classInfo = route.params.classDetails;
  const examDetails = route.params.examDetails;

  useEffect(() => {
    supabase_api.shared
      .getClassChildrenInfo(classInfo.class_id, 0, 3)
      .then((res) => {
        setClassInfoList(res);
        setSearchList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("UpdateTaskScreen: getClassChildrenInfo: ", error);
      });

    return () => {};
  }, []);

  const onSaveReport = async () => {
    if (uploading) return;
    setUploading(true);
    try {
      if (validateMarks()) {
        // Save the report logic here
      } else {
        InAppNotification.shared.showErrorNotification({title:invalidIndexes?.length+ " Error(s)",description:"Please fix these errors and try again."})
      }
    } catch (error) {
      ErrorLogger.shared.ShowError("onSaveReport: ", error);
    } finally {
      setUploading(false);
    }
  };

  // Validate marks and track invalid indexes
  const validateMarks = () => {
    const invalidIndexesArray = [];
    classInfoList.forEach((item, index) => {
      console.log("ClassInfo: ",item)
      const marks = parseFloat(item.marks);
      console.log("marks: ",marks)
      if (isNaN(marks) || marks < -1 || marks > subjectInfo.marks) {
        invalidIndexesArray.push(index); // Collect invalid indexes
      }
    });
    setInvalidIndexes(invalidIndexesArray); // Update state with invalid indexes
    return invalidIndexesArray.length === 0; // Return true if no invalid marks
  };

  // Refs for TextInput items
  const textInputRefs = useRef([]);

  const handleFocusNextInput = (index) => {
    if (textInputRefs.current[index + 1]) {
      textInputRefs.current[index + 1].focus();
    }
  };

  // Callback function to handle updates in student marks and remarks
  const handleStudentReportUpdate = (student_id, marks, remarks) => {
    const updatedTaskInfo = classInfoList.map((item) => {
      if (item.id === student_id) {
        return { ...item, marks, remarks }; // Updating the marks and remarks for the student
      }
      return item; // Keep the rest of the classInfoList unchanged
    });
    console.log("UpdatedClassList: ",updatedTaskInfo)
    setClassInfoList(updatedTaskInfo); // Update the classInfoList state
  };

  const renderExamDetails = () => {
    return (
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
        <InformationView label={"Exam"} value={examDetails.title} />
        <InformationView label={"Class"} value={classInfo?.standard + classInfo?.section} />
        <InformationView label={"Subject"} value={subjectInfo.subject} />
        <InformationView label={"Marks"} value={subjectInfo.marks} />
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <View style={styles.toolbarView}>
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather style={{ marginEnd: 16 }} name="arrow-left" color={primaryText} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Update Report</Text>
          <TouchableOpacity style={{ marginEnd: 16, alignSelf: "center", justifyContent: "center" }} onPress={onSaveReport}>
            <Text style={{ fontSize: 16, fontFamily: "RHD-Bold", color: primaryColor }}>Save Report</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.subText}>To mark a student as absent, please enter '-1' in the marks field for the respective subject or exam.</Text>
        {renderExamDetails()}
      </View>
      <ContentView>
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
                onReportUpdate={handleStudentReportUpdate}
                maxMarks={subjectInfo?.marks}
                error={invalidIndexes.includes(index)} // Pass error prop to indicate invalid marks
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
});

export default React.memo(UpdateReportsScreen);
