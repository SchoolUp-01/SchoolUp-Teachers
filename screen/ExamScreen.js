import React from 'react'
import { ScrollView, StyleSheet, Text, View } from "react-native";
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
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  primaryColor,
  primaryColor_50,
  primaryText,
} from "../utils/Color";
import { useEffect, useState } from "react";
import supabase_api from "../backend/supabase_api";
import EmptyState from "../components/EmptyState";
import ErrorLogger from "../utils/ErrorLogger";
import ExamScreenShimmer from "../components/Shimmers/ExamScreenShimmer";

const ExamScreen = () => {
  const navigation = useNavigation();
  const [examDetail, setExamDetails] = useState(null);
  const [examTimeTable, setExamTimeTable] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    supabase_api.shared
      .getExamTimeTable()
      .then((res) => {
        setExamDetails(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("ExamScreen: getExamTimeTable: ", error);
      }).finally(()=>setLoading(false));

    return () => {};
  }, []);


  const MarksHeader = ({}) => {
    return (
      <View style={styles.row}>
        <View
          style={[
            styles.cell,
            { flex: 1, borderRightWidth: 1, borderColor: borderColor },
          ]}
        >
          <Text style={styles.headerText}>Timing</Text>
        </View>
        <View
          style={[
            styles.cell,
            { flex: 1, borderRightWidth: 1, borderColor: borderColor },
          ]}
        >
          <Text style={styles.headerText}>Subject</Text>
        </View>
        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.headerText}>Portion</Text>
        </View>
      </View>
    );
  };

  const MarksItem = ({ info, index }) => {
  if (info == null) return null;
    const { start_time, end_time, exam_date, portion, subject_info } = info;
    return (
      <View style={styles.row} key={index}>
        <View
          style={[
            styles.cell,
            { flex: 1, borderRightWidth: 1, borderColor: borderColor },
          ]}
        >
          <Text style={styles.rowText}>
            {start_time + " - " + end_time + "\n" + exam_date}
          </Text>
        </View>
        <View
          style={[
            styles.cell,
            { flex: 1, borderRightWidth: 1, borderColor: borderColor },
          ]}
        >
          <Text style={styles.rowText}>{subject_info?.subject}</Text>
        </View>
        <View style={[styles.cell, { flex: 2 }]}>
          <Text style={styles.rowText}>{portion}</Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (examDetail == null && !loading) {
      return (
        <EmptyState
          title="No Exams dates announced"
          description="No Data available at the moment, please check back later."
          animation={require("../assets/animations/no_exams.json")}
        />
      );
    }else if(loading){
      return (
        <ExamScreenShimmer />
      )
    } else {
      return (
        <View>
          <View style={styles.examView}>
            <View>
              <Text style={styles.examHeader}>{examDetail?.title}</Text>
              <Text style={styles.examSubHeader}>
                {examDetail?.start_date + " - " + examDetail?.end_date}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 8,
                borderRadius: 8,
                backgroundColor: primaryColor_50,
              }}
            >
              <Text style={{ color: primaryColor, fontFamily: "RHD-Medium" }}>
                {Student.shared.getMasterStudentSectionDetails()}
              </Text>
            </View>
          </View>
          <ScrollView>
            <View style={styles.container}>
              <MarksHeader />
              {examTimeTable &&
                examTimeTable.length > 0 &&
                examTimeTable.map((examInfo, index) => (
                  <MarksItem key={index} info={examInfo} />
                ))}
            </View>
          </ScrollView>
        </View>
      );
    }
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <TitleView>
          <TitleSubHeader>Exams</TitleSubHeader>
          <TitleHeader numberOfLines={1}>
            {Student.shared.getMasterStudentSchoolName()}
          </TitleHeader>
        </TitleView>
        <MenuItem onPress={() => {
          navigation.navigate("RaiseConcernScreen", {
            type: "Exams",
          });
        }}>
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      <ContentView>{renderContent()}</ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  examView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  examHeader: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    color: primaryText,
  },
  examSubHeader: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "RHD-Regular",
    color: primaryText,
  },
  container: {
    borderWidth: 1,
    borderColor: borderColor,
    borderBottomWidth: 0,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: borderColor,
  },
  cell: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  headerText: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    color: primaryText,
  },
  rowText: {
    fontFamily: "RHD-Medium",
    fontSize: 14,
    lineHeight: 21,
    color: primaryText,
    paddingHorizontal: 4,
  },
});

export default React.memo(ExamScreen)
