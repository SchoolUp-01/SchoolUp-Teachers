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
import { formatDate } from "../utils/DateUtils";
import { ApprovedLabel, PendingLabel } from "./Label";

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

export const LeaveInformationModal = ({
  isVisible,
  onClose,
  onConfirm,
  leaveItem,
}) => {
  if (leaveItem == null) return;
  const {
    approved,
    end_date: endDate,
    created_at: createdAt,
    parent_id: parentId,
    parent_info: { name: parentName },
    reason,
    start_date: startDate,
    approved_on: approvedOn,
    teacher_info: { id: teacherId, name: teacherName },
    type,
  } = leaveItem;
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
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <InformationView label={"Type"} value={type} />
              {approved ? (
                <ApprovedLabel />
              ) : (
                <PendingLabel
                  label={type == "Sick Leave" ? "Informed" : "Pending"}
                />
              )}
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <InformationView label={"From"} value={formatDate(startDate)} />
              <InformationView label={"To"} value={formatDate(endDate)} />
            </View>
            <InformationView label={"Reason"} value={reason} />

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <InformationView label={"Approver"} value={teacherName} />
              <InformationView
                label={"Submitted on"}
                value={formatDate(createdAt)}
              />
            </View>
          </View>
          <View style={styles.buttonView}>
            <TouchableOpacity onPress={onClose} style={styles.secondaryButton}>
              <Text style={{ fontFamily: "RHD-Medium" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={styles.primaryButton}>
              <Text style={{ fontFamily: "RHD-Bold", color: primaryColor_50 }}>
                Remove
              </Text>
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
  if(item===null) return;
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
      teacher_info: { avatar, name },
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

export const ConfirmDeleteDialog = ({ isVisible, onClose, onConfirm,type }) => {
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
            {"Are you sure you want to delete this " + type + "?\nThis action cannot be undone."}
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
              style={[styles.primaryButton,{backgroundColor:"#e03737"}]}
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
    marginHorizontal: 8,
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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default BottomModal;
