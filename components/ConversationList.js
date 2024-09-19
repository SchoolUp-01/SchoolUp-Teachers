import React, { useEffect, useState, useCallback } from "react";
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
import {
  Title,
  ToolbarBorder,
} from "./styledComponents";

export default function ConversationList() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [conversationList, setConversationList] = useState([]);
  const [searchText, setSearchText] = useState("");

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
    if (item === null) return;
    const {
      id,
      last_message,
      last_uid,
      parent_info: { avatar: parentAvatar, name: parentName },
      teacher_info: { avatar: teacherAvatar, id: teacherId, name: teacherName },
      student_info: { avatar: studentAvatar, name: studentName },
      updated_on: updatedOn,
    } = item;
    let search = searchText.toLowerCase();
    let parentFiltered = parentName?.toLowerCase().includes(search);
    let studentFiltered = studentName?.toLowerCase().includes(search);
    let isVisible = parentFiltered || studentFiltered;
    if (!isVisible) return null;
    return (
      <TouchableHighlight
        style={{ marginBottom: 8, paddingVertical: 6, marginTop: 8 }}
        activeOpacity={0.95}
        underlayColor={underlayColor}
        onPress={() => {
          navigation.navigate("ActionStack", {
            screen: "ParentsCommunicationScreen",
            params: {
              teacherInfo: item?.teacher_info,
              parentInfo: item?.parent_info,
              studentInfo: item?.student_info,
              conversationID: id,
            },
          });
        }}
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
          <Image
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              marginRight: 16,
              backgroundColor: defaultImageBgColor,
              borderWidth: borderWidth,
              borderColor: borderColor,
              alignSelf: "center",
            }}
            source={{
              uri: parentAvatar,
            }}
            defaultSource={require("../assets/DefaultImage.jpg")}
          />

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignSelf: "center",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontFamily: "RHD-Medium",
                    textAlignVertical: "center",
                    color: primaryText,
                    textTransform: "capitalize",
                  }}
                >
                  {parentName + " (" + studentName + ")"}
                </Text>
              </View>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "RHD-Regular",
                  textAlignVertical: "center",
                  color: secondaryText,
                }}
              >
                {new Date().setHours(0, 0, 0, 0) -
                  new Date(updatedOn).setHours(0, 0, 0, 0) ==
                0
                  ? moment(updatedOn).format("LT")
                  : moment(updatedOn).format("ll")}
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "RHD-Regular",
                }}
                numberOfLines={1}
              >
                {last_uid === supabase_api.shared.uid ? "You: " : ""}
                {last_message}
              </Text>

              {/* <View
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 10,
                      backgroundColor: primaryColor,
                      alignSelf: "flex-end",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Text
                        style={{
                          color: "#fff",
                          fontFamily: "RHD-Medium",
                          fontSize: 10,
                        }}
                      >
                        {this.props.item?.unread_count}
                      </Text>
                  </View> */}
            </View>
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
      <ToolbarBorder>
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
      </ToolbarBorder>
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
    </View>
  );
}

const styles = StyleSheet.create({
  toolbarView: {
    marginHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
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
});
