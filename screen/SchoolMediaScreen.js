import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  Toolbar,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";
import PagerView from "react-native-pager-view";
import { useRef, useState } from "react";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import ManagementList from "../components/ManagementList";
import EventList from "../components/EventList";

export default function SchoolMediaScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [selectedPage, setSelectedPage] = useState(route?.params?.selectedPage);
  const [tab, setTab] = useState("");
  const tabList = ["Events", "Achievements", "Management"];
  const pagerRef = useRef();

  const TabItem = ({ item }) => {
    return (
      <View
        style={[
          styles.tabItem,
          {
            borderColor: item == tab ? primaryColor : borderColor,
            borderBottomWidth: item == tab ? 1 : 0,
          },
        ]}
      >
        <TouchableOpacity onPress={() => pagerRef.current.setPage(tabList.indexOf(item))}>
          <Text
            style={[
              styles.tabText,
              {
                color: item == tab ? primaryColor : primaryText,
                fontFamily: item == tab ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />

      <ContentView>
        <Toolbar>
          <MenuItem
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Feather name={"arrow-left"} size={24} color={primaryText} />
          </MenuItem>
          <Title style={{flexShrink:1}} ellipsizeMode="tail">{Student.shared.getMasterStudentSchoolName()}</Title>
        </Toolbar>
        <View style={styles.tabView}>
          <TabItem item={tabList[0]} />
          <TabItem item={tabList[1]} />
          <TabItem item={tabList[2]} />
        </View>
        <PagerView
          ref={pagerRef}
          style={{
            flex: 1,
          }}
          initialPage={selectedPage}
          onPageSelected={(position) => {
            setSelectedPage(position.nativeEvent.position);
            setTab(tabList[position.nativeEvent.position]);
          }}
        >
          <View>
            <EventList />
          </View>
          <View>
            <Text>School Activities</Text>
          </View>
          <View>
            <ManagementList />
          </View>
        </PagerView>
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  tabView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 8,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  tabItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 16,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
});
