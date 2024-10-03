import React, { useState, useMemo } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Container, ContentView, MenuItem, TitleHeader, TitleSubHeader, TitleView, ToolbarBorder } from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { convertDate, formatTime } from "../utils/DateUtils";
import { borderColor, itemBorder, itemColor, primaryColor, primaryText, secondaryText } from "../utils/Color";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import InAppNotification from "../utils/InAppNotification";

export default function ExamPortionScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const examDetails = route.params.examDetails;
  const subject = route.params.subject;
  const classDetails = route.params.classDetails;
  const [portion, setPortion] = useState(subject?.portion ?? "");
  const [loading, setLoading] = useState(false);

  // Check if the current user is allowed to edit the portion
  const access = supabase_api.shared.uid === subject.teacher_id || supabase_api.shared.uid === classDetails?.classteacher_id;

  // Memoize the formatted time values to avoid re-calculating on every render
  const formattedStartTime = useMemo(() => formatTime(subject?.start_time), [subject?.start_time]);
  const formattedEndTime = useMemo(() => formatTime(subject?.end_time), [subject?.end_time]);

  const handleSubmit = async () => {
    if(loading) return
    
    try{
      setLoading(true);
      const response = await supabase_api.shared.updateExamTimeTableInfo({portion:portion},examDetails?.id,subject?.subject_id)
      InAppNotification.shared.showSuccessNotification({title:"Successfully Updated Portion!"})
    }catch(error){
      ErrorLogger.shared.ShowError("ExamPortionScreen: updateExamTimeTableInfo: ",error)
    }finally{
      setLoading(false);

    }
  };

  const InformationView = ({ label, value }) => (
    <View style={styles.informationView}>
      <Text style={styles.informationLabel}>{label}</Text>
      <Text style={styles.informationValue}>{value}</Text>
    </View>
  );

  const renderSubjectDetails = () => (
    <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
      <InformationView label="Subject" value={subject?.subject} />
      <View style={styles.informationContainer}>
        <InformationView label="Date" value={convertDate(subject.exam_date)} />
        <InformationView label="Timing" value={`${formattedStartTime} to ${formattedEndTime}`} />
        <InformationView label="Marks" value={subject.marks} />
      </View>
    </View>
  );

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <TitleView>
          <TitleSubHeader>Exam Portion</TitleSubHeader>
          <TitleHeader>{examDetails?.title}</TitleHeader>
        </TitleView>
        <MenuItem onPress={() => {}}>
          <Feather name={"more-horizontal"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      <ContentView>
        <View style={{ flex: 1, flexDirection: "column", justifyContent: "space-between" }}>
          <View>
            {renderSubjectDetails()}
            <View style={{ marginHorizontal: 16 }}>
              <Text style={styles.informationLabel}>Portion</Text>
              <TextInput
                style={styles.textInput}
                numberOfLines={6}
                multiline
                placeholderTextColor={secondaryText}
                placeholder="Enter the portion details..."
                onChangeText={setPortion}
                value={portion}
                editable={access} // Conditionally editable based on access
              />
              {!access && (
                <Text style={styles.errorText}>
                  Only class teachers and subject teachers can edit the portion.
                </Text>
              )}
            </View>
          </View>
          {access && (
            <View style={styles.submitContainer}>
              <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                {!loading ? (
                  <Text style={styles.buttonText}>Update Portion</Text>
                ) : (
                  <ActivityIndicator color="#fff" size={24} />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "RHD-Medium",
    fontSize: 18,
    lineHeight: 24,
  },
  informationContainer: {
    flexDirection: "row",
    columnGap: 36,
    flexWrap: "wrap",
  },
  informationView: {
    paddingVertical: 8,
  },
  informationLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
  },
  informationValue: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
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
  errorText: {
    fontFamily: "RHD-Medium",
    color: "red",
    marginTop: 8,
  },
  buttonContainer: {
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  submitContainer: {
    marginBottom: 8,
    marginHorizontal: 8,
    paddingHorizontal: 16,
  },
  button: {
    marginVertical: 16,
    backgroundColor: primaryColor,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "RHD-Medium",
    color: "#FFF",
    fontSize: 16,
  },
});
