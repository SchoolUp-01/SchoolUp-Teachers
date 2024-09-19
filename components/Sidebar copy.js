import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableHighlight,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import {
  backgroundColor,
  defaultImageBgColor,
  primaryText,
  secondaryText,
  underlayColor,
  primaryColor,
  buttonText,
  borderColor,
  borderWidth,
  itemColor,
  itemBorder,
  primaryColor_800,
} from "../utils/Color";
import { InputTitle } from "./styledComponents";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import SidebarStudentList from "./SidebarStudentList";

var user = null;
var statistics = null;
var view = null;
var selectedPage = "ChallengeScreen";

export default class Sidebar extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = () => {
    supabase_api.shared
      .getParentInfo(
        supabase_api.shared.uid,
        "id,name,avatar,children_list,email_id"
      )
      .then((ref) => {
        user = ref;
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("Sidebar: getUser: ", error);
      });
    return null;
  };

  render() {
    return (
      <DrawerContentScrollView
        {...this.props}
        contentContainerStyle={{
          backgroundColor: backgroundColor,
          flexGrow: 1,
        }}
      >
        {user !== null ? (
          <View ref={(ref) => (view = ref)}>
            <View
              style={{
                flex: 1,
                borderBottomColor: borderColor,
                borderBottomWidth: borderWidth,
                paddingHorizontal: 24,
                marginTop: 24,
              }}
              ref={(ref) => (view = ref)}
            >
              <View
                style={{
                  flex: 1,
                  alignItems: "flex-start",
                }}
              >
                <TouchableOpacity
                  style={{ marginBottom: 16 }}
                  onPress={() => {
                    this.props.navigation.navigate("ProfileStack", {
                      screen: "ParentScreen",
                      params: {
                        user: user,
                      },
                    });
                  }}
                >
                  <Image
                    style={[
                      styles.profile,
                      { width: 64, height: 64, alignSelf: "center" },
                    ]}
                    source={{ uri: user?.avatar }}
                    defaultSource={require("../assets/DefaultImage.jpg")}
                  />
                </TouchableOpacity>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 24,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: "column" }}>
                      <Text
                        style={{
                          fontSize: 20,
                          color: primaryText,
                          fontFamily: "RHD-Medium",
                        }}
                      >
                        {user?.name}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          color: secondaryText,
                          fontFamily: "RHD-Medium",
                        }}
                      >
                        {user?.email_id}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={{
                      alignSelf: "center",
                    }}
                    onPress={() => {
                      this.props.navigation.navigate("ProfileStack", {
                        screen: "ParentScreen",
                        params: {
                          user: user,
                        },
                      });
                    }}
                  >
                    <Feather
                      name="chevron-right"
                      size={24}
                      color={secondaryText}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              padding: 8,
              paddingTop: 24,
              paddingBottom: 24,
              borderBottomWidth: borderWidth,
              borderColor: borderColor,
            }}
          >
            {/* <View style={{ flexDirection: "row", marginStart: 8 }}>
              <Shimmer width={36} height={36} borderRadius={50} />
              <View>
                <Shimmer width={140} height={18} marginStart={8} />
                <Shimmer
                  width={120}
                  height={16}
                  marginTop={4}
                  marginStart={8}
                />
              </View>
            </View> */}
            <View
              style={{ flexDirection: "row", marginTop: 16, marginStart: 8 }}
            >
              {/* <Shimmer width={100} height={20} />
              <Shimmer width={100} height={20} marginStart={16} /> */}
            </View>
          </View>
        )}
        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            flex: 1,
          }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 8,
            }}
          >
            <SidebarStudentList />
            <TouchableOpacity
              style={{ borderRadius: 24, backgroundColor: primaryColor_800 }}
              onPress={() => this.props.navigation.navigate("SelectSchoolScreen")}
            >
              <Text
                style={{
                  paddingHorizontal: 24,
                  borderRadius: 24,
                  paddingVertical: 12,
                  fontFamily: "RHD-Bold",
                  color: "#fff",
                  flexShrink: 1,
                }}
              >
                Add Children
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableHighlight
            activeOpacity={0.95}
            underlayColor={underlayColor}
            style={{
              borderTopWidth: borderWidth,
              borderTopColor: borderColor,
              paddingBottom: 4,
            }}
            onPress={() => {
              this.props.navigation.navigate("SettingStack", {
                screen: "SettingsScreen",
                params: { user: user },
              });
            }}
          >
            <View style={styles.item}>
              <Feather
                style={styles.iconContainer}
                size={24}
                name="settings"
                color={secondaryText}
              />
              <Text style={styles.label}>Settings</Text>
            </View>
          </TouchableHighlight>
        </View>
      </DrawerContentScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexShrink: 1,
    flexGrow: 1,
  },
  profile: {
    borderRadius: 50,
    borderWidth: itemBorder,
    borderColor: defaultImageBgColor,
    backgroundColor: defaultImageBgColor,
  },
  name: {
    color: "#000",
    fontSize: 20,
    fontWeight: "800",
    marginVertical: 8,
  },
  follower: {
    color: "rgba(0, 0, 0, 0.8)",
    fontSize: 13,
    marginRight: 4,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingStart: 24,
    height: 48,
  },
  selectedItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CD9641a",
    paddingStart: 24,
    height: 48,
  },
  itemMain: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  label: {
    color: primaryText,
    flexGrow: 1,
    fontSize: 16,
    fontFamily: "RHD-Medium",
  },
  selectedlabel: {
    color: primaryColor,
    flexGrow: 1,
    fontSize: 16,
    fontFamily: "RHD-Bold",
  },
  iconContainer: {
    marginEnd: 16,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: 24,
    height: 24,
  },
  itemMain: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    justifyContent: "space-between",
  },
  drawerItem: {
    overflow: "hidden",
    borderTopEndRadius: 24,
    borderBottomEndRadius: 24,
    marginEnd: 24,
    height: 48,
  },
});
