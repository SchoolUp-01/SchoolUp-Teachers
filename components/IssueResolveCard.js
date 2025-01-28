import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { borderColor, borderWidth, defaultImageBgColor, primaryColor, primaryColor_50 } from "../utils/Color";
import { ItemLabel } from "./Label";

const IssueResolvedCard = ({ remark, closed_by }) => {
  const user = closed_by??null;
  return (
    <View style={styles.card}>

      <View style={styles.cardContent}>
        <View style={styles.flexRow}>
          <View style={styles.avatar}>
            <Image style={styles.avatarImage} source={{uri: user?.avatar}}/>
            <View style={styles.avatarFallbackContainer}>
              <Text style={styles.avatarFallback}>{user?.name[0]}</Text>
            </View>
          </View>
          <View style={styles.textContainer}>
            <View style={styles.flexRow}>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <View style={styles.prose}>
              <Text style={styles.proseText}>
                {remark}
              </Text>
            </View>
          </View>
          <ItemLabel label={"Resolved"} color={primaryColor} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: borderWidth,
    borderColor: primaryColor,
    marginVertical:8,
    paddingVertical:8,
    paddingHorizontal:12,
    borderRadius:8,
    // backgroundColor:primaryColor_50,
    marginHorizontal:16
  },
  cardHeader: {
    paddingBottom: 8,
    marginBottom: 8,
    marginTop: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  flexRow: {
    flexDirection: "row",
    alignItems: "center",
    flexShrink: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginRight: 16,
    backgroundColor: "#e0e0e0",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    backgroundColor: defaultImageBgColor,
  },
  avatarFallbackContainer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarFallback: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 1,
    flexShrink: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
  },
  resolvedDate: {
    fontSize: 12,
    color: "#6c757d",
    marginLeft: 8,
  },
  prose: {
    marginTop: 4,
    flexShrink: 1,
  },
  proseText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    flexShrink: 1,
    fontFamily: "RHD-Regular",
  },
});

export default IssueResolvedCard;
