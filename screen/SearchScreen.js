import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Text,
  TouchableHighlight,
} from "react-native";
import {
  Container,
  ToolbarBorder,
  ContentView,
} from "../components/styledComponents";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { handleAction } from "../state/RecentActionManager";
import { ActionData } from "../utils/ActionData";

const SearchScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [emptyResult, setEmptyResult] = useState(null);

  const MenuTitle = ({ title }) => {
    if (search == "") {
      return (
        <View style={styles.item}>
          <Text style={styles.label}>{title}</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  const MenuItem = ({ icon, label, screen, index }) => {
    let item = String(label).toLocaleLowerCase();
    if (item.includes(search.toLocaleLowerCase())) {
      return (
        <TouchableHighlight
          activeOpacity={0.95}
          underlayColor={underlayColor}
          onPress={() => {
            handleAction(index);
            navigation.navigate(screen);
          }}
        >
          <View style={styles.subItem}>
            <Feather
              style={styles.iconContainer}
              size={20}
              color={primaryText}
              name={icon}
            />
            <Text style={styles.subLabel}>{label}</Text>
          </View>
        </TouchableHighlight>
      );
    } else {
      return null;
    }
  };

  const EmptyItem = ({ icon, label }) => {
    const filteredItems = ActionData.filter((item) =>
      item.label.toLowerCase().includes(search.toLowerCase())
    );
    if (filteredItems.length === 0) {
      return (
        <View style={styles.subItem}>
          <Feather
            style={styles.iconContainer}
            size={20}
            color={primaryText}
            name={icon}
          />
          <Text style={styles.subLabel}>{label + " " + search}</Text>
        </View>
      );
    } else {
      return null;
    }
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" backgroundColor="#fff" />

      <ToolbarBorder style={styles.toolbar}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryText}></Feather>
        </TouchableOpacity>
        <View style={styles.searchView}>
          <TextInput
            style={styles.searchTextInput}
            onChangeText={(text) => {
              setEmptyResult(null);
              setSearch(text);
            }}
            placeholder="Search Actions"
            // autoFocus
            placeholderTextColor={secondaryText}
            value={search}
          />
        </View>

        {search.length !== 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Feather name="x" size={16} color={secondaryText}></Feather>
          </TouchableOpacity>
        )}
      </ToolbarBorder>
      <ContentView>
        <ScrollView style={{ paddingTop: 8, paddingBottom: 48 }}>
          <MenuTitle title={"Academics"} />
          <MenuItem
            icon={"activity"}
            label={"Attendance"}
            screen={"AttendanceScreen"}
            index={0}
          />
          <MenuItem
            icon={"users"}
            label={"Teachers"}
            screen={"TeachersScreen"}
            index={1}
          />
          <MenuItem
            icon={"clipboard"}
            label={"Lesson Plans"}
            screen={"LessonPlansScreen"}
            index={2}
          />
          <MenuItem
            icon={"calendar"}
            label={"Time Table"}
            screen={"TimeTableScreen"}
            index={3}
          />
          <MenuItem
            icon={"layout"}
            label={"Exams"}
            screen={"ExamScreen"}
            index={14}
          />
          <MenuItem
            icon={"bar-chart-2"}
            label={"Reports"}
            screen={"AcademicReportScreen"}
            index={4}
          />
          <MenuTitle title={"Holidays"} />
          <MenuItem
            icon={"log-out"}
            label={"Apply Leave"}
            screen={"ApplyLeaveScreen"}
            index={5}
          />
          <MenuItem
            icon={"calendar"}
            label={"Holiday Calender"}
            screen={"HolidayCalenderScreen"}
            index={6}
          />
          <MenuTitle title={"Administration"} />
          <MenuItem
            icon={"download"}
            label={"Fee Receipt"}
            screen={"FeeReceiptScreen"}
            index={7}
          />
          <MenuItem
            icon={"navigation"}
            label={"Bus Route Tracker"}
            screen={"BusRouteTrackerScreen"}
            index={8}
          />
          <MenuItem
            icon={"coffee"}
            label={"Request a meal"}
            screen={"RequestMealScreen"}
            index={9}
          />
          <MenuTitle title={"More Information"} />
          <MenuItem
            icon={"user"}
            label={"About Student"}
            screen={"StudentInfoScreen"}
            index={10}
          />
          <MenuItem
            icon={"book"}
            label={"School Information"}
            screen={"SchoolInformationScreen"}
            index={11}
          />
          {/* <MenuItem
          icon={"bar-chart-2"}
          label={"Statistics"}
          screen={"StatisticsScreen"}
          index={12}
        /> */}
          <MenuItem
            icon={"alert-circle"}
            label={"Raise a concern"}
            screen={"RaiseConcernScreen"}
            index={13}
          />
          <EmptyItem
            icon={"search"}
            label={"No Search result:"}
            screen={"RaiseConcernScreen"}
          />
        </ScrollView>
      </ContentView>
    </Container>
  );
};

export default React.memo(SearchScreen);

const styles = StyleSheet.create({
  toolbar: {
    flexDirection: "row",
    height: 56,
    paddingHorizontal: 16,
    alignItems: "center",
    backgroundColor: "#fff",
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  searchView: {
    flexGrow: 1,
    flexDirection: "column",
    flexShrink: 1,
    marginHorizontal: 12,
    alignSelf: "center",
  },
  searchTextInput: {
    fontSize: 16,
    paddingHorizontal: 2,
    marginStart: 2,
    color: primaryText,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: borderColor,
    borderBottomWidth: borderWidth,
  },
  label: {
    paddingVertical: 12,
    marginHorizontal: 16,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryColor,
    fontWeight: "500",
  },
  iconContainer: {
    marginStart: 16,
    alignSelf: "center",
    width: 24,
    height: 24,
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
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryText,
  },
});
