import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  Toolbar,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation } from "@react-navigation/native";
import LeaveRequestItem from "../components/LeaveRequestItem";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryText,
  primaryColor,
  secondaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";

import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import ConcernReportItem from "../components/ConcernReportItem";

const ConcernScreen = () => {
  const navigation = useNavigation();
  const [concernList, setConcernList] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const classList = ["All", "Class 3", "Class 5", "Class 6", "Class 7"];

  const [tab, setTab] = useState("Unresolved");
  const [selectedPage, setSelectedPage] = useState(0);
  const pagerRef = useRef();
  const tabList = ["Unresolved", "Resolved"];
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    supabase_api.shared
      .getConcernReport()
      .then((res) => {
        console.log(res);
        setConcernList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ConcernScreen: getConcernReport: ",
          error
        );
      });

    return () => {};
  }, []);

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


  const renderHeader = () => {
    return (
      <View>
        <View style={styles.searchView}>
          <Feather name="search" size={16} color={secondaryText} />
          <TextInput
            style={styles.searchInput}
            selectionColor={primaryColor}
            placeholder="Search teachers or subject"
            onChangeText={(search) => setSearchText(search)}
            value={searchText}
            autoCapitalize="none"
          />
          {searchText.length !== 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x" size={16} color={secondaryText} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          contentContainerStyle={{
            flexDirection: "row",
            marginHorizontal: 16,
            marginBottom: 16,
          }}
        >
          <OptionItem item={"All"} />
          <OptionItem item={"Open"} />
          <OptionItem item={"In-Progress"} />
          <OptionItem item={"Resolved"} />
        </ScrollView>
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <Title>Parent Concerns</Title>
        <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Attendance",
            });
          }}
        >
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      {/* <View style={styles.tabView}>
        <TabItem item={tabList[0]} />
        <TabItem item={tabList[1]} />
      </View> */}
      <ContentView>
        <FlatList
          data={concernList}
          renderItem={({ item }) => <ConcernReportItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
          ListHeaderComponent={renderHeader}
        />
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

  tabText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  tabItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "center",
    // backgroundColor: itemColor,
  },
  tabView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  searchView: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 12,
    marginBottom: 12,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontFamily: "RHD-Medium",
    marginHorizontal: 16,
  },
});

export default React.memo(ConcernScreen);
