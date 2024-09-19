import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  TouchableWithoutFeedback,
  ImageBackground,
  Text,
  Image,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor_50,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
const { width, height } = new Dimensions.get("screen");
import EmptyState from "./EmptyState";
import ErrorLogger from "../utils/ErrorLogger";
export default function EventList() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [eventList, setEventList] = useState([]);

  useEffect(() => {
    supabase_api.shared
      .getSchoolEventInformation(Student.shared.getMasterStudentSchoolID())
      .then((res) => {
        setEventList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "EventList: getSchoolEventInformation: ",
          error
        );
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);


  const EventItem = ({item}) => {
    if(item ==null) return;

    const { avatar, description,title } = item;
    return (
      <View
        style={{
          flexDirection: "row",
          borderWidth: borderWidth,
          borderColor: borderColor,
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderRadius: 8,
          marginBottom: 12,
        }}
      >
        <Image
          style={{
            width: 120,
            height: 80,
            borderRadius: 4,
            alignSelf: "center",
          }}
          source={{ uri: avatar }}
        />
        <View style={{ marginHorizontal: 16, flexShrink: 1 }}>
          <Text
            style={{
              fontFamily: "RHD-Medium",
              fontSize: 16,
              lineHeight: 24,
              color: primaryText,
              overflow: "hidden",
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              fontFamily: "RHD-Regular",
              fontSize: 14,
              lineHeight: 21,
              color: primaryText,
              overflow: "hidden",
            }}
            numberOfLines={3}
          >
            {description}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (!loading && eventList?.length == 0) {
      return (
        <EmptyState
        title="No Information available"
        description="No Events available at the moment, please check back later."
        animation={require("../assets/animations/no_data.json")}
      />
      );
    } else {
      return <View></View>;
    }
  };

  return (
    <FlatList
      contentContainerStyle={{ paddingHorizontal: 16,paddingVertical:16 }}
      data={eventList}
      renderItem={({ item }) => <EventItem item={item} />}
      keyExtractor={(item, index) => String(index)}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={renderEmpty}
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
  memoryItem: {
    width: width / 3 - 48,
    height: width / 2,
    marginVertical: 6,
    borderRadius: 8,
    marginHorizontal: 8,
  },
});
