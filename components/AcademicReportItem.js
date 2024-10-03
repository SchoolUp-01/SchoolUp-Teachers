import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { borderColor, borderWidth, primaryColor, primaryText } from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import { convertDate } from "../utils/DateUtils";
import { Feather } from "@expo/vector-icons";
import ErrorLogger from "../utils/ErrorLogger";
import { ItemLabel } from "./Label";
import supabase_api from "../backend/supabase_api";
const statusColors = {
  "Setup Required": "#FF6347", // Tomato Red
  Upcoming: "#FFA500", // Orange
  Active: "#32CD32", // Lime Green
  "Evaluation In-Progress": "#1E90FF", // Dodger Blue
  Completed: "#6A5ACD", // Slate Blue
};
export default function AcademicReportItem({ item }) {
  const navigation = useNavigation();
  if (item === null) return;

  const getActiveClassesCount = (class_data, status) =>
    class_data?.filter((item) => item.status !== status)?.length;

  const updateExamStatus = async (status, exam_id) => {
    try {
      const response = await supabase_api.shared.updateExam(
        {
          status,
        },
        exam_id
      );
    } catch (error) {
      ErrorLogger.shared.ShowError("ExamsList: updateExamStatus: ", error);
    }
  };
  
  const getStatusLabelAndColor = (
    startDate,
    endDate,
    status,
    class_data,
    exam_id
  ) => {
    const today = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    let label = status;
    if (status === "Setup Required") {
      const setUpCount = getActiveClassesCount(class_data,"Active");
      console.log("Active: ",setUpCount)
      if (setUpCount == 0) {
        label = "Upcoming";
        updateExamStatus(label, exam_id);
      } else {
        label = "Setup Required";
      }
    } else if (status === "Upcoming") {
      if (today >= start && today <= end) {
        label = "Active";
        updateExamStatus(label, exam_id);
      }
    } else if (status === "Active") {
      if (today > end) {
        label = "Evaluation In-Progress";
        updateExamStatus(label, exam_id);
      }
    } else if (status === "Evaluation In-Progress") {
      const setUpCount = getActiveClassesCount(class_data,"Completed");
      if (setUpCount == 0) {
        label = "Completed";
        updateExamStatus(label, exam_id);
      }else{
        label = 'Evaluation In-Progress';
      }
    } else if (status === "Completed") {
      label = "Completed";
    }
    return <ItemLabel color={statusColors[label]} label={label} />;
  };


  const {
    id,title,note,start_date,end_date,status,class_data
  } = item;
  return (
    <TouchableOpacity
      onPress={() => {
        navigation.navigate("ExamDetailsScreen", {
          examDetails: item,
        })
      }}
    >
      <View style={styles.leaveView}>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            marginLeft: 12,
          }}
        >
          <Text style={styles.leaveType}>{title}</Text>

          <Text style={styles.leaveReason} numberOfLines={1}>
           {convertDate(start_date)+ " - "+convertDate(end_date)}
          </Text>
        </View>
       {getStatusLabelAndColor(start_date,end_date,status,class_data,id)}
        <View style={{ alignSelf: "center" }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => //UpdateReportsScreen
              navigation.navigate("ExamDetailsScreen", {
                examDetails: item,
              })
            }
          >
            <Feather name="chevron-right" size={24} color={primaryText}/>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  leaveView: {
    marginTop: 8,
    flexDirection: "row",
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 8,
    justifyContent: "space-between",
    alignItems: "center",
    height: 56,
  },
  leaveType: { fontFamily: "RHD-Medium", fontSize: 16, lineHeight: 24 },
  leaveReason: {
    fontFamily: "RHD-Regular",
    fontSize: 14,
    lineHeight: 18,
    marginTop: 4,
  },
  leaveSubView: {
    flexDirection: "row",
    marginStart: 16,
    justifyContent: "space-between",
  },
  date: {
    fontFamily: "RHD-Bold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#f74c06",
  },
  dateView: {
    flexDirection: "column",
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,

    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f74c061a",
  },
  addButton: {
    borderRadius: 24,
    paddingVertical: 8,
    alignItems: "center",
    marginHorizontal: 16,
  },
  addButtonLabel: {
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontFamily: "RHD-Bold",
  },
});
