import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
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
export default function ManagementList() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [managementList, setManagementList] = useState([]);

  useEffect(() => {
    supabase_api.shared
      .getSchoolManagementInformation(Student.shared.getMasterStudentSchoolID())
      .then((res) => {
        setManagementList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ManagementList: getSchoolManagementInformation: ",
          error
        );
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  const ManagementItem = ({ item }) => {
    const { avatar, description, designation, education, name } = item;
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          borderRadius: 8,
          borderWidth: borderWidth,
          borderColor: borderColor,
          paddingHorizontal: 8,
          paddingVertical: 8,
          marginBottom: 16,
        }}
      >
        <View style={{ width: 120 }}>
          <Image
            style={{ width: 120, height: 120, borderRadius: 4 }}
            source={{ uri: avatar }}
          />
          <Text style={{ marginTop: 8, fontFamily: "RHD-Regular" }}>
            {education}
          </Text>
        </View>
        <View
          style={{ marginHorizontal: 16, overflow: "hidden", flexShrink: 1 }}
        >
          <Text
            style={{ fontFamily: "RHD-Bold", fontSize: 18, lineHeight: 27 }}
          >
            {name}
          </Text>
          {/* <Text>{education}</Text> */}
          <Text
            style={{ fontFamily: "RHD-Medium", fontSize: 16, lineHeight: 24 }}
          >
            {designation}
          </Text>
          <Text
            style={{
              fontFamily: "RHD-Regular",
              fontSize: 14,
              lineHeight: 21,
              marginTop: 4,
            }}
          >
            {description}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmpty = () => {
    if (!loading && managementList?.length == 0) {
      return (
        <EmptyState
          title="No Information available"
          description="No Management Details available at the moment, please check back later."
          animation={require("../assets/animations/no_data.json")}
        />
      );
    } else {
      return <View></View>;
    }
  };

  return (
    <FlatList
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 16 }}
      data={managementList}
      renderItem={({ item }) => <ManagementItem item={item} />}
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
