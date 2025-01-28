import React, { useEffect, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import {
  Container,
  MenuItem,
  ScreenHint,
  Title,
  Toolbar,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  backgroundColor,
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_50,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { convertDate } from "../utils/DateUtils";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import { Feather } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import GradeBook from "../components/GradeBook";
import { getOrdinalSuffix } from "../utils/Number";
import ExamAnalysis from "../components/ExamAnalytics";

export default function ExamDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const examDetails = route.params.examDetails;
  const [loading, setLoading] = useState(true);
  const [classList, setClassList] = useState([]);
  const pagerRef = useRef();

  // Simplified state management
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);
  const [selectedClassId, setSelectedClassId] = useState(null);

  const onClassSelected = (class_id) => {
    setSelectedClassId(class_id);
    const data = examDetails.class_data.find(
      (item) => item.class_id === class_id
    );
    setSelectedClassDetails(data);
  };

  useEffect(() => {
    setLoading(true);
    supabase_api.shared
      .getExamsClassList(examDetails?.id, 0, 1000)
      .then((res) => {
        console.log(res);
        setClassList(res);
        onClassSelected(res[0]?.class_id);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ExamDetailsScreen: getClassDetailsFromExam: ",
          error
        );
      })
      .finally(() => setLoading(false));
  }, [examDetails]);

  const handlePageChange = (position) => {
    setCurrentPage(position);
    pagerRef.current?.setPage(position);
  };

  const TabItem = ({ index, label }) => {
    const isActive = currentPage === index;

    return (
      <TouchableOpacity
        style={{ alignSelf: "center", justifyContent: "center" }}
        onPress={() => handlePageChange(index)}
      >
        <View
          style={[
            styles.tabItem,
            {
              borderColor: isActive ? primaryColor : borderColor,
              borderBottomWidth: isActive ? 1 : 0,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: isActive ? primaryColor : primaryText,
                fontFamily: isActive ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderTabs = () => (
    <View style={styles.tabView}>
      <TabItem index={0} label="Overview" />
      {classList.map((classDetail, index) => (
        <TabItem
          key={classDetail.class_id}
          index={index + 1}
          label={`${getOrdinalSuffix(classDetail?.standard)} ${
            classDetail?.section
          }`}
        />
      ))}
    </View>
  );

  const renderExamOverview = () => (
    <View style={styles.examDetailsContainer}>
      <Text style={styles.examTitle}>{examDetails?.title}</Text>
      <Text style={styles.examDate}>
        {convertDate(examDetails?.start_date) +
          " - " +
          convertDate(examDetails?.end_date)}
      </Text>
    </View>
  );

  const renderClasses = () => (
    <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
      <FlatList
        data={classList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={
              selectedClassId == item.class_id
                ? styles.activeClassItem
                : styles.classItem
            }
            onPress={() => {
              onClassSelected(item.class_id);
            }}
          >
            <Text>{item.standard + item.section}</Text>
          </TouchableOpacity>
        )}
        horizontal
      />
    </View>
  );

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <Toolbar>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryText} />
        </MenuItem>
        <Title>Exam Details</Title>
        <MenuItem>
          <Feather name="more-horizontal" size={20} color={primaryText} />
        </MenuItem>
      </Toolbar>

      {examDetails?.status == "Completed" && renderTabs()}

      {examDetails?.status == "Setup Required" && (
        <View>
          {renderExamOverview()}
                <Text style={styles.classesTitle}>Classes</Text>
          
          {renderClasses()}
          <ScreenHint>
          Exam setup can only be completed on the Admin Dashboard. 
          Please log in to the dashboard on your desktop or tablet to proceed.
          </ScreenHint>
        </View>
      )}

      {examDetails?.status == "Completed" && (
        <PagerView
          ref={pagerRef}
          style={{ flex: 1 }}
          initialPage={0}
          onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        >
          <View key="overview">
            {/* Overview Page */}
            {renderExamOverview()}
                  <Text style={styles.classesTitle}>Classes</Text>
            
            {renderClasses()}
            <ExamAnalysis classData={selectedClassDetails} />
          </View>

          {/* Class Pages */}
          {classList.map((classDetail) => (
            <View key={classDetail.class_id}>
              <GradeBook
                examId={examDetails?.id}
                classId={classDetail.class_id}
                classData={examDetails?.class_data}
              />
            </View>
          ))}
        </PagerView>
      )}
    </Container>
  );
}

const styles = {
  // ... (keeping existing styles)
  examDetailsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
    marginBottom: 4,
  },
  examTitle: {
    fontFamily: "RHD-Medium",
    fontSize: 18,
    lineHeight: 24,
  },
  examDate: {
    fontFamily: "RHD-Regular",
    fontSize: 14,
    color: secondaryText,
    marginTop: 4,
  },
  classesTitle: {
    marginTop: 8,
    marginBottom: 4,
    fontFamily: "RHD-Regular",
    fontSize: 16,
    paddingHorizontal: 16,
  },
  classItem: {
    borderWidth: borderWidth,
    borderColor: borderColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginEnd: 16,
    flexShrink: 1,
  },
  activeClassItem: {
    borderWidth: borderWidth,
    borderColor: primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginEnd: 16,
    flexShrink: 1,
    backgroundColor: primaryColor_50,
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
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tabView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
};
