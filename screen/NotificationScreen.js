import React, { useRef, useState } from "react";

import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  Toolbar,
  ToolbarBorder,
} from "../components/styledComponents";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import PagerView from "react-native-pager-view";
import ConversationList from "../components/ConversationList";
export default function NotificationScreen() {
  const navigation = useNavigation();
  const [selectedTag, setSelectedTag] = useState("All");
  const [tab, setTab] = useState("General");
  const [selectedPage, setSelectedPage] = useState(0);
  const pagerRef = useRef();
  const tabList = ["General", "Messages"];

  const TabItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ alignSelf: "center", justifyContent: "center", flex: 1 }}
        onPress={() => {
          pagerRef.current.setPage(tabList.indexOf(item));
        }}
      >
        <View
          style={[
            styles.tabItem,
            {
              borderColor: item == tab ? primaryColor : borderColor,
              borderBottomWidth: item == tab ? 1 : 0,
            },
          ]}
        >
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
        </View>
      </TouchableOpacity>
    );
  };

  const OptionItem = ({ item }) => {
    return (
      <View
        style={[
          styles.feedItem,
          {
            backgroundColor: item == selectedTag ? primaryColor : itemColor,
          },
        ]}
      >
        <TouchableOpacity onPress={() => setSelectedTag(item)}>
          <Text
            style={[
              styles.tagText,
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

  const AnnouncementItem = ({
    title,
    announcer,
    icon,
    caption,
    actionText,
  }) => {
    return (
      <View style={styles.announcementView}>
        <View style={styles.titleView}>
          <View style={{ flexShrink: 1, marginEnd: 16 }}>
            <Text style={styles.title} numberOfLines={2}>
              {title}
            </Text>
            <Text style={styles.description}>{announcer}</Text>
          </View>
          <TouchableOpacity>
            <Feather name={icon} size={24} color={primaryText} />
          </TouchableOpacity>
        </View>
        <Text style={styles.caption}>{caption}</Text>
        <View style={styles.actionView}>
          <Text style={styles.actionText}>{actionText}</Text>
          <Feather name="chevron-right" size={24} color={primaryColor_50} />
        </View>
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <Title>Notification</Title>
      </ToolbarBorder>
      <ContentView>
        <ScrollView>
          <View
            style={{
              flexDirection: "row",
              marginTop: 16,
              paddingHorizontal: 16,
              marginBottom: 8,
            }}
          >
            <OptionItem item={"All"} />
            <OptionItem item={"Action Needed"} />
            <OptionItem item={"Announcement"} />
          </View>
          <AnnouncementItem
            title={"Annual Cultural Fest - Save the Date!"}
            announcer={"Administration • 1 days ago"}
            icon={"calendar"}
            caption={
              "We are thrilled to announce our upcoming Annual Cultural Fest scheduled for 3rd December 2023. Join us for a day filled with music, dance, and artistic displays by our talented students."
            }
            actionText={"Add to calendar"}
          />
          <AnnouncementItem
            title={"Mid-term Examination Timetable - Grade 8"}
            announcer={"Asha Bhosle • Class Teacher • 15 mins ago"}
            icon={"calendar"}
            caption={
              "Attached is the timetable for the upcoming mid-term examinations. Please ensure thorough preparation and refer to the guidelines provided to excel in your exams. All the best!"
            }
            actionText={"View Time table"}
          />
          <AnnouncementItem
            title={"Parent-Teacher Conferences - Book Your Slot"}
            announcer={"Asha Bhosle • Class Teacher • 2 days ago"}
            icon={"users"}
            caption={
              "Our upcoming Parent-Teacher Conferences are scheduled for 14th December 2023. Please book your appointment slots through the SchoolUpp app."
            }
            actionText={"Book your slot"}
          />
        </ScrollView>
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  tagText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  feedItem: {
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
  caption: {
    marginVertical: 8,
    fontSize: 14,
    color: primaryText,
    lineHeight: 21,
    fontFamily: "RHD-Medium",
  },
  announcementView: {
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderColor: borderColor,
    borderWidth: borderWidth,
  },
  titleView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginEnd: 16,
  },
  title: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "RHD-Medium",
    color: secondaryText,
  },
  actionView: {
    backgroundColor: primaryColor_800,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignItems: "center",
    marginVertical: 8,
  },
  actionText: {
    fontFamily: "RHD-Medium",
    color: primaryColor_50,
    fontSize: 16,
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
});
