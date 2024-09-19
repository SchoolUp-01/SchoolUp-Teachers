import React, { useEffect, useRef, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Container, ContentView } from "../components/styledComponents";
import StatusTab from "../components/StatusTab";
import CustomStatusBarView from "../components/CustomStatusBarView";
import CurrentTimeTableView from "../components/CurrentTimeTableView";
import { useNavigation } from "@react-navigation/native";
import Teacher from "../state/TeacherManager";
import * as NavigationBar from "expo-navigation-bar";

import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import HomeScreenShimmer from "../components/Shimmers/HomeScreenShimmer";
import TeachersDetailsTab from "../components/TeachersDetailsTab";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryText,
  primaryColor_800,
  primaryColor_300,
} from "../utils/Color";
import { ActionData } from "../utils/ActionData";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PagerView from "react-native-pager-view";
import ConversationList from "../components/ConversationList";
import MyClassesTab from "../components/MyClassesTab";
import ProfileTab from "../components/ProfileTab";
import { supabase } from "../backend/supabaseClient";
const { width } = new Dimensions.get("screen");
const HomeScreen = () => {
  const navigation = useNavigation();
  const [teacherInfo, setTeacherInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPage, setSelectedPage] = useState(0);
  const [notificationCount, setNotificationCount] = useState(null);
  const pagerRef = useRef();

  useFocusEffect(
    React.useCallback(() => {
      setTeacherInfo(Teacher.shared.getTeacherInfo());
      if (teacherInfo !== null && loading) {
        setLoading(false);
      } else {
        supabase_api.shared
          .getTeacherInfo()
          .then((res) => {
            setTeacherInfo(res);
            Teacher.shared.setTeacherInfoComplete(res);
          })
          .catch((error) => {
            ErrorLogger.shared.ShowError("HomeScreen: getTeacherInfo: ", error);
          })
          .finally(() => setLoading(false));
      }
    }, [])
  );

  useEffect(() => {
    LogBox.ignoreLogs([
      /VirtualizedLists should never be nested inside plain ScrollViews/,
    ]);
    setNavigationBar();
    const handleTeacherDataUpdate = (newData) => {
      setTeacherInfo(newData);
    };

    Teacher.shared.subscribe(handleTeacherDataUpdate);

    return () => {
      Teacher.shared.unsubscribe(handleTeacherDataUpdate);
    };
  }, []);

  useEffect(() => {
    //get current statistics
    getNotificationInfo();
    //start listener

    const teacherNotificationInfo = supabase
      .channel("notification-listener-channel")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "teacher_notification_info",
          filter: "id=eq."+supabase_api.shared.uid,
        },
        (payload) => {
          setNotificationCount(payload?.new);
        }
      )
      .subscribe();
    return () => {
      //remove listener
    };
  }, []);

  const getNotificationInfo = () => {
    supabase_api.shared
      .getTeacherNotificationInfo()
      .then((data) => {
        setNotificationCount(data);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "HomeScreen: getNotificationInfo: ",
          error
        );
      });
  };

  const setNavigationBar = () => {
    if (Platform.OS == "android") NavigationBar.setBackgroundColorAsync("#fff");
  };

  const MenuTitle = ({ title }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.label}>{title}</Text>
      </View>
    );
  };

  const MenuItem = ({ item, color = primaryColor, value = -1 }) => {
    const { icon, label, screen, materialIcon = false } = item;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("ActionStack", { screen: screen });
        }}
      >
        <View
          style={{
            flexShrink: 1,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 8,
            width: (width - 64) / 4,
            // height: (width)/4,
            marginBottom: 16,
          }}
        >
          {value > 0 && (
            <View
              style={{
                position: "absolute",
                end: 4,
                top: -8,
                borderRadius: 24,
                backgroundColor: color,
                minWidth: 24,
                minHeight: 24,
                alignItems: "center",
                justifyContent: "center",
                borderColor: "#fff",
                borderWidth: 4,
                zIndex: 1,
              }}
            >
              <Text
                style={{
                  color: "#fff",
                  fontSize: 12,
                  fontStyle: "normal",
                  fontWeight: "bold",
                }}
              >
                {value}
              </Text>
            </View>
          )}
          <View
            style={[styles.iconContainer, { backgroundColor: color + "2a" }]}
          >
            {materialIcon ? (
              <MaterialIcons
                style={[{ justifyContent: "center", alignSelf: "center" }]}
                name={icon}
                color={color}
                size={20}
              />
            ) : (
              <Feather
                style={[{ justifyContent: "center", alignSelf: "center" }]}
                size={20}
                color={color}
                name={icon ?? ""}
              />
            )}
          </View>
          <Text style={[styles.subLabel]} numberOfLines={2}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <HomeScreenShimmer />;
    } else {
      return (
        <ScrollView
          contentContainerStyle={{ paddingVertical: 8 }}
          nestedScrollEnabled
        >
          <TeachersDetailsTab info={null} />
          <CurrentTimeTableView />
          <MenuTitle title={"Actions"} />
          <ScrollView
            contentContainerStyle={{
              flexDirection: "row",
              flexWrap: "wrap",
              marginTop: 8,
              paddingVertical: 4,
            }}
          >
            <MenuItem item={ActionData[18]} color={"#f74c06"} value={0} />
            <MenuItem
              item={ActionData[19]}
              color="#b330e1"
              value={notificationCount?.leave_request}
            />
            <MenuItem
              item={ActionData[20]}
              color="#f0073b"
              value={notificationCount?.parent_concern}
            />
            <MenuItem
              item={ActionData[3]}
              color="#e20b8c"
              value={notificationCount?.academic_report}
            />
            <MenuItem item={ActionData[4]} color={"#688d15"} value={0} />
            <MenuItem item={ActionData[15]} color={"#074170"} value={0} />
            <MenuItem item={ActionData[16]} color="#0968e5" value={0} />
            <MenuItem item={ActionData[17]} color="#ffb902" value={0} />
          </ScrollView>
        </ScrollView>
      );
    }
  };

  const BottomItem = ({ icon, label, page }) => {
    return (
      <TouchableOpacity
        style={{ flex: 1, alignItems: "center" }}
        onPress={() => pagerRef.current.setPage(page)}
      >
        <View>
          <MaterialIcons
            style={[{ justifyContent: "center", alignSelf: "center" }]}
            size={24}
            color={selectedPage === page ? primaryColor : primaryText}
            name={icon ?? ""}
          />
          <Text
            style={[
              styles.bottomLabel,
              {
                color: selectedPage === page ? primaryColor : primaryText,
                fontFamily: selectedPage === page ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderBottomBar = () => {
    return (
      <View style={styles.bottomBar}>
        <BottomItem label="Home" icon="home" page={0} />
        <BottomItem label="Inbox" icon="inbox" page={1} />
        <BottomItem label="Classes" icon="class" page={2} />
        <BottomItem label="Me" icon="account-circle" page={3} />
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ContentView>
        <PagerView
          scrollEnabled={false}
          ref={pagerRef}
          style={{
            flex: 1,
          }}
          initialPage={selectedPage}
          onPageSelected={(position) => {
            setSelectedPage(position.nativeEvent.position);
          }}
        >
          <View key={1}>
            <StatusTab />
            {renderContent()}
          </View>
          <View key={2}>
            <ConversationList />
          </View>
          <View key={3}>
            <MyClassesTab />
          </View>
          <View key={4}>
            <ProfileTab />
          </View>
        </PagerView>
        {renderBottomBar()}
      </ContentView>
    </Container>
  );
};
export default React.memo(HomeScreen);

const styles = StyleSheet.create({
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    paddingVertical: 12,
    marginHorizontal: 16,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    color: primaryText,
    fontWeight: "500",
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
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
    fontSize: 14,
    color: primaryText,
    marginTop: 8,
    fontFamily: "RHD-Medium",
    flexShrink: 1,
    textAlign: "center",
  },
  bottomBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // backgroundColor: primaryColor_300,
    // height: 56,
    borderTopWidth: borderWidth,
    borderColor: borderColor,
    paddingVertical: 12,
  },
  bottomLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 4,
    textAlign: "center",
  },
});
