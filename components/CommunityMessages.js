import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import ErrorLogger from "../utils/ErrorLogger";
import moment from "moment";
import { supabase } from "../backend/supabaseClient";
import Avatar from "./Avatar";
import supabase_api from "../backend/supabase_api";
import { community_message_info_db } from "../utils/Constants";
import { primaryColor } from "../utils/Color";
import Teacher from "../state/TeacherManager";

const CommunityMessages = ({ conversationID }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const flatListRef = useRef();
  const limit = 25;
  const schoolId = Teacher.shared.getSchoolID();

  useEffect(() => {
    if (schoolId !== null) {
      const channels = realTimeListener();
      fetchMessages();
      return () => {
        channels.unsubscribe();
      };
    }
  }, [schoolId]);

  const fetchMessages = async (offset = 0, append = false) => {
    if (loading || loadingMore) return;
    if (offset === 0) setLoading(true);
    else setLoadingMore(true);

    try {
      const response = await supabase_api.shared.getCommunityMessageList(
        offset,
        limit+offset,
        schoolId
      );
      if (response.length < limit) setHasMore(false);
      setMessages((prevMessages) =>
        append ? [...prevMessages, ...response] : response
      );
    } catch (error) {
      setError(error.message);
      ErrorLogger.shared.ShowError(
        "CommunityMessages: getCommunityMessageList: ",
        error
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const realTimeListener = useCallback(() => {
    const channels = supabase
      .channel("community-message-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: community_message_info_db,
          filter: `school_id=eq.${schoolId}`,
        },
        handlePayload
      )
      .subscribe();

    return channels;
  }, [schoolId]);

  const handlePayload = (payload) => {
    console.log("Change received!", payload);
    const { eventType, new: newMessage, old: oldMessage } = payload;

    switch (eventType) {
      case "INSERT":
        fetchSenderDetails(newMessage);
        break;
      case "DELETE":
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message.id !== oldMessage.id)
        );
        break;
      default:
        break;
    }
  };

  const fetchSenderDetails = async (newMessage) => {
    try {
      const result =
       newMessage?.parent_id !==null
          ? await supabase_api.shared.getParentDetails(newMessage?.parent_id)
          : await supabase_api.shared.getTeamDetails(newMessage?.team_id);

      const newItem = {
        ...newMessage,
        ...(newMessage?.parent_id !==null
          ? { parent_info: result }
          : { team_info: result }),
      };

      setMessages((prevMessages) => {
        const updatedMessages = [newItem, ...prevMessages];
        return updatedMessages.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
      });
    } catch (error) {
      console.error("Error fetching sender details: ", error);
    }
  };


  const loadMoreMessages = () => {
    if (hasMore && !loading && !loadingMore) {
      fetchMessages(messages.length, true);
    }
  };

  const ConversationStartIndicator = () => (
    <View style={styles.startIndicatorContainer}>
      <Text style={styles.startIndicatorText}>Start of Conversation</Text>
    </View>
  );

  const renderFooter = () => {
    if (!loadingMore && !hasMore) return <ConversationStartIndicator/>;
    return <ActivityIndicator style={{ margin: 10 }} />;
  };

  const renderItem = ({ item }) => {
    if (item === null) return null;
    const { created_at, message, parent_info, role, team_info } = item;
    const user = parent_info ?? team_info;
    const isSentByMe = user?.id === supabase_api.shared.uid;

    return (
      <View
        style={[
          styles.messageContainer,
          { alignSelf: isSentByMe ? "flex-end" : "flex-start" },
          { backgroundColor: isSentByMe ? primaryColor : "#f1f1f1" },
        ]}
      >
        <View style={styles.messageHeader}>
          <Avatar user={user} width={20} height={20} />
          <Text style={[styles.messageSender, { color: isSentByMe ? "#fff" : "#000" }]}>
            {user.name}
            <Text style={[styles.messageRole, { color: isSentByMe ? "#ccc" : "#999" }]}>
              ({role})
            </Text>
          </Text>
          <Text style={[styles.messageTime, { color: isSentByMe ? "#ccc" : "#999" }]}>
            {moment(created_at).fromNow()}
          </Text>
        </View>
        <Text style={{ color: isSentByMe ? "#fff" : "#000" }}>{message}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesContainer}
        inverted
        onEndReached={loadMoreMessages}
        onEndReachedThreshold={0.1}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flex: 1,
    backgroundColor: "#F8F5FF",
  },
  messagesContainer: {
    backgroundColor: "#F8F5FF",
  },
  messageContainer: {
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    maxWidth: "75%",
    marginHorizontal: 8,
  },
  messageHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  messageSender: {
    fontFamily: "Inter-Regular",
    marginStart: 8,
  },
  messageRole: {
    fontSize: 12,
    marginLeft: 4,
  },
  messageTime: {
    fontSize: 12,
    marginLeft: 20,
  },
  startIndicatorContainer: {
    padding: 16,
    alignItems: 'center',
  },
  startIndicatorText: {
    color: '#666',
    fontSize: 12,
    fontFamily: "RHD-Regular",
  },
});

export default CommunityMessages;
