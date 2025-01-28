import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  FlatList,
  Text,
  Image,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryText,
  primaryColor,
  underlayColor,
  defaultImageBgColor,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../backend/supabase_api";
const { width, height } = new Dimensions.get("screen");
import EmptyState from "./EmptyState";
import ErrorLogger from "../utils/ErrorLogger";
import moment from "moment";
import { Feather } from "@expo/vector-icons";
import { Title, Toolbar } from "./styledComponents";
import Avatar from "./Avatar";
import TeacherSubjectList from "./TeacherSubjectList";
import PagerView from "react-native-pager-view";
import CommunityTab from "./CommunityTab";

export default function ConversationList() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [conversationList, setConversationList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const tabList = ["Direct", "Community"];
  const [tab, setTab] = useState("Direct");
  const pagerRef = useRef();
  const [selectedPage, setSelectedPage] = useState(0);

  useEffect(() => {
    supabase_api.shared
      .getConversationInformation()
      .then((res) => {
        setConversationList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ConversationList: getSchoolConversationInformation: ",
          error
        );
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  const ConversationItem = ({ item }) => {
    if (!item) return null;
    const {
      id,

      message_info: { message, team_id },
      parent_info: { avatar, name },
      updated_on: updatedOn,
    } = item;

    return (
      <TouchableHighlight
        style={{ marginBottom: 8, paddingVertical: 6 }}
        activeOpacity={0.95}
        underlayColor={underlayColor}
        onPress={() =>
          navigation.navigate("ActionStack", {
            screen: "ParentsCommunicationScreen",
            params: {
              parentInfo: item.parent_info,
              conversationID: id,
              conversation: item,
            },
          })
        }
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            width: width,
            height: 52,
            paddingHorizontal: 16,
          }}
        >
          <Avatar width={48} height={48} user={item.parent_info} />
          <View style={{ flex: 1, justifyContent: "center", marginStart: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily: "RHD-Medium",
                  textTransform: "capitalize",
                  color: primaryText,
                }}
              >
                {name}
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "RHD-Regular",
                  color: secondaryText,
                }}
              >
                {moment(updatedOn).calendar()}
              </Text>
            </View>
            <Text
              style={{
                fontSize: 14,
                fontFamily: "RHD-Regular",
              }}
              numberOfLines={1}
            >
              {team_id === supabase_api.shared.uid ? "You: " : ""}
              {message}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  };

  const renderEmpty = () => {
    if (!loading && conversationList?.length == 0) {
      return (
        <EmptyState
          title="Nothing here"
          description={"Start a conversation with parents and you'll see here"}
          animation={require("../assets/animations/no-chat.json")}
          primaryButtonText={"Start New Conversation"}
          primaryOnClick={() => navigation.navigate("TeachersScreen")}
        />
      );
    } else {
      return <View></View>;
    }
  };

  const renderToolBar = () => {
    return (
      <Toolbar>
        <Title
          style={{
            position: "relative",
            start: 16,
            fontSize: 20,
            lineHeight: 27,
            fontFamily: "RHD-Bold",
            letterSpacing: 0.5,
            color: primaryText,
          }}
        >
          Inbox
        </Title>
        <TouchableOpacity
          style={{
            marginEnd: 16,
            alignSelf: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("AddEventScreen");
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "RHD-Bold",
              color: primaryColor,
            }}
          >
            + New Conversation
          </Text>
        </TouchableOpacity>
      </Toolbar>
    );
  };

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

  const renderHeader = useCallback(() => {
    if (conversationList.length == 0) return null;
    return (
      <View style={styles.searchView}>
        <Feather name="search" size={16} color={secondaryText} />
        <TextInput
          style={styles.searchInput}
          selectionColor={primaryColor}
          placeholder="Search students or parents"
          onChangeText={(search) => setSearchText(search)}
          value={searchText}
          autoCapitalize="none"
        />
        {searchText?.length !== 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Feather name="x" size={16} color={secondaryText} />
          </TouchableOpacity>
        )}
      </View>
    );
  }, [searchText, conversationList]);

  return (
    <View style={{ flex: 1 }}>
      {renderToolBar()}
      <View style={styles.tabView}>
        <TabItem item={"Direct"} />
        <TabItem item={"Community"} />
      </View>

      <PagerView
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={selectedPage}
        onPageSelected={(position) => {
          setSelectedPage(position.nativeEvent.position);
          setTab(tabList[position.nativeEvent.position]);
        }}
      >
        <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={conversationList}
          renderItem={({ item }) => <ConversationItem item={item} />}
          keyExtractor={(item, index) => String(index)}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          ListHeaderComponent={<View>{renderHeader()}</View>}
        />
        <View style={{ flex: 1 }}>
          <CommunityTab />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  toolbarView: {
    marginHorizontal: 16,
    paddingBottom: 16,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  headerText: {
    fontFamily: "RHD-Medium",
    fontSize: 20,
    lineHeight: 30,
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
    fontSize: 16,
    marginHorizontal: 16,
  },
  tabView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
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
});
