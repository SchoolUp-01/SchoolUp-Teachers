import React, { useState } from "react";
import { Container, ContentView, MenuItem, Title, ToolbarBorder } from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import {
  StyleSheet,
} from "react-native";
import { Feather } from "@expo/vector-icons";

import {
  borderColor,
  borderWidth,
  itemColor,
  primaryText,
} from "../utils/Color";
import LeaveList from "../components/LeaveList";

const LeaveScreen = () => {
  const navigation = useNavigation();
  const [selectedTag, setSelectedTag] = useState("");
  

  const onLeaveClicked = (item) => {
    navigation.navigate("UpdateLeaveScreen", {
      leave: item,
    });
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <Title>Leave Request</Title>
        <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Leave Requests",
            });
          }}
        >
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      <ContentView>
        <LeaveList onLeaveClicked={onLeaveClicked} />
      </ContentView>
    </Container>
  );
};

const styles = StyleSheet.create({
  optionText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  optionItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    backgroundColor: itemColor,
  },
});

export default React.memo(LeaveScreen);
