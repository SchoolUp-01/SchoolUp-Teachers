import React, { useState } from "react";
import { Container, ContentView } from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryText,
  primaryColor,
} from "../utils/Color";
import LeaveList from "../components/LeaveList";

const LeaveScreen = () => {
  const navigation = useNavigation();
  const [selectedTag, setSelectedTag] = useState("");
  const classList = ["All", "Class 3", "Class 5", "Class 6", "Class 7"];

  const OptionItem = ({ item }) => {
    return (
      <View
        style={[
          styles.optionItem,
          {
            backgroundColor: item == selectedTag ? primaryColor : itemColor,
          },
        ]}
      >
        <TouchableOpacity onPress={() => setSelectedTag(item)}>
          <Text
            style={[
              styles.optionText,
              {
                color: item == selectedTag ? "#fff" : primaryText,
                fontFamily: item == selectedTag ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onLeaveClicked = (item) => {
    navigation.navigate("UpdateLeaveScreen", {
      leave: item,
    });
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <BasicToolBar title={"Leave Request"} navigation={navigation} />
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
