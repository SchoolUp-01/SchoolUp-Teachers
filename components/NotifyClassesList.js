import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, FlatList, Text } from "react-native";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor_50,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
const { width, height } = new Dimensions.get("screen");
import ErrorLogger from "../utils/ErrorLogger";
import SubjectNotificationItem from "./SubjectNotificationItem";

export default function NotifyClassesList({ date, onUpdate }) {
  const navigation = useNavigation();
  const limit = 5;
  const [classesList, setClassesList] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [lastItem, setLastItem] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(date);
    supabase_api.shared
      .getTeacherTimeTableInfo(date)
      .then((res) => {
        setClassesList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "NotifyClassesList: getTeacherTimeTableInfo: ",
          error
        );
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {};
  }, []);

  const renderEmpty = () => {
    if (!loading && classesList?.length == 0) {
      return (
        <View style={styles.feedItem}>
          <View
            style={{
              flexGrow: 1,
              flexDirection: "column",
              flexShrink: 1,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                marginTop: 6,
                marginStart: 6,
                lineHeight: 24,
                fontFamily: "RHD-Medium",
                color: primaryText,
              }}
            >
              A Day Without Classes 🎉
            </Text>
            <Text
              style={{
                marginHorizontal: 8,
                marginBottom: 8,
                fontSize: 14,
                lineHeight: 21,
                overflow: "hidden",
                color: secondaryText,
                fontFamily: "RHD-Medium",
              }}
              numberOfLines={2}
            >
              Guess what? Tomorrow's schedule is like a blank notebook –
              completely empty! 📚✨
            </Text>
          </View>
        </View>
      );
    } else {
      return <View></View>;
    }
  };

  const renderHeader = () => {
    if (loading) return;
    const today = new Date();
    const givenDate = new Date(date);
    const isTomorrow = givenDate.getDate() === today.getDate() + 1;
    return (
      <Text style={styles.label}>
        {isTomorrow ? "Tomorrow" : formatDate(givenDate)}
      </Text>
    );
  };

  const formatDate = (date) => {
    // Implement your custom date formatting logic here
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const renderFooter = () => {
    if (loading) return;
  };

  return (
    <FlatList
      contentContainerStyle={{}}
      data={classesList}
      renderItem={({ item }) => (
        <SubjectNotificationItem item={item} date={date} onUpdate={onUpdate} />
      )}
      keyExtractor={(item, index) => String(index)}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    // marginVertical: 8,
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    flexDirection: "row",
  },
  subView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 24,
    textAlignVertical: "center",
    alignSelf: "center",
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: "center",
    alignSelf: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: primaryColor_50,
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: borderWidth,
    borderBottomColor: borderColor,
  },
  subLabel: {
    fontSize: 14,
    color: primaryText,
    marginTop: 8,
    fontFamily: "RHD-Medium",
    flexShrink: 1,
    textAlign: "center",
  },
  shimText: {
    height: 15,
    marginTop: 3,
  },
  feedItem: {
    marginHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    marginVertical: 8,
    minWidth: 64,
    alignItems: "center",
    // backgroundColor: itemColor,
  },
  label: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    color: secondaryText,
    textAlign: "left",
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 12,
  },
});
