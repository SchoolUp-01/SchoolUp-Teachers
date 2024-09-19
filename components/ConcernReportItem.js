import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_50,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDateWithTime } from "../utils/DateUtils";

const ConcernReportItem = ({ item }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [height] = useState(new Animated.Value(0));

  const navigateToScreen = () => {
    navigation.navigate("UpdateConcernScreen", {
      item: item,
    });
  };

  const {
    closed_on,
    created_at,
    id,
    parent_info: { avatar: parentAvatar, id: parentId, name: parentName },
    reason,
    remarks,
    student_info: { avatar: studentAvatar, id: studentId, name: studentName },
    type,
  } = item;
  return (
    <View
      style={{
        paddingHorizontal: 16,
        marginVertical: 12,
        paddingVertical: 4,
        borderBottomWidth: borderWidth,
        borderColor: borderColor,
      }}
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
          source={{ uri: studentAvatar }}
        />
        <View style={{ flex: 1, marginHorizontal: 16 }}>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              fontSize: 16,
              lineHeight: 24,
            }}
          >
            {studentName}
          </Text>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              fontSize: 14,
              lineHeight: 21,
              color: secondaryText,
            }}
          >
            {type}
          </Text>
        </View>
        <View style={{ marginTop: 8, flexDirection: "row" }}>
          <View
            style={{
              paddingHorizontal: 8,
              paddingVertical: 4,
              backgroundColor: primaryColor_50,
              borderRadius: 8,
              flexShrink: 1,
              marginEnd: 8,
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
              {"no new updates"}
            </Text>
          </View>
          <TouchableOpacity onPress={navigateToScreen}>
            <Feather name="chevron-right" size={24} color={primaryText} />
          </TouchableOpacity>
        </View>
      </View>
      {reason !== null && (
        <Text
          style={{
            marginTop: 8,
            marginBottom: 8,
            fontFamily: "RHD-Medium",
            fontSize: 14,
            lineHeight: 21,
          }}
        >
          {reason}
        </Text>
      )}
      <Text
        style={{
          marginBottom: 16,
          fontFamily: "RHD-Medium",
          fontSize: 12,
          lineHeight: 18,
          color: secondaryText,
        }}
      >
        Created at {formatDateWithTime(created_at)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,

    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 8,
  },
  button: {
    backgroundColor: "lightblue",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
  },
  content: {
    backgroundColor: "white",
    borderRadius: 4,
  },
  contentText: {
    color: "black",
    fontSize: 16,
  },
  mainContent: {
    flexDirection: "row",
    justifyContent: "center",
  },
  examHeader: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    color: primaryText,
  },
  examSubHeader: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "RHD-Regular",
    color: primaryText,
  },
  addButton: {
    borderRadius: 24,
    backgroundColor: primaryColor,
    paddingVertical: 8,
    alignItems: "center",
  },
  addButtonLabel: {
    paddingHorizontal: 16,
    color: "#FFFFFF",
    fontFamily: "RHD-Bold",
  },
  manageButton: {
    borderRadius: 24,
    borderColor: primaryColor,
    borderWidth: borderWidth,
    marginTop: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  mangeButtonLabel: {
    paddingHorizontal: 16,
    color: primaryColor,
    fontFamily: "RHD-Bold",
  },
});

export default React.memo(ConcernReportItem);
