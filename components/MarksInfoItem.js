import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_300,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import CircularProgress from "react-native-circular-progress-indicator";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";

const MarksInfoItem = ({ index, info,onRemark }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [marksInfo, setMarksInfo] = useState(info);
  const [loading, setLoading] = useState(true);
  const [subjectMarksList, setSubjectMarksList] = useState([]);
  const [height] = useState(new Animated.Value(0));

  useEffect(() => {
    supabase_api.shared
      .getStudentReportInfoDetails(marksInfo?.exam_id)
      .then((res) => {
        setSubjectMarksList(res);
        setLoading(false);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "MarksInfoItem: getStudentReportInfoDetails: ",
          error
        );
      });

    return () => {};
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    Animated.timing(height, {
      toValue: isCollapsed ? 56 * 2 + 52 * 6 : 0,
      duration: 350,
      useNativeDriver: false,
    }).start();
  };

  const MarksHeader = ({}) => {
    return (
      <View style={styles.markHeaderView}>
        <Text style={styles.headerText}>Subject</Text>
        <Text
          style={[
            styles.headerText,
            {
              textAlign: "right",
            },
          ]}
        >
          Total Marks
        </Text>
        <Text
          style={[
            styles.headerText,
            {
              textAlign: "right",
            },
          ]}
        >
          Marks Scored
        </Text>
      </View>
    );
  };

  const MarksItem = ({ index, info }) => {
    return (
      <View key={index} style={styles.markItemView}>
        <TouchableOpacity
        disabled={info?.remarks === ""}
          onPress={() => {
           onRemark(info)
          }}
          style={{
            flex: 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.marksItemText}>
              {info?.subject_info?.subject}
            </Text>
            {info?.remarks !== "" && (
              <Feather name="clipboard" size={16} color={primaryText} />
            )}
          </View>
        </TouchableOpacity>
        <Text
          style={[
            styles.marksItemText,
            {
              flex:1,
              textAlign: "right",
            },
          ]}
        >
          {info?.total_marks}
        </Text>
        <Text
          style={[
            styles.marksItemText,
            {
              flex:1,
              textAlign: "right",
            },
          ]}
        >
          {info?.marks_scored}
        </Text>
      </View>
    );
  };

  const MarksFooter = ({}) => {
    return (
      <View style={styles.markFooterView}>
        <Text style={styles.markFooterHeader}>Total Marks</Text>
        <Text
          style={[
            styles.markFooterHeader,
            {
              textAlign: "right",
              marginEnd:12,
            },
          ]}
        >
          {info?.exam_info?.total_marks}
        </Text>
        <Text
          style={[
            styles.markFooterHeader,
            {
              textAlign: "right",
            },
          ]}
        >
          {info?.marks_scored}
        </Text>
      </View>
    );
  };

  const renderSubjectMarksView = () => {
    if (loading) {
      return (
        <View>
          <ActivityIndicator
            color={primaryColor}
            size={24}
            style={{ alignSelf: "center" }}
          />
        </View>
      );
    } else {
      return (
        <>
          <MarksHeader />
          {subjectMarksList &&
            subjectMarksList.length > 0 &&
            subjectMarksList.map((subjectInfo, index) => (
              <MarksItem index={index} info={subjectInfo} />
            ))}
          <MarksFooter />
        </>
      );
    }
  };

  return (
    <View key={index} style={styles.container}>
      <View
        style={{
          borderRadius: 8,
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: isCollapsed ? "#fff" : primaryColor,
          borderBottomLeftRadius: !isCollapsed ? 0 : 8,
          borderBottomRightRadius: !isCollapsed ? 0 : 8,
        }}
      >
        <View>
          <Text
            style={[
              styles.examHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {info?.exam_info?.title}
          </Text>
          <Text
            style={[
              styles.examSubHeader,
              { color: isCollapsed ? primaryText : "#fff" },
            ]}
          >
            {info?.exam_info?.start_date + " - " + info?.exam_info?.end_date}
          </Text>
        </View>
        <View style={styles.remarkView}>
          <Text
            style={[
              styles.remarkText,
              {
                color: isCollapsed ? primaryText : "#fff",
              },
            ]}
          >
            {info?.remarks_count}
          </Text>
          <Feather
            style={{ alignSelf: "center", marginEnd: 8 }}
            name="clipboard"
            size={16}
            color={isCollapsed ? primaryText : "#fff"}
          />

          <View style={{ marginHorizontal: 16 }}>
            <CircularProgress
              value={(info.marks_scored / info.exam_info.total_marks) * 100}
              radius={20}
              duration={100}
              progressValueColor={isCollapsed ? primaryText : primaryColor_50}
              maxValue={100}
              valueSuffix={"%"}
              activeStrokeWidth={4}
              inActiveStrokeWidth={4}
              activeStrokeColor={
                isCollapsed ? primaryColor_300 : primaryColor_50
              }
              inActiveStrokeColor={
                isCollapsed ? primaryColor_50 : primaryColor_300
              }
            />
          </View>
          <TouchableOpacity onPress={() => toggleCollapse()}>
            <Feather
              name={isCollapsed ? "chevron-right" : "chevron-down"}
              size={24}
              color={isCollapsed ? primaryText : "#fff"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View style={[styles.content, { height: height }]}>
        {!isCollapsed && <>{renderSubjectMarksView()}</>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,

    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "lightblue",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  contentText: {
    color: "black",
    fontSize: 16,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "center",
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
  remarkView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  remarkText: {
    alignSelf: "center",
    textAlignVertical: "center",

    fontFamily: "RHD-Bold",
    fontSize: 16,
    marginEnd: 4,
  },
  markHeaderView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    paddingVertical: 12,
    backgroundColor: primaryColor_50,
    borderBottomWidth: borderWidth,
    borderColor: primaryColor_800,
    height: 56,
  },
  headerText: {
    flex: 1,
    fontFamily: "RHD-Bold",
    fontSize: 14,
    lineHeight: 21,
    color: primaryColor_800,
  },
  markItemView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    paddingVertical: 8,
    height: 52,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  marksItemText: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    marginEnd: 8,
  },
  markFooterView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    alignItems: "center",
    paddingVertical: 12,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    height: 56,
    overflow: "hidden",
  },
  markFooterHeader: {
    flex: 1,
    fontFamily: "RHD-Bold",
    fontSize: 14,
    lineHeight: 21,
    color: primaryColor_800,
  },
});

export default MarksInfoItem;
