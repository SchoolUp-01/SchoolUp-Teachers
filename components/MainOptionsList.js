import React from "react";
import { View, FlatList, Dimensions, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { primaryColor, primaryColor_50 } from "../utils/Color";

const data = [
  { id: "1", text: "Leave List" },
  { id: "2", text: "Apply Leave" },
  { id: "3", text: "Check - In" },
  { id: "4", text: "Check - Out" },
  { id: "4", text: "Compensation letter" },
  { id: "4", text: "Salary Statement" },
  // ... additional items
];

const numColumns = 3;
const screenWidth = Dimensions.get("window").width;

const Item = ({ item }) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      height: 100,
      margin: 5,
      backgroundColor: primaryColor_50,
      borderRadius: 8,
    }}
  >
    <Feather name="clipboard" size={24} color={primaryColor} />
    <Text
      style={{
        fontFamily: "RHD-Medium",
        marginTop: 8,
        fontSize: 16,
        lineHeight: 24,
        color: primaryColor,
        textAlign: "center",
      }}
    >
      {" "}
      {item.text}
    </Text>
  </View>
);

const MainOptionsList = ({list}) => {
  return (
    <FlatList
      data={list}
      renderItem={({ item }) => <Item item={item} />}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      contentContainerStyle={{ paddingHorizontal: 5 }}
      columnWrapperStyle={{
        flexWrap: "wrap",
        flexDirection: "row",
        justifyContent: "space-between",
        width: screenWidth - 10, // Adjust margin/padding values
      }}
    />
  );
};

export default MainOptionsList;
