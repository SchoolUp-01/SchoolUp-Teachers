import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Animated,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Container, ContentView } from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  primaryColor_50,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { convertDate } from "../utils/DateUtils";
import ExamClassList from "../components/ExamClassList";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import { Feather } from "@expo/vector-icons";

export default function ExamDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const examDetails = route.params.examDetails;
  const [loading, setLoading] = useState(true);
  const [classList, setClassList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [animationValue] = useState(new Animated.Value(1));

  useEffect(() => {
    setLoading(true);
    supabase_api.shared
      .getClassDetailsFromExam(examDetails?.id)
      .then((res) => {
        setClassList(res);
        if (res.length !== 0) setSelectedIndex(0);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ExamDetailsScreen: getClassDetailsFromExam: ",
          error
        );
      })
      .finally(() => setLoading(false));
  }, [examDetails]);

  const handleClassItemPress = (index) => {
    setSelectedIndex(index);

    // Add micro animation
    Animated.spring(animationValue, {
      toValue: 1.1,
      friction: 3,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(animationValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    });
  };

  const renderExamDetails = () => {
    return (
      <View style={styles.examDetailsContainer}>
        <Text style={styles.examTitle}>{examDetails?.title}</Text>
        <Text style={styles.examDate}>
          {convertDate(examDetails?.start_date) +
            " - " +
            convertDate(examDetails?.end_date)}
        </Text>
      </View>
    );
  };

  const ClassItem = ({ item, index }) => {
    if (!item) return null;

    const { standard, section } = item;
    const isSelected = index === selectedIndex;

    return (
      <TouchableOpacity
        style={[
          styles.classItem,
          isSelected && styles.classItemSelected,
          { transform: [{ scale: animationValue }] },
        ]}
        onPress={() => handleClassItemPress(index)}
      >
        <Text>{standard + section}</Text>
      </TouchableOpacity>
    );
  };

  const InformationView = ({ label, value }) => (
    <View style={styles.informationView}>
      <Text style={styles.informationLabel}>{label}</Text>
      <Text style={styles.informationValue}>{value}</Text>
    </View>
  );

  const renderClassDetails = useCallback(() => {
    if (!loading && classList.length > 0 && selectedIndex !== null) {
      const item = classList[selectedIndex];
      const matchedClass = examDetails?.class_data.find(
        (detail) => detail.class_id === item.class_id
      );
      console.log("Cal: ", matchedClass);
      return (
        <View style={styles.classDetailsContainer}>
          <View style={styles.informationContainer}>
            <InformationView label={"Status"} value={matchedClass.status} />
            <InformationView label={"Total Marks"} value={matchedClass.marks} />
            <InformationView label={"Subjects"} value={item.subjects?.length} />
          </View>
          <Text style={styles.subjectsTitle}>Subjects</Text>
          <View>
            {item.subjects.length === 0 ? (
              <Text>No subjects available</Text> // Optional: You can customize this
            ) : (
              <ScrollView>
                {item.subjects.map((subjectItem) => (
                  <View key={subjectItem.id} style={styles.subjectView}>
                    <View>
                      <Text style={styles.subjectName}>
                        {subjectItem.subject}
                      </Text>
                      <Text style={styles.subjectCode}>
                        {convertDate(subjectItem.exam_date)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        if (
                          examDetails?.status === "Upcoming" ||
                          examDetails?.status === "Setup Required" ||
                          examDetails?.status === "Active"
                        ) {
                          if (matchedClass?.status === "Active") {
                            navigation.navigate("ExamPortionScreen", {
                              subject: subjectItem,
                              examDetails: examDetails,
                              classDetails: item
                            });
                          }
                        }else if(examDetails?.status === "Evaluation In-Progress"){
                          if (matchedClass?.status !== "Setup required") {
                            navigation.navigate("UpdateReportsScreen", {
                              subject: subjectItem,
                              classDetails: item,
                              examDetails: examDetails
                            });
                          }                              
                        }
                      }}
                    >
                      <Feather
                        name="chevron-right"
                        size={20}
                        color={primaryText}
                      />
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      );
    }
    return null;
  }, [loading, classList, selectedIndex]);

  const renderClassList = () => {
    return (
      <View style={{ paddingHorizontal: 16, marginVertical: 8 }}>
        <FlatList
          data={classList}
          renderItem={({ item, index }) => (
            <ClassItem item={item} index={index} />
          )}
          horizontal
        />
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <BasicToolBar title={"Exam Details"} navigation={navigation} />
      {/* <ScrollView contentContainerStyle={styles.scrollViewContent}> */}
      {renderExamDetails()}
      <Text style={styles.classesTitle}>Classes</Text>
      {renderClassList()}
      {renderClassDetails()}
      {/* <ExamClassList exam_id={examDetails?.id} /> */}
      {/* </ScrollView> */}
    </Container>
  );
}

const styles = {
  scrollViewContent: {
    flexGrow: 1,
  },
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
    flexDirection: "row",
    borderWidth: borderWidth,
    borderColor: borderColor,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    marginEnd: 16,
    flexShrink: 1,
  },
  classItemSelected: {
    backgroundColor: primaryColor_50,
  },
  classDetailsContainer: {
    paddingHorizontal: 16,
  },
  informationContainer: {
    flexDirection: "row",
    gap: 36,
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
  subjectsTitle: {
    marginTop: 12,
    marginBottom: 8,
  },
  subjectView: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 4,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subjectName: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryText,
  },
  subjectCode: {
    fontFamily: "RHD-Medium",
    fontSize: 14,
    color: secondaryText,
  },
};
