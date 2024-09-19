import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import { MenuItem, Title, Toolbar, ToolbarBorder } from "./styledComponents";
import { useNavigation } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import Teacher from "../state/TeacherManager";
import { useRef, useState } from "react";
import PagerView from "react-native-pager-view";
const { width, height } = new Dimensions.get("screen");
export default function ProfileTab() {
  const navigation = useNavigation();
  const [tab, setTab] = useState("Classes");
  const [selectedPage, setSelectedPage] = useState(0);
  const pagerRef = useRef();
  const tabList = ["Classes", "Subjects"];
  const [user, setUser] = useState(Teacher.shared.getTeacherInfo());
  const TabItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.tabItem,
          {
            borderColor: item == tab ? primaryColor : borderColor,
            borderBottomWidth: item == tab ? 1 : 0,
          },
        ]}
        onPress={() => {
          pagerRef.current.setPage(tabList.indexOf(item));
        }}
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
      </TouchableOpacity>
    );
  };

  const InformationItem = ({ label, description, icon, color }) => {
    return (
      <TouchableOpacity>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginVertical: 8,
            flexDirection: "row",
            alignItems: "center",
            width: width / 2 - 32,
            backgroundColor: color+"2a",
            borderRadius: 8,
            height: 144,
          }}
        >
          <View style={{ justifyContent: "center" }}>
            <MaterialIcons name={icon} size={24} color={color} />
            <Text
              style={{
                fontFamily: "RHD-Medium",
                fontSize: 18,
                lineHeight: 27,
                marginTop: 8,
              }}
            >
              {label}
            </Text>
            <Text
              style={{
                fontFamily: "RHD-Regular",
                fontSize: 14,
                lineHeight: 21,
                marginStart: 2,
              }}
            >
              {description}
            </Text>
          </View>
          {/* <View style={{ marginStart: 16,flex:1,justifyContent:'center',alignItems:"flex-end" }}>
            <Text style={{borderRadius:40,padding:8,borderColor: borderColor,borderWidth:borderWidth}}>65</Text>
          </View> */}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
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
          My Profile
        </Title>
        <MenuItem
            onPress={() => {
              navigation.navigate("SettingStack", {
                screen: "SettingsScreen",
                params: {
                  user: Teacher.shared.getTeacherInfo(),
                },
              });
            }}
          >
            <Feather
              style={{ alignSelf: "center" }}
              name="settings"
              size={20}
              color={"#000"}
            />
          </MenuItem>
      </Toolbar>

      <View style={{ flex: 1 }}>
        <View style={styles.container}>
          <Image
            style={styles.avatar}
            defaultSource={require("../assets/DefaultImage.jpg")}
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
              {user?.email_id ?? "AshaPatil@gmail.com"}
            </Text>
            <Text
              style={{
                fontSize: 12,
                lineHeight: 18,
                fontFamily: "RHD-Medium",
                color: secondaryText,
              }}
            >
              {user?.phone_number ?? "9732232321"}
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
        <Text
          style={{
            marginHorizontal: 16,
            marginTop: 16,
            marginBottom: 8,
            fontFamily: "RHD-Medium",
            fontSize: 16,
            lineHeight: 24,
          }}
        >
          Information & Assistance
        </Text>
        <View
          style={{
            flexWrap: "wrap",
            flexDirection: "row",
            marginHorizontal: 16,
            justifyContent: "space-between",
          }}
        >
          <InformationItem
            label={"Clock in"}
            description={"You can clock-in from here"}
            icon={"location-on"}
            color={"#b330e1"}
          />
          <InformationItem
            label={"Apply Leave"}
            description={"Apply for your next leave here"}
            icon={"flight-takeoff"}
            color={"#0968e5"}
          />
          <InformationItem
            label={"Raise a concern"}
            description={"Raise an issue with school administration"}
            icon={"report-problem"}
            color={"#e20b8c"}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 8,
    borderWidth: borderWidth,
    borderColor: borderColor,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 18,
    backgroundColor: defaultImageBgColor,
  },
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
    paddingVertical: 6,
    borderRadius: 16,
    flex: 1,
    alignItems: "center",
    // backgroundColor: itemColor,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
    textAlignVertical: "center",
    textAlign: "center",
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
});
