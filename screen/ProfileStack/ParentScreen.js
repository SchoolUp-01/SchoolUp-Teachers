import React, { useEffect, useState } from "react";
import { Feather } from "@expo/vector-icons";
import {
  Container,
  ContentView,
  InputTitle,
  MenuItem,
  Title,
  Toolbar,
  ToolbarBorder,
} from "../../components/styledComponents";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor,
  primaryColor_300,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../../utils/Color";
import CustomStatusBarView from "../../components/CustomStatusBarView";
import {
  Image,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import supabase_api from "../../backend/supabase_api";
import ErrorLogger from "../../utils/ErrorLogger";
import SidebarStudentList from "../../components/SidebarStudentList";
import { LinearGradient } from "expo-linear-gradient";
import { BottomModal } from "../../components/Modals";
import { OptionsButton } from "../../components/Buttons";

export default function ParentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [user, setUser] = useState(route.params.user);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  useEffect(() => {
    supabase_api.shared
      .getParentInfo(supabase_api.shared.uid, "*")
      .then((res) => {
        setUser(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("ParentScreen: getParentInfo: ", error);
      });

    return () => {};
  }, []);

  const onEdit = () => {
    setModalVisible(false)
    navigation.navigate("EditProfileScreen", {
      user: user,
    });
  };

  const onManageChildren = () => {
    setModalVisible(false)
    navigation.navigate("ManageChildrenScreen", {
      user: user,
    });
  };

  const OptionItem = ({ item, icon }) => {
    return (
      <TouchableOpacity onPress={() => setType(item)}>
        <View style={[styles.feedItem]}>
          <Feather
            style={{ alignSelf: "center" }}
            name={icon}
            size={16}
            color={primaryText}
          />
          <Text style={[styles.tagText]}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Container>
      <BottomModal isVisible={modalVisible} onClose={toggleModal}>
        <OptionsButton
          icon="edit-2"
          name={"Edit Profile"}
          color={primaryText}
          callBack={onEdit}
        />
        <OptionsButton
          icon="users"
          name={"Manage Children "}
          color={primaryText}
          callBack={onManageChildren}
        />
      </BottomModal>
      <ImageBackground
        style={{
          width: "100%",
          height: 240,
          paddingTop: StatusBar.currentHeight ?? 36,
        }}
        source={require("../../assets/profile_bg.jpg")}
      >
        <Toolbar>
          <MenuItem onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" color={primaryText} size={24} />
          </MenuItem>
          <Title></Title>
          <MenuItem onPress={() => toggleModal()}>
            <Feather name="more-horizontal" color={primaryText} size={20} />
          </MenuItem>
        </Toolbar>
      </ImageBackground>
      <Image
        style={styles.avatar}
        defaultSource={require("../../assets/DefaultImage.jpg")}
        source={{ uri: user?.avatar }}
      ></Image>
      <Text
        style={{
          marginTop: 68,
          fontSize: 20,
          lineHeight: 30,
          fontFamily: "RHD-Bold",
          alignSelf: "center",
        }}
      >
        {user?.name}
      </Text>
      <View
        style={{
          flexShrink: 1,
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "center",
          marginTop: 16,
        }}
      >
        <OptionItem item={user?.phone_number} icon={"phone"} />

        <OptionItem item={user?.email_id} icon={"mail"} />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          alignSelf: "center",
          marginTop: 16,
          marginHorizontal: 16,
        }}
      >
        <TouchableOpacity
          onPress={onEdit}
          style={{
            flex: 1,
            height: 48,
            backgroundColor: primaryColor,
            paddingHorizontal: 16,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 80,
            marginEnd: 8,
          }}
        >
          <Text style={{ fontFamily: "RHD-Bold", color: "#fff" }}>
            Edit Profile
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onManageChildren}
          style={styles.secondaryButton}
        >
          <Text style={{ fontFamily: "RHD-Bold", color: primaryColor }}>
            Manage Children
          </Text>
        </TouchableOpacity>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  avatar: {
    position: "absolute",
    top: 160,
    width: 120,
    height: 120,
    marginTop: 16,
    borderRadius: 60,
    alignSelf: "center",
  },
  title: {
    fontFamily: "RHD-Medium",
    fontSize: 20,
    lineHeight: 30,
    marginTop: 8,
    alignSelf: "center",
  },
  subTitle: {
    fontSize: 14,
    color: secondaryText,
    fontFamily: "RHD-Medium",
    alignSelf: "center",
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

  middleView: {
    marginHorizontal: 20,
    flex: 1,
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
    marginBottom: 8,
    flexShrink: 1,
    // backgroundColor: itemColor,
  },
  tagText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  secondaryButton: {
    flex: 1,
    height: 48,
    borderColor: primaryColor,
    borderWidth: 1,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 80,
    marginEnd: 8,
  },
});
