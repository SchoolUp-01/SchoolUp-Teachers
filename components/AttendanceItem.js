import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_50,
  primaryColor_800,
  secondaryText,
} from "../utils/Color";
import { Months } from "../utils/Months";
import { formatDate } from "../utils/DateUtils";
import { InformationView } from "./Modals";
import supabase_api from "../backend/supabase_api";
import InAppNotification from "../utils/InAppNotification";
import ErrorLogger from "../utils/ErrorLogger";
import { useState } from "react";

export default function AttendanceItem({ item }) {
  const [loading, setLoading] = useState(false);

  const onApprove = () => {
    setLoading(true);
    supabase_api.shared
      .updateLeaveRequest(item?.id, "", true)
      .then(() => {
        InAppNotification.shared.showSuccessNotification({
          title: "Leave Application Approved!",
          description: "",
        });
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("ApplyLeaveScreen: handleSubmit: ", error);
      })
      .finally(() => setLoading(false));
  };

  const {
    end_date,
    reason,
    start_date,
    student_info: {
      avatar,
      class_info: { section, standard },
      name: student_name,
    },
    type,
  } = item;

  const getDate = () => {
    if (start_date === end_date) {
      return formatDate(start_date);
    }
    return formatDate(start_date) + " - " + formatDate(end_date);
  };

  return (
    <View
      style={{ paddingHorizontal: 16, marginVertical: 12, paddingVertical: 4 }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            borderWidth: borderWidth,
            borderColor: borderColor,
          }}
          source={{ uri: avatar }}
        />
        <View style={{ flex: 1, marginHorizontal: 16 }}>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              fontSize: 16,
              lineHeight: 24,
            }}
          >
            {student_name}
          </Text>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              fontSize: 14,
              lineHeight: 21,
              color: secondaryText,
            }}
          >
            {getDate()}
          </Text>
        </View>
        <View
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: primaryColor_50,
            borderRadius: 8,
          }}
        >
          <Text
            style={{
              fontSize: 14,
              lineHeight: 21,
              fontFamily: "RHD-Medium",
              color: primaryColor,
            }}
          >
            {standard + section + " section"}
          </Text>
        </View>
      </View>
      {reason !== null && (
        <Text
          style={{
            marginTop: 8,
            marginBottom: 16,
            fontFamily: "RHD-Medium",
            fontSize: 14,
            lineHeight: 21,
          }}
        >
          {type} leave:{" "}
          <Text>Please approve my daughter leave for the summer break</Text>
        </Text>
      )}
      <View style={styles.buttonView}>
        <TouchableOpacity
          onPress={() => {
            onApprove();
          }}
          style={styles.primaryButton}
        >
          {loading ? (
            <ActivityIndicator size={16} color={"#fff"} />
          ) : (
            <Text style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}>
              Approve
            </Text>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={{}} style={styles.secondaryButton}>
          <Text style={{ fontFamily: "RHD-Medium" }}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonView: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 8,
    marginStart: 8,
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: primaryColor,
    borderRadius: 8,
    marginEnd: 8,
  },
});
