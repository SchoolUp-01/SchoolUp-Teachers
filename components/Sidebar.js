import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableHighlight,
  LogBox,
} from "react-native";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { Feather } from "@expo/vector-icons";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import SidebarStudentList from "./SidebarStudentList";
import { primaryColor, underlayColor } from "../utils/Color";

const Sidebar = ({ navigation }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    LogBox.ignoreLogs([
      /VirtualizedLists should never be nested inside plain ScrollViews/,
    ]);
    getUser();
  }, []);

  const getUser = () => {
    if(user === null ){
      supabase_api.shared
      .getParentInfo(
        supabase_api.shared.uid,
        "id,name,avatar,children_list,email_id,phone_number"
      )
      .then((ref) => {
        setUser(ref);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("Sidebar: getUser: ", error);
      });
    }
  };

  const navigateToProfile = () => {
    navigation.navigate("ProfileStack", {
      screen: "ParentScreen",
      params: {
        user: user,
      },
    });
  };

  return (
    // <DrawerContentScrollView
    //   contentContainerStyle={{
    //     backgroundColor: "#FFFFFF",
    //     flexGrow: 1,
    //   }}
    // >
    //   <View>

    //     <View
    //       style={{
    //         flex: 1,
    //         paddingHorizontal: 16,
    //         justifyContent: "space-between",
    //       }}
    //     >
    //       <SidebarStudentList />

    //     </View>

    //   </View>
    // </DrawerContentScrollView>
    <DrawerContentScrollView
      contentContainerStyle={{
        backgroundColor: "#FFFFFF",
        flexGrow: 1,
        justifyContent: "space-between", // To space content vertically
      }}
    >
      <View>
        {user ? (
            <View style={styles.profileContainer}>
              <TouchableOpacity onPress={navigateToProfile}>
                <Image
                  style={styles.profile}
                  source={{
                    uri: user?.avatar,
                  }}
                  defaultSource={require("../assets/DefaultImage.jpg")}
                />
              </TouchableOpacity>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.userEmail}>{user?.email_id}</Text>
              </View>
            </View>
        ) : (
          // Shimmer or Placeholder when user info is loading
          <View style={styles.placeholderContainer}>
            {/* Shimmer or Placeholder UI */}
          </View>
        )}
        <SidebarStudentList />
      </View>

      <TouchableHighlight
        activeOpacity={0.95}
        underlayColor={underlayColor}
        style={styles.settingsButton}
        onPress={() =>
          navigation.navigate("SettingStack", {
            screen: "SettingsScreen",
            params: { user: user },
          })
        }
      >
        <View style={styles.item}>
          <Feather name="settings" size={24} color="#000000" />
          <Text style={styles.label}>Settings</Text>
        </View>
      </TouchableHighlight>
    </DrawerContentScrollView>
  );
}

export default React.memo(Sidebar)

const styles = StyleSheet.create({
  profileContainer: {
    borderBottomColor: "#EDEDED",
    borderBottomWidth: 1,
    padding: 16,
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  profile: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  userInfo: {
    paddingLeft: 16,
    justifyContent: "center",
  },
  userName: {
    fontSize: 20,
    color: "#000",
    fontFamily: "RHD-Medium",
  },
  userEmail: {
    fontSize: 14,
    color: "#888888",
    fontFamily: "RHD-Medium",
  },
  placeholderContainer: {
    padding: 8,
    paddingTop: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderColor: "#EDEDED",
  },settingsButton: {
    borderTopWidth: 1,
    borderTopColor: "#EDEDED",
    paddingBottom: 4,
    justifyContent: "flex-end",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 24,
    height: 48,
  },
  label: {
    color: "#000000",
    flex: 1,
    fontSize: 16,
    fontFamily: "RHD-Medium",
    marginLeft: 8,
  },
});
