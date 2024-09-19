import React, { useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Container,
  MenuItem,
  Title,
  Toolbar,
} from "../../components/styledComponents";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../../utils/Color";
import CustomStatusBarView from "../../components/CustomStatusBarView";
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../../backend/supabaseClient";
import { ConfirmSignOutDialog } from "../../components/Modals";
import Teacher from "../../state/TeacherManager";
const { width, height } = new Dimensions.get("screen");
export default function SettingsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [user, setUser] = useState(route.params.user);
  const [showDialog, setShowDialog] = useState(false);

  const handleSignOut = () => {
   Teacher.shared.setTeacherID(null);
   Teacher.shared.setTeacherInfoComplete(null);
    AsyncStorage.clear();
    supabase.auth.signOut().finally(() => {
      setShowDialog(false);
    });
  };

  const SettingItem = ({ icon, label, screen, subtext, border }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (label === "Sign out") {
            setShowDialog(true);
          } else {
            navigation.navigate("SettingStack", { screen });
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottomWidth: border ? borderWidth : 0,
            borderColor: borderColor,
            paddingVertical: 8,
            flexShrink: 1,
            paddingVertical: 12,
          }}
        >
          <Text style={styles.subLabel}>{label}</Text>
          <View style={{ flexDirection: "row" }}>
            <Text>{subtext}</Text>
            <Feather name="chevron-right" size={20} color={secondaryText} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container style={{ backgroundColor: primaryColor_50 }}>
      <CustomStatusBarView
        backgroundColor={primaryColor_50}
        bar-style="light-content"
      />
      <ConfirmSignOutDialog
        isVisible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleSignOut}
      />
      <Toolbar>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryText} />
        </MenuItem>
        <Title style={{ start: width / 2 - 40 }}>Settings</Title>
      </Toolbar>
      <Text style={styles.settingText}>Account</Text>
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          defaultSource={require("../../assets/DefaultImage.jpg")}
          source={{ uri: user?.avatar }}
        ></Image>
        <View style={styles.middleView}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              fontFamily: "RHD-Bold",
            }}
          >
            {user?.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              fontFamily: "RHD-Medium",
              color: secondaryText,
            }}
          >
            {user?.email_id}
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              fontFamily: "RHD-Medium",
              color: secondaryText,
            }}
          >
            {user?.phone_number}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ProfileStack", {
              screen: "EditProfileScreen",
              params: {
                user: user,
              },
            });
          }}
        >
          <View
            style={{
              backgroundColor: primaryColor_50,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                lineHeight: 18,
                color: primaryColor_800,
                fontFamily: "RHD-Medium",
              }}
            >
              Edit Profile
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <Text style={styles.settingText}>App Settings</Text>
      <View style={styles.itemContainer}>
        <SettingItem icon={"bell"} label={"Notification"} border={true} />
        <SettingItem
          icon={"bell"}
          label={"Text Size"}
          subtext={"medium"}
          border={true}
        />
        <SettingItem icon={"bell"} label={"Statistics"} />
      </View>
      <Text style={styles.settingText}>Support</Text>
      <View style={styles.itemContainer}>
        <SettingItem icon={"bell"} label={"Help"} border={true} screen="HelpScreen"/>
        <SettingItem icon={"bell"} label={"Terms of service"} border={true} screen="TermsOfServiceScreen"/>
        <SettingItem icon={"bell"} label={"Privacy Policy"} border={true} screen="PrivacyPolicyScreen"/>
        <SettingItem icon={"bell"} label={"About us"} screen="AboutUsScreen"/>
      </View>

      <View style={styles.itemContainer}>
        <SettingItem icon={"bell"} label={"Sign out"} />
      </View>
      <View
        style={{
          alignSelf: "center",
          marginVertical: 16,
        }}
      >
        <Text
          style={{
            alignSelf: "center",
            fontSize: 16,
            fontFamily: "RHD-Medium",
            lineHeight: 24,
            color: primaryColor,
          }}
        >
          SchoolUp v1.0.1
        </Text>

        <Text
          style={{
            alignSelf: "center",
            fontSize: 14,
            fontFamily: "RHD-Medium",
            lineHeight: 21,
            color: secondaryText,
          }}
        >
          Made with ❤️ in 🇮🇳
        </Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontFamily: "RHD-Medium",
    fontSize: 20,
    lineHeight: 30,
    marginTop: 8,
    alignSelf: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    backgroundColor: primaryColor_50,
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
    fontSize: 16,
    color: primaryText,
    fontFamily: "RHD-Medium",
    flexShrink: 1,
    textAlign: "center",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 30,
    alignSelf: "center",
    backgroundColor: defaultImageBgColor,
    borderWidth: borderWidth,
    borderColor: borderColor,
  },
  middleView: {
    marginHorizontal: 20,
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },
  settingText: {
    marginHorizontal: 20,
    marginTop: 12,
    fontFamily: "RHD-Medium",
    color: primaryColor_800,
    fontSize: 16,
    lineHeight: 24,
  },
});
