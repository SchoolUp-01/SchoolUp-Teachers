import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import supabase_api from "../backend/supabase_api";
import EmptyState from "./EmptyState";
import AttendanceItem from "./AttendanceItem";
import ErrorLogger from "../utils/ErrorLogger";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryColor,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { leave_applications_db } from "../utils/Constants";
import Teacher from "../state/TeacherManager";
import { supabase } from "../backend/supabaseClient";
import { AddLeaveRejectionRemark, LeaveInformationModal } from "./Modals";
import InAppNotification from "../utils/InAppNotification";

const TAG_OPTIONS = ["All", "Pending", "Approved", "Rejected"];

export default function LeaveList({}) {
  const limit = 5;
  const [leaveList, setLeaveList] = useState([]);
  const [lastVisible, setLastVisible] = useState(0);
  const [lastItem, setLastItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [showLeaveDetailsModal, setShowLeaveDetailsModal] = useState(false);
  const [showLeaveRemarkModal, setShowLeaveRemarkModal] = useState(false);
  const [selectedLeaveItem, setSelectedLeaveItem] = useState(null);

  // Use a ref to track ongoing fetch to prevent multiple simultaneous calls
  const fetchInProgressRef = useRef(false);

  const schoolId = Teacher.shared.getSchoolID();

  useEffect(() => {
    resetAndFetchLeaves();
  }, [searchText, selectedTag]);

  useEffect(() => {
    if (schoolId !== null) {
      const channels = realTimeListener();
      return () => {
        channels.unsubscribe();
      };
    }
  }, [schoolId]);

  const retrieveLeaves = useCallback(
    (isReset = false) => {
      // Prevent multiple simultaneous calls and check if already at end
      if (fetchInProgressRef.current || (lastItem && !isReset)) return;

      // Use refreshing for reset, loading for pagination
      if (isReset) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      fetchInProgressRef.current = true;

      supabase_api.shared
        .getLeaveApplication(
          isReset ? 0 : lastVisible,
          limit + lastVisible,
          searchText.trim(),
          selectedTag
        )
        .then((res) => {
          // Prevent duplicate items
          const uniqueNewItems = isReset
            ? res
            : res.filter(
                (newItem) =>
                  !leaveList.some(
                    (existingItem) => existingItem.id === newItem.id
                  )
              );

          setLeaveList((prev) =>
            isReset ? res : [...prev, ...uniqueNewItems]
          );
          setLastItem(uniqueNewItems.length < limit);
          setLastVisible((prev) => prev + uniqueNewItems.length);
        })
        .catch((error) => {
          ErrorLogger.shared.ShowError("LeaveList: retrieveLeaves: ", error);
        })
        .finally(() => {
          fetchInProgressRef.current = false;
          if (isReset) {
            setRefreshing(false);
          } else {
            setLoading(false);
          }
        });
    },
    [lastVisible, searchText, selectedTag, lastItem, leaveList]
  );

  const resetAndFetchLeaves = () => {
    setLastItem(false);
    setLeaveList([]);
    setLastVisible(0);
    retrieveLeaves(true);
  };

  // Simplified real-time listener and payload handling
  const realTimeListener = useCallback(() => {
    return supabase
      .channel("leave-applications-changes")
      .on(
        "postgres_changes",
        {
          event: '*',
          schema: "public",
          table: leave_applications_db,
          filter: `school_id=eq.${schoolId}`,
        },
        async (payload) => {
          const { eventType, new: newRecord, old: oldRecord } = payload;
          try {
            switch (eventType) {
              case "INSERT":
                const newLeave = await supabase_api.shared.getLeaveDetailsById(
                  newRecord?.id
                );
                console.log("newLeave:", newLeave);
                setLeaveList((prevList) => [newLeave, ...prevList]);
                break;

              case "UPDATE":
                const updatedLeave =
                  await supabase_api.shared.getLeaveDetailsById(newRecord?.id);
                setLeaveList((prevList) =>
                  prevList.map((item) =>
                    item.id === updatedLeave.id
                      ? { ...item, ...updatedLeave }
                      : item
                  )
                );
                break;

              case "DELETE":
                setLeaveList((prevList) =>
                  prevList.filter((item) => item.id !== oldRecord.id)
                );
                break;
            }
          } catch (error) {
            ErrorLogger.shared.ShowError(
              "LeaveList: realTimeListener: ",
              error
            );
          }
        }
      )
      .subscribe();
  }, [schoolId]);

  const onLeaveClicked = (item) => {
    setSelectedLeaveItem(item);
    setShowLeaveDetailsModal(true);
  };

  const onApprove = () => {
    supabase_api.shared
      .updateLeaveRequest(selectedLeaveItem?.id, "", true)
      .then(() => {
        supabase_api.shared.addPushNotifications({
          title: "Leave Request Update",
          description: "Leave Request Approved",
          user_id: selectedLeaveItem?.parent_id,
        });
        InAppNotification.shared.showSuccessNotification({
          title: "Leave Application Approved!",
        });
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("AttendanceItem: onApprove", error);
      })
      .finally(() => setShowLeaveDetailsModal(false));
  };

  const onOpenDeclineModal = (item=null) => {
    if(item)setSelectedLeaveItem(item)
    setShowLeaveDetailsModal(false);
    setShowLeaveRemarkModal(true);
  };

  const onDecline = (remark) => {
    supabase_api.shared
      .updateLeaveRequest(
        selectedLeaveItem?.id,
        remark.trim(),
        true,
        "Rejected"
      )
      .then(() => {
        supabase_api.shared.addPushNotifications({
          title: "Leave Request Update",
          description: "Leave Request Rejected",
          user_id: selectedLeaveItem?.parent_id,
        });
        InAppNotification.shared.showSuccessNotification({
          title: "Leave Application Rejected!",
        });
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("AttendanceItem: onDecline", error);
      })
      .finally(() => setShowLeaveRemarkModal(false));
  };

  const renderHeader = useCallback(
    () => (
      <View>
        <View style={styles.searchView}>
          <Feather name="search" size={16} color={secondaryText} />
          <TextInput
            style={styles.searchInput}
            selectionColor={primaryColor}
            placeholder="Search leave request"
            onChangeText={setSearchText}
            value={searchText}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x" size={16} color={secondaryText} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          contentContainerStyle={styles.tagScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {TAG_OPTIONS.map((tag) => (
            <OptionItem key={tag} item={tag} />
          ))}
        </ScrollView>
      </View>
    ),
    [searchText, selectedTag]
  );

  const OptionItem = React.memo(({ item }) => {
    const isSelected = item === selectedTag;
    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          { backgroundColor: isSelected ? primaryColor : itemColor },
        ]}
        onPress={() => setSelectedTag(item)}
      >
        <Text
          style={[
            styles.optionText,
            {
              color: isSelected ? "#fff" : primaryText,
              fontFamily: isSelected ? "RHD-Bold" : "RHD-Medium",
            },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  });

  const renderEmpty = () => {
    if (loading || refreshing) {
      // Show a loading indicator while fetching
      return (
        <View style={{ padding: 16, alignItems: "center" }}>
          <Text style={{ color: secondaryText }}>Loading...</Text>
        </View>
      );
    }

    if (!loading && leaveList.length === 0 && !refreshing) {
      // Show empty state only if not loading and no data
      return (
        <EmptyState
          title=""
          description={"You don't have any pending leave requests."}
          animation={require("../assets/animations/no_leave.json")}
        />
      );
    }

    return null; // Avoid rendering any placeholder if data is present
  };

  return (
    <View>
      <LeaveInformationModal
        isVisible={showLeaveDetailsModal}
        onClose={() => setShowLeaveDetailsModal(false)}
        onDecline={onOpenDeclineModal}
        leaveItem={selectedLeaveItem}
        onApprove={onApprove}
      />
      <AddLeaveRejectionRemark
        isVisible={showLeaveRemarkModal}
        onClose={() => setShowLeaveRemarkModal(false)}
        item={selectedLeaveItem}
        onDecline={onDecline}
      />
      {renderHeader()}
      <FlatList
        data={leaveList}
        renderItem={({ item }) => (
          <AttendanceItem
            item={item}
            onLeaveClicked={onLeaveClicked}
            tag={selectedTag}
            onDecline={onOpenDeclineModal}
          />
        )}
        keyExtractor={(item) => item.id?.toString()}
        horizontal={false}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmpty}
        onEndReached={() => retrieveLeaves()}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={resetAndFetchLeaves}
        removeClippedSubviews={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  optionText: {
    fontSize: 14,
    paddingHorizontal: 8,
  },
  optionItem: {
    marginEnd: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
  },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 12,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontFamily: "RHD-Medium",
    marginHorizontal: 16,
    fontSize: 16,
  },
  tagScroll: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 8,
    paddingEnd: 16,
  },
});
