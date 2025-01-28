import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryText,
  secondaryText,
} from "../utils/Color";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import InAppNotification from "../utils/InAppNotification";
import CommunityMessages from "./CommunityMessages";
import Teacher from "../state/TeacherManager";

export default function CommunityTab() {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setSending(true);
      await supabase_api.shared.addCommunityMessage(
        message,
        Teacher.shared.getSchoolID(),
      );
      setMessage("");
    } catch (error) {
      InAppNotification.shared.showErrorNotification({
        title: "Something went wrong!",
      });
      ErrorLogger.shared.ShowError(
        "CommunityScreen: addCommunityMessage: ",
        error
      );
    } finally {
      setSending(false);
    }
  };

  const renderBottomBar = () => {
    return (
      <View
        style={[styles.bottomView, inputFocused && styles.bottomViewFocused]}
      >
        <TextInput
          style={[styles.messageView, styles.messageViewFocused]}
          multiline
          onChangeText={(text) => setMessage(text)}
          value={message}
          placeholder="Write a message"
          placeholderTextColor={secondaryText}
          selectionColor={primaryText}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          //   autoCapitalize="sentences"
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSend}
          disabled={!message.trim().length || sending}
        >
          {sending ? (
            <ActivityIndicator
              style={{ alignSelf: "center" }}
              color={primaryColor}
              size={24}
            />
          ) : (
            <Text
              style={
                message.trim().length !== 0 ? styles.enabled : styles.disabled
              }
            >
              Send
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 160 : 0}
      >
        <View style={styles.messagesContainer}>
          <CommunityMessages />
        </View>
        {renderBottomBar()}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  bottomView: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    borderTopWidth: borderWidth,
    borderTopColor: borderColor,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "#fff",
  },
  bottomViewFocused: {
    borderTopWidth: 2,
    borderTopColor: primaryColor,
  },
  messageView: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    maxHeight: 100,
    paddingVertical: 8,
  },
  messageViewFocused: {
    color: primaryText,
  },
  sendButton: {
    marginStart: 16,
    paddingHorizontal: 8,
    paddingBottom: 8,
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
});
