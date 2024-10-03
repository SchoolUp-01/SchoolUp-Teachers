import React, { useEffect, useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor_50,
  secondaryText,
} from "../utils/Color";
import supabase_api from "../backend/supabase_api";
import EmptyState from "./EmptyState";
import ErrorLogger from "../utils/ErrorLogger";
import { convertDate } from "../utils/DateUtils";

const { width } = Dimensions.get("screen");

export default function ExamClassList({ exam_id }) {
  const [loading, setLoading] = useState(true);
  const [classList, setClassList] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [animationValue] = useState(new Animated.Value(1));

  useEffect(() => {
    setLoading(true);
    supabase_api.shared
      .getClassDetailsFromExam(exam_id)
      .then((res) => setClassList(res))
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ClassList: getClassDetailsFromExam: ",
          error
        );
      })
      .finally(() => setLoading(false));
  }, [exam_id]);

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

  const renderEmpty = () => {
    if (!loading && classList.length === 0) {
      return (
        <EmptyState
          title="No Information available"
          description="No Class available at the moment, please check back later."
          animation={require("../assets/animations/no_data.json")}
        />
      );
    }
    return null;
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
      return (
        <View style={styles.classDetailsContainer}>
          <View style={styles.informationContainer}>
            <InformationView label={"Status"} value={"Active"} />
            <InformationView label={"Total Marks"} value={"250"} />
            <InformationView label={"Subjects"} value={item.subjects?.length} />
          </View>
          <Text style={styles.subjectsTitle}>Subjects</Text>
          {/* <View>
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
                    <TouchableOpacity>
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
          </View> */}
        </View>
      );
    }
    return null;
  }, [loading, classList, selectedIndex]);

  return (
    // <ScrollView contentContainerStyle={styles.scrollViewContent}>
    <View style={styles.flatListContainer}>
      {classList.length === 0 ? (
        renderEmpty()
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {classList.map((item, index) => (
            <ClassItem key={item.id} item={item} index={index} />
          ))}
        </ScrollView>
      )}
      {selectedIndex !== null && renderClassDetails()}
    </View>
    // </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {},
  flatListContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    flexWrap: "wrap",
    gap: 24,
  },
  informationView: {
    justifyContent: "space-between",
    paddingVertical: 8,
    flexDirection: "row",
  },
  informationLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    flex: 1,
  },
  informationValue: {
    textAlign: "right",
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
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
  flatListContentContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    backgroundColor: "red",
    flexShrink: 1,
  },
});
