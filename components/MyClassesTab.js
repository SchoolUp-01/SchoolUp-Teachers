import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  FlatList,
} from "react-native";
import { MenuItem, Title, Toolbar, ToolbarBorder } from "./styledComponents";
import { useNavigation } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import Teacher from "../state/TeacherManager";
import { useEffect, useRef, useState } from "react";
import PagerView from "react-native-pager-view";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import TeacherSubjectList from "./TeacherSubjectList";

export default function MyClassesTab() {
  const navigation = useNavigation();
  const [tab, setTab] = useState("Classes");
  const [selectedPage, setSelectedPage] = useState(0);
  const pagerRef = useRef();
  const tabList = ["Classes", "Subjects"];
  const [loading, setLoading] = useState(false);
  const [classList, setClassesList] = useState([]);

  useEffect(() => {
    setLoading(true);
    supabase_api.shared
      .getAllClasses()
      .then((res) => {
        setClassesList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("MyClassesTab: getAllClasses: ", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => {};
  }, []);

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

  const ClassItem = ({ item }) => {
    const { id, standard, section, student_count } = item;
    return (
      <TouchableOpacity disabled>
        <View
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            marginVertical: 8,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Image
            style={{
              width: 120,
              height: 80,
              borderRadius: 4,
              alignSelf: "center",
            }}
            source={{
              uri: "https://t4.ftcdn.net/jpg/04/94/66/87/240_F_494668734_88x2VsluK9x67wayJwMsthjpBB4oCgUn.jpg",
            }}
          />
          <View style={{ marginHorizontal: 16, justifyContent: "center" }}>
            <Text
              style={{ fontFamily: "RHD-Bold", fontSize: 18, lineHeight: 27 }}
            >
              Grade {standard}, Section {section}
            </Text>
            <Text
              style={{
                fontFamily: "RHD-Medium",
                fontSize: 14,
                lineHeight: 21,
                marginStart: 2,
                color: secondaryText,
              }}
            >
              {student_count} Students
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("ActionStack", {
                  screen: "ManageClassroomScreen",
                  params: { item: item },
                })
              }
              style={{
                backgroundColor: primaryColor,
                paddingVertical: 8,
                borderRadius: 8,
                paddingHorizontal: 12,
                marginTop: 4,
                alignItems: "center",
              }}
            >
              <Text style={{ fontFamily: "RHD-Medium", color: "#fff" }}>
                Manage
              </Text>
            </TouchableOpacity>
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
          My Classes
        </Title>
      </Toolbar>
      <View style={styles.tabView}>
        <TabItem item={"Classes"} />
        <TabItem item={"Subjects"} />
      </View>
      <PagerView 
        ref={pagerRef}
        style={{ flex: 1 }}
        initialPage={selectedPage}
        onPageSelected={(position) => {
          setSelectedPage(position.nativeEvent.position);
          setTab(tabList[position.nativeEvent.position])
        }}>
        <FlatList
          data={classList}
          renderItem={({ item }) => <ClassItem item={item} />}
          keyExtractor={(item) => item.id.toString()}
        />
        <View style={{ flex: 1 }}>
         <TeacherSubjectList />
        </View>
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 48,
    borderColor: borderColor,
    borderWidth: borderWidth,
    marginHorizontal: 16,
    borderRadius: 24,
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
