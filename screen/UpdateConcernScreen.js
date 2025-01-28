import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import Avatar from "../components/Avatar";
import IssueCommentList from "../components/IssueCommentList.tsx";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { formatDateWithTime } from "../utils/DateUtils";
import { getOrdinalSuffix } from "../utils/Number";
import supabase_api from "../backend/supabase_api";
import Teacher from "../state/TeacherManager";
import ErrorLogger from "../utils/ErrorLogger";
import InAppNotification from "../utils/InAppNotification";
import { AddConcernClosureRemark, InformationView } from "../components/Modals";
import { UserInformation } from "../components/InformationView";
import { primaryColor } from "../utils/Color";
import IssueResolvedCard from "../components/IssueResolveCard";
import { supabase } from "../backend/supabaseClient";
import { concern_info_db } from "../utils/Constants";

const UpdateConcernScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [taskInfo, setTaskInfo] = useState(route?.params?.item ?? null);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showClosureModal, setShowClosureModal] = useState(false);

  useEffect(() => {
    const updateTicketStatus = async () => {
      if (taskInfo?.status === "New" && taskInfo?.id) {
        try {
          await supabase_api.shared.updateSupportTicket({
            issueID: taskInfo.id,
            values: { status: "Open" },
          });
        } catch (error) {
          ErrorLogger.shared.ShowError(
            "UpdateConcernScreen: updateSupportTicket: ",
            error
          );
        }
      }
    };

     updateTicketStatus();
     if (taskInfo !== null) {
      const channels = realTimeListener();
      return () => {
        channels.unsubscribe();
      };
    }
  }, [taskInfo]);

 

  const realTimeListener = useCallback(() => {
    return supabase
      .channel("concern-report-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: concern_info_db,
          filter: `id=eq.${taskInfo?.id}`,
        },
        async (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          try {
            switch (eventType) {
              case "INSERT":
                const newConcern =
                  await supabase_api.shared.getConcernReportByID(newRecord?.id);
                  setTaskInfo(newConcern)
                break;

              case "UPDATE":
                const updatedConcern =
                  await supabase_api.shared.getConcernReportByID(newRecord?.id);
               setTaskInfo(updatedConcern)
                break;

              case "DELETE":
                navigation.goBack();
                break;
            }
          } catch (error) {
            ErrorLogger.shared.ShowError(
              "ConcernScreen: realTimeListener: ",
              error
            );
          }
        }
      )
      .subscribe();
  }, [taskInfo]);

  const onSubmit = async (message) => {
    try {
      const uid = await supabase_api.shared.uid;
      const issueID = taskInfo?.id;
      const result = await supabase_api.shared.updateSupportTicket({
        issueID,
        values: {
          remarks: message,
          status: "Closed",
          closed_by: uid,
          closed_on: new Date(),
        },
      });
      InAppNotification.shared.showSuccessNotification({
        title: "Concern Ticket closed successfully",
        description: "",
      });
    } catch (error) {
      ErrorLogger.shared.ShowError(
        "SupportRemarkModal: UpdateSupportTicket: ",
        error
      );
      InAppNotification.shared.showErrorNotification({
        title: "Something went wrong!",
        description: "Please try again later",
      });
    } finally {
      setShowClosureModal(false);
    }
  };

  const handleSubmit = useCallback(() => {
    if (!comment.trim()) return;

    setSubmitting(true);
    supabase_api.shared
      .addIssueComment({
        comment,
        issueID: taskInfo?.id,
        school_id: Teacher.shared.getSchoolID(),
      })
      .then(() => {
        console.log("Comment added successfully");
        setComment("");
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("Issue: addComment: ", error);
        InAppNotification.shared.showErrorNotification({
          title: "Something went wrong!",
          message: "Failed to add comment",
        });
      })
      .finally(() => setSubmitting(false));
  }, [comment, taskInfo?.id]);

  const renderComplaintDetails = useCallback(() => {
    if (!taskInfo) {
      return (
        <Text style={styles.errorText}>
          Something went wrong. Please try again.
        </Text>
      );
    }

    const {
      created_at,
      type,
      reason,
      parent_info: { name: parentName, avatar: parentAvatar },
      student_info: {
        name: studentName,
        avatar: studentAvatar,
        class_info: { section, standard },
      },
      status,
    } = taskInfo;

    return (
      <View>
        <View style={styles.header}>
          <Avatar
            width={48}
            height={48}
            user={{ name: studentName, avatar: studentAvatar }}
          />
          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{studentName}</Text>
            <Text style={styles.studentClass}>
              {`${getOrdinalSuffix(standard)} ${section}`}
            </Text>
          </View>
          <Text
            style={[styles.status, { backgroundColor: getStatusColor(status) }]}
          >
            {status}
          </Text>
        </View>
        <View style={styles.infoContainer}>
          <InformationView label="Type" value={type} />
          <InformationView label="Reason" value={reason} />
          <UserInformation
            title="Parent"
            name={parentName}
            avatar={parentAvatar}
          />
          <InformationView
            label="Created"
            value={formatDateWithTime(created_at)}
          />
        </View>
      </View>
    );
  }, [taskInfo]);

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <AddConcernClosureRemark
        isVisible={showClosureModal}
        item={taskInfo}
        onClose={() => setShowClosureModal(false)}
        onSubmit={onSubmit}
      />
      <ContentView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.flex}
          keyboardVerticalOffset={Platform.OS === "ios" ? 120 : 40}
        >
          <ToolbarBorder>
            <MenuItem onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={24} color="#000" />
            </MenuItem>
            <Title>Concern Report</Title>
            {taskInfo?.status !== "Closed" && (
              <TouchableOpacity
                style={{ alignSelf: "center", marginEnd: 16 }}
                onPress={() => setShowClosureModal(true)}
              >
                <Text style={styles.markAsSolved}>Mark as Solved</Text>
              </TouchableOpacity>
            )}
          </ToolbarBorder>
          <View style={styles.flex}>
            <View style={styles.detailsContainer}>
              {renderComplaintDetails()}
            </View>
            {taskInfo?.status === "Closed" && (
              <IssueResolvedCard
                remark={taskInfo?.remarks}
                closed_by={taskInfo?.closed_by}
              />
            )}
            <IssueCommentList id={taskInfo?.id} status={taskInfo?.status} />
            {taskInfo?.status !== "Closed" && (
              <View style={styles.addCommentSection}>
                <TextInput
                  style={styles.textarea}
                  placeholder="Write your comment here..."
                  multiline
                  onChangeText={setComment}
                  value={comment}
                />
                <TouchableOpacity
                  style={
                    comment.trim() ? styles.submitButton : styles.disabledButton
                  }
                  onPress={handleSubmit}
                  disabled={!comment.trim()}
                >
                  {submitting ? (
                    <ActivityIndicator size={20} color="#fff" />
                  ) : (
                    <Text style={styles.submitButtonText}>Submit</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </KeyboardAvoidingView>
      </ContentView>
    </Container>
  );
};

const getStatusColor = (status) => {
  switch (status) {
    case "New":
      return "#0000FF";
    case "Open":
      return "#008000";
    case "Closed":
      return "#800080";
    default:
      return "#808080";
  }
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1, justifyContent: "space-between" },
  header: { flexDirection: "row", marginVertical: 12, alignItems: "center" },
  studentInfo: { flex: 1, marginHorizontal: 16 },
  studentName: { fontSize: 16, fontWeight: "500" },
  studentClass: { fontSize: 14, color: "#666" },
  status: { padding: 4, borderRadius: 4, color: "#fff", fontWeight: "600" },
  infoContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 12,
    columnGap: 16,
  },
  detailsContainer: { marginHorizontal: 16 },
  addCommentSection: { marginVertical: 16, paddingHorizontal: 16 },
  textarea: {
    minHeight: 120,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: primaryColor,
    padding: 12,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: { color: "#fff", fontWeight: "600" },
  disabledButton: {
    backgroundColor: "#ccc",
    padding: 12,
    borderRadius: 4,

    alignItems: "center",
    justifyContent: "center",
  },
  markAsSolved: { color: primaryColor, fontSize: 16, fontWeight: "700" },
  errorText: { color: "red", textAlign: "center" },
});

export default React.memo(UpdateConcernScreen);
