import {
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Animated,
  ActivityIndicator,
  Platform,
  TextInput,
} from "react-native";
import {
  backgroundColor,
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_50,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";
const { width, height } = new Dimensions.get("screen");
import { Feather } from "@expo/vector-icons";
import { useRef, useEffect, useState } from "react";
import supabase_api from "../backend/supabase_api";
import { formatDate, isDateGreaterThanToday } from "../utils/DateUtils";
import {
  ApprovedLabel,
  DeclinedLabel,
  InformedLabel,
  PendingLabel,
} from "./Label";
import { UserInformation } from "./InformationView";

const modalOptions = Platform.select({
  android: {
    presentationStyle: "overFullScreen",
    statusBarTranslucent: true,
    modalPresentationIOS: "overFullScreen",
    backgroundColor: "transparent", // Set your desired navigation bar color here
  },
  ios: {
    presentationStyle: "overFullScreen",
    modalPresentationStyle: "overFullScreen",
  },
});

export const InformationView = ({ label, value }) => {
  return (
    <View style={styles.informationView}>
      <Text style={styles.informationLabel}>{label}</Text>
      <Text style={styles.informationValue}>{value}</Text>
    </View>
  );
};

const isLeaveOverDue = (approved, type, start_date) => {
  let autoApproved = false;
  let today = new Date();
  if (approved === null && type === "General" && new Date(start_date) < today) {
    autoApproved = true;
  }
  return autoApproved;
};

const renderLabel = (status) => {
  // if (autoApproved) return <ApprovedLabel label={"Approved"} />;
  // if (approved === null)
  //   if (type === "Sick Leave") return <InformedLabel label={"Informed"} />;
  //   else return <PendingLabel label={"Pending"} />;
  if (status === "Approved") {
    return <ApprovedLabel label={status} />;
  } else if (status === "Rejected") {
    return <DeclinedLabel label={status} />;
  } else if (status === "Pending") {
    return <PendingLabel label={status} />;
  }
};

const getDate = (start_date, end_date) =>
  start_date === end_date
    ? formatDate(start_date)
    : `${formatDate(start_date)} - ${formatDate(end_date)}`;

export const LeaveInformationModal = ({
  isVisible,
  onClose,
  onConfirm,
  leaveItem,
  onApprove = null,
  onDecline = null,
}) => {
  if (leaveItem == null) return;
  const {
    approved,
    status,
    end_date: endDate,
    created_at: createdAt,
    parent_id: parentId,
    parent_info: { name: parentName, avatar: parentAvatar },
    reason = "",
    remark,
    start_date: startDate,
    approved_on: approvedOn,
    team_info: { id: teacherId, name: teacherName, avatar: teacherAvatar },
    type,
    student_info: {
      avatar,
      class_info: { section, standard },
      name: student_name,
    },
  } = leaveItem;
  const isAutoApproved = isLeaveOverDue(approved, type, startDate);
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      {...modalOptions}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackgroundView}>
          <View style={styles.modalHeaderView}>
            <Text style={styles.modalHeaderText}>Leave Information</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={primaryText} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginVertical: 16,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <UserInformation
                avatar={leaveItem?.student_info?.avatar}
                name={leaveItem?.student_info?.name}
                title="Student"
              />
              <InformationView label={"Class"} value={standard + section} />
              {renderLabel(status)}
            </View>
            <View style={{ flexDirection: "row", gap: 36 }}>
              <InformationView
                label={"Leave Duration"}
                value={getDate(startDate, endDate)}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 16,
              }}
            >
              {
                <InformationView
                  label={"Reason"}
                  value={reason == "" ? "No Reason" : reason}
                />
              }
            </View>

            <View style={{ flexDirection: "row", gap: 36 }}>
              <UserInformation
                avatar={parentAvatar}
                name={parentName}
                title="Parent"
              />
              <InformationView
                label={"Submitted on"}
                value={formatDate(createdAt)}
              />
            </View>

            {status !== "Pending" && (
              <View
                style={{
                  flexDirection: "row",
                  columnGap: 36,
                  flexWrap: "wrap",
                }}
              >
                {remark && <InformationView label={"Remark"} value={remark} />}

                <UserInformation
                  title={status + " by"}
                  name={isAutoApproved ? "Auto Approved" : teacherName}
                  avatar={isAutoApproved ? "" : teacherAvatar}
                />
                <InformationView
                  label={status + " on"}
                  value={formatDate(approvedOn)}
                />
              </View>
            )}
          </View>
          {status === "Pending" && (
            <View style={styles.buttonView}>
              <TouchableOpacity
                onPress={onApprove}
                style={styles.primaryButton}
              >
                {loading ? (
                  <ActivityIndicator color={primaryColor_50} size={20} />
                ) : (
                  <Text
                    style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}
                  >
                    Approve
                  </Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={onDecline}
                style={styles.secondaryButton}
              >
                <Text style={{ fontFamily: "RHD-Medium" }}>Decline</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

export const AddLeaveRejectionRemark = ({
  isVisible,
  onClose,
  onConfirm,
  item,
  onDecline,
}) => {
  const [loading, setLoading] = useState(false);
  const [reminder, setReminder] = useState("");

  if (item === null) return;
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      {...modalOptions}
      style={{ zIndex: 1000 }}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackgroundView}>
          <View style={[styles.modalHeaderView]}>
            <Text style={styles.modalHeaderText}>Leave Remark</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={primaryText} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 16,
            }}
          >
            <UserInformation
              avatar={item?.student_info?.avatar}
              name={item?.student_info?.name}
              title="Student"
            />
            <InformationView
              label={"Duration"}
              value={getDate(item?.start_date, item?.end_date)}
            />
          </View>
          <View
            style={{
              margin: 16,
              borderWidth: borderWidth,
              borderColor: borderColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignItems: "flex-start",
              borderRadius: 4,
            }}
          >
            <TextInput
              style={{
                minHeight: 120,
                textAlignVertical: "top",
                fontFamily: "RHD-Medium",
              }}
              multiline
              autoFocus
              placeholder="Enter Remark "
              placeholderTextColor={borderColor ?? underlayColor}
              value={reminder}
              onChangeText={(text) => setReminder(text)}
              onSubmitEditing={() => onConfirm(reminder)}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={{ fontFamily: "RHD-Medium" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                onDecline(reminder);
              }}
              style={styles.primaryButton}
            >
              {loading ? (
                <ActivityIndicator size={20} color={"#fff"} />
              ) : (
                <Text
                  style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}
                >
                  Decline Request
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const AddConcernClosureRemark = ({
  isVisible,
  onClose,
  item,
  onSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [reminder, setReminder] = useState("");

  if (item === null) return;
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      {...modalOptions}
      style={{ zIndex: 1000 }}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackgroundView}>
          <View style={[styles.modalHeaderView]}>
            <Text style={styles.modalHeaderText}>Concern Remark</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={primaryText} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              margin: 16,
              borderWidth: borderWidth,
              borderColor: borderColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignItems: "flex-start",
              borderRadius: 4,
            }}
          >
            <TextInput
              style={{
                minHeight: 120,
                textAlignVertical: "top",
                fontFamily: "RHD-Medium",
                fontSize:16
              }}
              multiline
              autoFocus
              placeholder="Enter Remark for Closure"
              placeholderTextColor={borderColor ?? underlayColor}
              value={reminder}
              onChangeText={(text) => setReminder(text)}
              onSubmitEditing={() => onSubmit(reminder)}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={{ fontFamily: "RHD-Medium" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                onSubmit(reminder);
              }}
              style={styles.primaryButton}
            >
              {loading ? (
                <ActivityIndicator size={20} color={"#fff"} />
              ) : (
                <Text
                  style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}
                >
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const AddNotificationModal = ({
  isVisible,
  onClose,
  onConfirm,
  item,
  reminderValue,
}) => {
  const [loading, setLoading] = useState(false);
  const [reminder, setReminder] = useState("");
  useEffect(() => {
    setLoading(false);
    setReminder(reminderValue);
    return () => {};
  }, [isVisible]);
  if (item === null) return;
  const {
    class_id,
    day,
    end_hour,
    end_minute,
    id,
    location,
    start_hour,
    start_minute,
    subject_id,
    subject_info: {
      subject,
      teacher_id,
      team_info: { avatar, name },
    },
    class_info: { section, standard },
    title,
  } = item;
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      {...modalOptions}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackgroundView}>
          <View style={[styles.modalHeaderView]}>
            <Text style={styles.modalHeaderText}>Subject Notification</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={primaryText} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginHorizontal: 16,
              marginTop: 8,
            }}
          >
            <InformationView label={"Subject"} value={subject} />
            <InformationView
              label={"Class"}
              value={standard + section + " Section"}
            />
            <InformationView
              label={"Time"}
              value={
                start_hour +
                ":" +
                start_minute +
                " - " +
                end_hour +
                ":" +
                end_minute
              }
            />
          </View>
          <View
            style={{
              margin: 16,
              borderWidth: borderWidth,
              borderColor: borderColor,
              paddingHorizontal: 8,
              paddingVertical: 4,
              alignItems: "flex-start",
              borderRadius: 4,
            }}
          >
            <TextInput
              style={{
                minHeight: 120,
                textAlignVertical: "top",
                fontFamily: "RHD-Medium",
              }}
              multiline
              autoFocus
              placeholder="Reminder message here... (e.g., 'Don't forget your books tomorrow!')"
              placeholderTextColor={borderColor ?? underlayColor}
              value={reminder}
              onChangeText={(text) => setReminder(text)}
              onSubmitEditing={() => onConfirm(reminder)}
            />
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={{ fontFamily: "RHD-Medium" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onConfirm(reminder)}
              style={styles.primaryButton}
            >
              <Text style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}>
                Notify
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const RemarkInformationModal = ({
  isVisible,
  onClose,
  onConfirm,
  info,
}) => {
  if (info === null) return;
  const {
    marks_scored,
    remarks,
    subject_id,
    subject_info: {
      subject,
      teacher_info: { avatar, id: teacher_id, name: teacher_name },
    },
    total_marks,
  } = info;
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      {...modalOptions}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackgroundView}>
          <View style={styles.modalHeaderView}>
            <Text style={styles.modalHeaderText}>Subject Remark</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={primaryText} />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginVertical: 16,
              paddingHorizontal: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <InformationView label={"Subject"} value={subject} />
              <InformationView label={"Teacher"} value={teacher_name} />
              <InformationView label={"Marks Scored"} value={marks_scored} />
            </View>
            <InformationView label={"Remark"} value={remarks} />
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              paddingHorizontal: 16,
              marginBottom: 12,
            }}
          >
            <TouchableOpacity onPress={onConfirm} style={styles.primaryButton}>
              <Text style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}>
                Chat with teacher
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const RemoveChildDialog = ({
  isVisible,
  onClose,
  onConfirm,
  childName,
}) => {
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      {...modalOptions}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackgroundView}>
          <View style={styles.modalHeaderView}>
            <Text style={styles.modalHeaderText}>Confirm Action</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={primaryText} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalContentText}>
            {"Are you sure you want to remove '" + childName + "' ?"}
          </Text>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={{ fontFamily: "RHD-Medium" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.primaryButton}>
              <Text
                style={{ fontFamily: "RHD-Medium", color: primaryColor_50 }}
              >
                Remove
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const ConfirmSignOutDialog = ({ isVisible, onClose, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackgroundView}>
          <View style={styles.modalHeaderView}>
            <Text style={styles.modalHeaderText}>Confirm Sign out</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={primaryText} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalContentText}>
            {"Are you sure you want to sign out?"}
          </Text>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={{ fontFamily: "RHD-Medium" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                onConfirm();
              }}
              style={styles.primaryButton}
            >
              {loading ? (
                <ActivityIndicator size={24} color={primaryColor_50} />
              ) : (
                <Text
                  style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}
                >
                  Sign out
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const ConfirmDeleteDialog = ({
  isVisible,
  onClose,
  onConfirm,
  type,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalView}>
        <View style={styles.modalBackgroundView}>
          <View style={styles.modalHeaderView}>
            <Text style={styles.modalHeaderText}>Delete Confirmation</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={primaryText} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalContentText}>
            {"Are you sure you want to delete this " +
              type +
              "?\nThis action cannot be undone."}
          </Text>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={{ fontFamily: "RHD-Medium" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setLoading(true);
                onConfirm();
              }}
              style={[styles.primaryButton, { backgroundColor: "#e03737" }]}
            >
              {loading ? (
                <ActivityIndicator size={24} color={primaryColor_50} />
              ) : (
                <Text
                  style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}
                >
                  Delete
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const SimpleHeader = () => (
  <View
    style={{
      backgroundColor: backgroundColor,
      width: "100%",
      height: 36,
      justifyContent: "center",
      alignItems: "center",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    }}
  >
    <View
      style={{
        width: 56,
        height: 4,
        backgroundColor: underlayColor,
        borderRadius: 2,
      }}
    ></View>
  </View>
);

export const BottomModal = ({ isVisible, onClose, children }) => {
  const slideAnimation = useRef(new Animated.Value(500)).current;

  useEffect(() => {
    if (isVisible) {
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible, slideAnimation]);

  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: 700,
      duration: 500,
      useNativeDriver: true,
    }).start(() => onClose());
  };

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={closeModal}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={closeModal}
      >
        <View />
      </TouchableOpacity>
      <Animated.View
        style={[
          styles.modalContent,
          { transform: [{ translateY: slideAnimation }] },
        ]}
      >
        <SimpleHeader />
        {children}
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    alignItems: "center",
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "lightgray",
    borderRadius: 5,
  },
  informationView: {
    justifyContent: "space-between",
    paddingVertical: 8,
    flexShrink: 1,
  },
  informationLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    textAlign: "left",
  },
  informationValue: {
    textAlign: "right",
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
    flexShrink: 1,
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 16,
  },
  modalBackgroundView: {
    backgroundColor: "#fff",
    width: width - 32,
    borderRadius: 8,
  },
  modalHeaderView: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 52,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  modalHeaderText: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    fontWeight: "500",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: borderWidth,
    borderColor: borderColor,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: primaryColor,
    marginHorizontal: 8,
    borderRadius: 8,
  },
  modalContentText: {
    marginVertical: 16,
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    paddingHorizontal: 16,
  },
  buttonView: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default BottomModal;
