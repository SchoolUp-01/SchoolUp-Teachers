import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Avatar from "./Avatar";
import {
  InformationContainer,
  InformationTitle,
  InformationValueText,
} from "./styledComponents";
import { defaultImageBgColor } from "../utils/Color";

export const InformationView = ({ name, value }) => {
  return (
    <InformationContainer>
      <InformationTitle>{name}</InformationTitle>
      <InformationValueText>{value}</InformationValueText>
    </InformationContainer>
  );
};

export const UserInformation = ({ name, avatar, id, title }) => (
  <View style={styles.userInfoContainer}>
    <InformationTitle>{title}</InformationTitle>
    <View style={styles.userInfo}>
      <Avatar user={{ name: name, avatar: avatar }} width={24} height={24} />
      <Text style={styles.userName}>{name}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  informationContainer: {
    justifyContent: "space-between",
    paddingVertical: 8,
    marginEnd: 28,
  },
  infoName: {
    fontFamily: "Inter-Regular",
    fontSize: 12,
    lineHeight: 16,
    color: "#646464",
    textAlign: "left",
  },
  infoValue: {
    flex: 1,
    textAlign: "left",
    fontFamily: "Inter-Medium",
    fontSize: 16,
    marginTop: 4,
  },
  userInfoContainer: {
    justifyContent: "space-between",
    paddingVertical: 8,
    marginEnd: 36,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
    gap: 12,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: defaultImageBgColor,
    marginEnd: 8,
  },
  userName: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
  },
});
