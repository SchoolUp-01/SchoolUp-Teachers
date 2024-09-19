import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  VirtualizedList,
  TouchableHighlight,
  Image,
  LayoutAnimation,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  TitleHeader,
  TitleSubHeader,
  TitleView,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import moment from "moment";

import { useNavigation, useRoute } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import StudentDetailsTab from "../components/TeachersDetailsTab";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import InAppNotification from "../utils/InAppNotification";
import { message_info_db } from "../utils/Constants";
import { supabase } from "../backend/supabaseClient";

function ParentsCommunicationScreen(props) {
  let messageSubscription = null;
  const navigation = useNavigation();
  const route = useRoute();
  const [teachersInfo, setTeachersInfo] = useState(
    route?.params?.teacherInfo ?? null
  );
  const [parentInfo, setParentInfo] = useState(
    route?.params?.parentInfo ?? null
  );
  const [studentInfo, setStudentInfo] = useState(
    route?.params?.studentInfo ?? null
  );
  const [conversationID, setConversationID] = useState(
    route?.params?.conversationID ?? null
  );
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    LayoutAnimation.easeInEaseOut();
    supabase_api.shared
      .getConversationID(parentInfo?.id)
      .then((res) => {
        setConversationID(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ParentsCommunicationScreen: getConversationID: ",
          error
        );
      });
    return () => {};
  }, []);

  useEffect(() => {
    if (conversationID !== null) {
      getMessagesFromSupabase();
      startMessageSubscription();
    }
    return () => {
      if (messageSubscription !== null)
        supabase.realtime.channel("message-channel").unsubscribe();
    };
  }, [conversationID]);

  const getMessagesFromSupabase = async () => {
    supabase_api.shared
      .getMessagesFromConversationID(conversationID, 0, 20)
      .then((res) => {
        setMessageList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ParentsCommunicationScreen: getMessagesFromSupabase: ",
          error
        );
      });
  };

  const startMessageSubscription = () => {
    messageSubscription = supabase
      .channel("message-channel")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: message_info_db,
          filter: "chat_id=eq." + conversationID,
        },
        (payload) => {
          handleRealTimeChanges(payload);
        }
      )
      .subscribe();
  };

  handleRealTimeChanges = (payload) => {
    const { eventType, new: newItem, old } = payload;

    switch (eventType) {
      case "INSERT":
        // Add the new message to the message list
        setMessageList((prevList) => [newItem, ...prevList]);
        break;
      case "UPDATE":
        // Update the particular item in the message list
        setMessageList((prevList) =>
          prevList.map((item) => (item.id === newItem.id ? newItem : item))
        );
        break;
      case "DELETE":
        // Remove the item from the message list
        setMessageList((prevList) =>
          prevList.filter((item) => item.id !== old.id)
        );
        break;
      default:
        break;
    }
  };

  handleSend = () => {
    let sendMessage = message.trim();
    if (sendMessage !== "") {
      setSending(true);
      supabase_api.shared
        .addTeacherMessage(conversationID, parentInfo?.id, sendMessage)
        .then((res) => {
          setConversationID(res);
          setMessage("");
        })
        .catch((error) => {
          InAppNotification.shared.showErrorNotification({
            title: "Something went wrong!",
            description: "Error code: " + error?.code,
          });
          ErrorLogger.shared.ShowError(
            "ParentsCommunicationScreen: handleSend: ",
            error
          );
        })
        .finally(() => setSending(false));
    }
  };

  const renderToolBar = () => {
    console.log("Student Info: ",studentInfo)
    return (
      <ToolbarBorder>
        <MenuItem
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <TitleView>
          <TitleSubHeader>Conversation</TitleSubHeader>
          <TitleHeader numberOfLines={1}>{studentInfo?.name}{" ("+parentInfo?.name+") " }</TitleHeader>
        </TitleView>
        <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Teachers",
            });
          }}
        >
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
    );
  };

  const renderBottomBar = () => {
    return (
      <View style={styles.bottomView}>
        <TextInput
          style={styles.messageView}
          multiline
          onChangeText={(text) => {
            setMessage(text);
          }}
          value={message}
          placeholder="Write a message"
          placeholderTextColor={secondaryText}
          selectionColor={primaryColor}
          autoFocus
        />
        <TouchableOpacity style={{ marginStart: 16 }} onPress={handleSend}>
          {sending ? (
            <ActivityIndicator
              style={{ alignSelf: "center" }}
              color={primaryColor}
              size={24}
            />
          ) : (
            <Text style={message !== "" ? styles.enabled : styles.disabled}>
              Send
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  const renderBubble = (item, index) => {
    var sameUserInPrevMessage = false;
    var sameUserInNextMessage = false;
    var attachToPreviousItem = false;
    var attachToNextItem = false;
    var newMessage = false;
    var previousMessage = messageList[index + 1];
    var nextMessage = messageList[index - 1];
    var currentMessage = item;

    if (previousMessage?.sid !== undefined && previousMessage?.sid) {
      previousMessage?.sid === currentMessage?.sid
        ? (sameUserInPrevMessage = true)
        : (sameUserInPrevMessage = false);
    }

    if (nextMessage?.sid !== undefined && nextMessage?.sid) {
      nextMessage?.sid === currentMessage?.sid
        ? (sameUserInNextMessage = true)
        : (sameUserInNextMessage = false);
    } else {
      sameUserInNextMessage = true;
    }

    if (
      previousMessage?.created_at !== undefined &&
      previousMessage?.created_at
    ) {
      var currentMessageDay = moment(currentMessage?.created_at)
        .toDate()
        .setHours(0, 0, 0, 0);
      var previousMessageDay = moment(previousMessage?.created_at)
        .toDate()
        .setHours(0, 0, 0, 0);
      currentMessageDay === previousMessageDay
        ? (attachToPreviousItem = true)
        : (attachToPreviousItem = false);
    } else {
      attachToPreviousItem = false;
    }
    var diff = 0;
    if (nextMessage?.created_at !== undefined && nextMessage?.created_at) {
      var currentMessageDay = moment(currentMessage?.created_at)
        .toDate()
        .setSeconds(0, 0);
      var nextMessageDay = moment(nextMessage?.created_at)
        .toDate()
        .setSeconds(0, 0);
      diff = currentMessageDay - nextMessageDay;
      diff === 0 ? (attachToNextItem = true) : (attachToNextItem = false);
    } else {
      attachToNextItem = false;
    }

    var messageBelongsToCurrentUser =
      supabase_api.shared.uid === currentMessage?.from;

    return (
      <View>
        {!attachToPreviousItem && (
          <View style={styles.messageView}>
            <Text style={styles.dateText}>
              {new Date().setHours(0, 0, 0, 0) -
                new Date(currentMessage.created_at).setHours(0, 0, 0, 0) ==
              0
                ? "TODAY"
                : moment(currentMessage.created_at).format("ll")}
            </Text>
          </View>
        )}
        <TouchableHighlight activeOpacity={0.95} underlayColor={underlayColor}>
          <View>
            <View
              style={[
                messageBelongsToCurrentUser
                  ? styles.messageTimeAndNameContainerRight
                  : styles.messageTimeAndNameContainerLeft,
              ]}
            >
              <Text
                style={
                  messageBelongsToCurrentUser
                    ? styles.currentUserMessageText
                    : styles.UserMessageText
                }
              >
                {item?.message}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                }}
              >
                {(!sameUserInNextMessage ||
                  !attachToPreviousItem ||
                  !attachToNextItem) &&
                  !messageBelongsToCurrentUser && (
                    <Image
                      style={styles.avatar}
                      source={{
                        uri: messageBelongsToCurrentUser
                          ? teachersInfo?.avatar
                          : "",
                      }}
                    />
                  )}
              </View>
            </View>
            {(index === 0 || !sameUserInNextMessage || !attachToNextItem) && (
              <Text style={styles.messageTime}>
                {moment(currentMessage.created_at).format("LT")}
              </Text>
            )}
          </View>
        </TouchableHighlight>
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      {renderToolBar()}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ContentView>
          <View style={styles.mainView}>
            <View style={{ flex: 1, backgroundColor: primaryColor_50 }}>
              <VirtualizedList
                contentContainerStyle={styles.feed}
                data={messageList}
                inverted
                renderItem={({ item, index }) => renderBubble(item, index)}
                keyExtractor={(item, index) => String(index)}
                // ListHeaderComponent={this.renderHeader}
                // ListFooterComponent={this.renderFooter}
                // onEndReached={this.retrieveMore}
                onEndReachedThreshold={0.8}
                // onViewableItemsChanged={this.onViewableItemsChanged}
                // viewabilityConfig={{
                //   viewAreaCoveragePercentThreshold: 90,
                // }}
                removeClippedSubviews
                // refreshing={this.state.refreshing}
                showsVerticalScrollIndicator={false}
                initialNumToRender={2}
                getItemCount={(data) => data.length}
                getItem={(data, index) => data[index]}
              />
            </View>
            {renderBottomBar()}
          </View>
        </ContentView>
      </KeyboardAvoidingView>
    </Container>
  );
}
const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  enabled: {
    fontFamily: "RHD-Bold",
    color: primaryColor,
    fontSize: 16,
    lineHeight: 24,
  },
  disabled: {
    fontFamily: "RHD-Medium",
    color: secondaryText,
    fontSize: 16,
    lineHeight: 24,
  },
  bottomView: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: borderWidth,
    borderTopColor: borderColor,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  messageView: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
  },
  messageView: {
    justifyContent: "center",
    alignSelf: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    fontFamily: "RHD-Medium",
    color: secondaryText,
    paddingHorizontal: 8,
    fontSize: 12,
  },
  messageTimeAndNameContainerLeft: {
    paddingVertical: 4,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingHorizontal: 8,
  },
  messageTimeAndNameContainerRight: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    maxWidth: "80%",
    alignSelf: "flex-end", // Align to the right side of the parent container
    padding: 4,
    margin: 10,
    flexShrink: 1,
  },
  currentUserMessageText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "RHD-Medium",
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexShrink: 1,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginTop: 4,
    borderWidth: borderWidth,
    borderColor: borderColor,
  },
  messageTime: {
    color: "#c7c7c7",
    fontSize: 10,
    marginHorizontal: 8,
    lineHeight: 15,
    marginVertical: 4,
    textAlign: "right",
  },
});
export default ParentsCommunicationScreen;
