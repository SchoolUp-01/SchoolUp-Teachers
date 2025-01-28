import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import Avatar from "./Avatar";
import { InformationView } from "./Modals";
import { UserInformation } from "./InformationView";
import supabase_api from "../backend/supabase_api";
import InAppNotification from "../utils/InAppNotification";
import ErrorLogger from "../utils/ErrorLogger";
import { convertDate, formatDate } from "../utils/DateUtils";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_50,
  secondaryText,
} from "../utils/Color";

const statusColors = {
  Rejected: "#FF6347", // Tomato Red
  Approved: "#00b104", // Lime Green
  Pending: "#FFAC00", // Amber
};

export default function AttendanceItem({
  item,
  tag,
  onLeaveClicked,
  onDecline = null,
}) {
  const [loading, setLoading] = useState(false);

  const onApprove = () => {
    setLoading(true);
    supabase_api.shared
      .updateLeaveRequest(item?.id, "", true)
      .then(() => {
        supabase_api.shared.addPushNotifications({
          title: "Leave Request Update",
          description: "Leave Request Approved",
          user_id: item?.parent_id,
        });
        InAppNotification.shared.showSuccessNotification({
          title: "Leave Application Approved!",
        });
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("AttendanceItem: onApprove", error);
      })
      .finally(() => setLoading(false));
  };

  const {
    start_date,
    end_date,
    reason,
    status,
    student_info: {
      avatar,
      class_info: { section, standard },
      name: student_name,
    },
    parent_info: { name: parent_name },
  } = item;

  const getDate = () =>
    start_date === end_date
      ? formatDate(start_date)
      : `${formatDate(start_date)} - ${formatDate(end_date)}`;

  const renderStatusTag = () => (
    <View
      style={[
        styles.statusTag,
        {
          backgroundColor:
            tag !== "All" ? primaryColor_50 : `${statusColors[status]}2a`,
        },
      ]}
    >
      <Text
        style={[
          styles.statusText,
          { color: tag !== "All" ? primaryColor : statusColors[status] },
        ]}
      >
        {tag === "All" ? status : `${standard} ${section} section`}
      </Text>
    </View>
  );

  const renderButtons = () => {
    if (tag === "Pending")
      return (
        <View style={styles.buttonView}>
          <TouchableOpacity onPress={onApprove} style={styles.primaryButton}>
            {loading ? (
              <ActivityIndicator size={16} color="#fff" />
            ) : (
              <Text style={styles.primaryButtonText}>Approve</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onDecline(item);
            }}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      );
  };

  const renderApprovalDetails = () => {
    if (tag === "Approved") {
      return (
        <View style={styles.detailsRow}>
          <UserInformation
            avatar={item?.team_info?.avatar}
            name={item?.team_info?.name}
            title="Approved By"
          />
          <InformationView
            label="Approved on"
            value={convertDate(item?.approved_on)}
          />
        </View>
      );
    }
    if (tag === "Rejected") {
      return (
        <View style={[styles.detailsRow, styles.wrapContent]}>
          {item?.remark && (
            <InformationView label="Remark" value={item?.remark} />
          )}
          <UserInformation
            avatar={item?.team_info?.avatar}
            name={item?.team_info?.name}
            title="Rejected By"
          />
          <InformationView
            label="Rejected on"
            value={convertDate(item?.approved_on)}
          />
        </View>
      );
    }
    return null;
  };

  if(tag !== 'All' && status !== tag) return null;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        onLeaveClicked(item);
      }}
    >
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <Avatar height={48} width={48} user={item?.student_info} />
          <View style={styles.headerInfo}>
            <Text style={styles.studentName}>
              {student_name}{" "}
              {tag === "All" && (
                <Text style={styles.classInfo}>
                  ({standard}
                  {section})
                </Text>
              )}
            </Text>
            <Text style={styles.parentName}>{parent_name}</Text>
          </View>
          {renderStatusTag()}
        </View>

        {/* Body Section */}
        <InformationView label="Leave Duration" value={getDate()} />
        {reason && <InformationView label="Reason" value={reason} />}
        {renderButtons()}
        {renderApprovalDetails()}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 8,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerInfo: {
    flex: 1,
    marginHorizontal: 16,
  },
  studentName: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
  },
  classInfo: {
    color: secondaryText,
  },
  parentName: {
    fontFamily: "RHD-Medium",
    fontSize: 14,
    lineHeight: 21,
    color: secondaryText,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "RHD-Medium",
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 12,
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
  primaryButtonText: {
    fontFamily: "RHD-Bold",
    color: primaryColor_50,
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
  },
  secondaryButtonText: {
    fontFamily: "RHD-Medium",
  },
  detailsRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  wrapContent: {
    flexWrap: "wrap",
    gap: 8,
  },
});
