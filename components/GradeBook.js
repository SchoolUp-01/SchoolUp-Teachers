import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import ErrorLogger from "../utils/ErrorLogger";
import { Feather } from "@expo/vector-icons";
import { borderColor, borderWidth } from "../utils/Color";
import supabase_api from "../backend/supabase_api";

const COLUMN_WIDTH = 120;
const FIRST_COLUMN_WIDTH = 160;
const TOTAL_COLUMN_WIDTH = 100;
const ACTIONS_COLUMN_WIDTH = 100;
const ROW_HEIGHT = 60;

const GradeBook = ({
  classId = null,
  examId = null,
  classData = null,
  examDetails = null,
  onEdit = () => {},
}) => {
  const headerScrollRef = useRef(null);
  const contentScrollRef = useRef(null);

  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!!classId && !!examId) fetchGrades();
  }, [classId, examId]);

  const fetchGrades = async () => {
    if (!!classId && !loading) {
      setLoading(true);
      try {
        const response = await supabase_api.shared.fetchClassGrade(
          examId,
          classId
        );
        setGrades(response);
        setLoading(false);
      } catch (error) {
        ErrorLogger.shared.ShowError("GradeBook: fetchGrades:", error);
      }
    }
  };

  const handleDownloadReport = async (student) => {
    // Implement report download logic
    console.log("Downloading report for student:", student);
    // const downloadPDF = useGeneratePDF(classData,student,examDetails);
    // await downloadPDF();
  };

  const calculateTotal = (studentScores) => {
    return Object.values(studentScores).reduce(
      (sum, subject) => sum + subject.marks,
      0
    );
  };

  const calculateMaxTotal = (subjects) => {
    return subjects.reduce((sum, subject) => sum + subject.totalMarks, 0);
  };

  if (!classData) return null;

  const subjects = Object.entries(
    classData[0].exam_metadata.subject_wise_averages
  ).map(([id, subject]) => ({
    id,
    name: subject.subject_name,
    totalMarks: subject.max_marks,
    average: subject.average,
  }));

  const maxTotal = calculateMaxTotal(subjects);

  const students = grades.map((student) => ({
    id: student.id,
    name: student.name,
    rollNo: student.roll_no,
    initials: student.name
      .split(" ")
      .map((n) => n[0])
      .join(""),
    subjectScores: subjects.reduce((acc, subject) => {
      acc[subject.id] = {
        marks: student.subject_info[subject.id]?.marks || 0,
        feedback: student.subject_info[subject.id]?.feedback || "",
      };
      return acc;
    }, {}),
  }));

  const onHeaderScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    contentScrollRef.current?.scrollTo({ x: scrollX, animated: false });
  };

  const onContentScroll = (event) => {
    const scrollX = event.nativeEvent.contentOffset.x;
    headerScrollRef.current?.scrollTo({ x: scrollX, animated: false });
  };

  const renderGradeHeaders = () => (
    <View style={styles.headerRow}>
      {subjects.map((subject) => (
        <View
          key={subject.id}
          style={[styles.headerCell, { width: COLUMN_WIDTH }]}
        >
          <Text style={styles.headerText}>{subject.name}</Text>
          <View style={styles.subHeader}>
            <Text style={styles.subHeaderText}>
              Marks: {subject.totalMarks}
            </Text>
            <Text style={styles.subHeaderText}>
              Avg: {Number(subject.average).toFixed(1)}
            </Text>
          </View>
          <View style={styles.columnLabels}>
            <Text style={styles.columnLabel}>M</Text>
            <Text style={styles.columnLabel}>G</Text>
            <Text style={styles.columnLabel}>F</Text>
          </View>
        </View>
      ))}
      <View style={[styles.headerCell, { width: TOTAL_COLUMN_WIDTH }]}>
        <Text style={styles.headerText}>Total</Text>
        <Text style={styles.subHeaderText}>/{maxTotal}</Text>
      </View>
      <View style={[styles.headerCell, { width: ACTIONS_COLUMN_WIDTH }]}>
        <Text style={styles.headerText}>Actions</Text>
      </View>
    </View>
  );

  const renderGradeRow = (student) => (
    <View style={styles.dataRow}>
      {subjects.map((subject) => (
        <View key={subject.id} style={[styles.cell, { width: COLUMN_WIDTH }]}>
          <View style={styles.subjectCell}>
            <View style={styles.marksSection}>
              <Text style={styles.markText}>
                {student.subjectScores[subject.id].marks}
              </Text>
            </View>
            <View style={styles.gradeSection}>
              <Text style={styles.gradeText}>-</Text>
            </View>
            <View style={styles.feedbackSection}>
              {student.subjectScores[subject.id].feedback ? (
                <Text style={styles.feedbackText}>
                  {student.subjectScores[subject.id].feedback}
                </Text>
              ) : (
                <TouchableOpacity onPress={() => {}}>
                  <Feather name="file-text" size={14} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ))}
      <View style={[styles.cell, { width: TOTAL_COLUMN_WIDTH }]}>
        <Text style={styles.totalText}>
          {calculateTotal(student.subjectScores)}
        </Text>
        <Text style={styles.percentageText}>
          {((calculateTotal(student.subjectScores) / maxTotal) * 100).toFixed(
            1
          )}
          %
        </Text>
      </View>
      <View style={[styles.cell, { width: ACTIONS_COLUMN_WIDTH }]}>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onEdit(student.id)}
          >
            <Feather name="edit" size={16} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDownloadReport(student)}
          >
            <Feather name="download" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Fixed header */}
        <View style={[styles.firstColumnHeader, { width: FIRST_COLUMN_WIDTH }]}>
          <Text style={styles.headerText}>Student name</Text>
        </View>

        {/* Scrollable header */}
        <ScrollView
          ref={headerScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onScroll={onHeaderScroll}
          scrollEventThrottle={16}
          style={styles.scrollHeader}
        >
          {renderGradeHeaders()}
        </ScrollView>
      </View>

      <ScrollView style={styles.bodyContainer}>
        <View style={styles.body}>
          {/* Fixed first column */}
          <View style={[styles.firstColumn, { width: FIRST_COLUMN_WIDTH }]}>
            {students.map((student) => (
              <View key={student.id} style={styles.firstColumnCell}>
                <View style={styles.initialsContainer}>
                  <Text style={styles.initials}>{student.initials}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName}>{student.name}</Text>
                  <Text style={styles.studentId}>
                    Roll No: {student.rollNo}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Scrollable content */}
          <ScrollView
            ref={contentScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            onScroll={onContentScroll}
            scrollEventThrottle={16}
          >
            <View>
              {students.map((student) => (
                <View key={student.id}>{renderGradeRow(student)}</View>
              ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    marginBottom: 24,
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  bodyContainer: {},
  body: {
    flexDirection: "row",
  },
  scrollHeader: {},
  firstColumnHeader: {
    padding: 10,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  headerRow: {
    flexDirection: "row",
  },
  headerCell: {
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    paddingTop: 16,
  },
  columnLabels: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    marginTop: 4,
  },
  columnLabel: {
    fontSize: 12,
    fontWeight: "500",
    color: "#666",
    flex: 1,
    textAlign: "center",
    paddingVertical: 8,
    borderEndWidth: borderWidth,
    borderEndColor: borderColor,
  },
  firstColumn: {
    backgroundColor: "#fff",
  },
  firstColumnCell: {
    height: ROW_HEIGHT,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 14,
  },
  subHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    columnGap: 8,
    flexWrap: "wrap",
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  subHeaderText: {
    fontSize: 12,
    color: "#666",
  },
  initialsContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  initials: {
    fontSize: 14,
    fontWeight: "500",
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: "500",
  },
  studentId: {
    fontSize: 12,
    color: "#666",
  },
  dataRow: {
    flexDirection: "row",
  },
  subjectCell: {
    flexDirection: "row",
    width: "100%",
    height: "100%",
    borderRightWidth: 0,
  },
  marksSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  gradeSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
  },
  feedbackSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  markText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  gradeText: {
    fontSize: 14,
    color: "#000",
  },
  feedbackText: {
    fontSize: 12,
    color: "#000",
    textAlign: "center",
  },
  cell: {
    height: ROW_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    borderRightWidth: 1,
    borderRightColor: "#e0e0e0",
    padding: 0,
  },
  commentText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    flex: 1,
    borderEndWidth: borderWidth,
    borderColor: borderColor,
  },
  totalText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2196F3",
  },
  percentageText: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 4,
    backgroundColor: "#f5f5f5",
  },
});

export default GradeBook;
