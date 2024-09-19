import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import {
  ButtonItem,
  ButtonLabel,
  Container,
  ContentView,
  InputTitle,
  MenuItem,
  SubView,
  Title,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  primaryText,
  secondaryText,
  primaryColor,
} from "../utils/Color";
import { useState, useRef } from "react";
import StudentList from "../components/StudentList";
import SubjectList from "../components/SubjectList";

export default function ManageClassroomScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [classDetails, setClassDetails] = useState(route?.params?.item);
  const [tab, setTab] = useState("Classes");
  const [selectedPage, setSelectedPage] = useState(0);
  const pagerRef = useRef();
  const tabList = ["Students", "Subjects", "Memories", "Announcement"];

  const ClassItem = () => {
    const { standard, section, student_count } = classDetails;
    return (
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
        </View>
      </View>
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

  const renderStudents = () => {
    return (
      <View style={{ paddingHorizontal: 16 }}>
        <SubView>
          <InputTitle>Students</InputTitle>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <InputTitle
              style={{
                color: primaryColor,
                fontSize: 14,
                textAlignVertical: "center",
              }}
            >
              View All
            </InputTitle>
            <Feather
              style={{ alignSelf: "center" }}
              name="chevron-right"
              size={14}
              color={primaryColor}
            />
          </TouchableOpacity>
        </SubView>
        <StudentList classID={classDetails?.id} />
      </View>
    );
  };

  const renderSubjects = () => {
    return (
      <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
        <SubView>
          <InputTitle>Subjects</InputTitle>
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <InputTitle
              style={{
                color: primaryColor,
                fontSize: 14,
                textAlignVertical: "center",
              }}
            >
              View All
            </InputTitle>
            <Feather
              style={{ alignSelf: "center" }}
              name="chevron-right"
              size={14}
              color={primaryColor}
            />
          </TouchableOpacity>
        </SubView>
        <SubjectList classID={classDetails?.id} />
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryText} />
        </MenuItem>
        <Title>Classroom Details</Title>
      </ToolbarBorder>
      <ContentView>
        <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
          <ClassItem />
          {renderStudents()}
          {renderSubjects()}
          <View style={{marginHorizontal:16,marginTop:12,marginBottom:4}}> 
          <InputTitle>Other Options</InputTitle>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("UpdateBiometricScreen");
            }}
            style={{
              marginVertical: 8,
              overflow: "hidden",
              borderRadius: 8,
              marginHorizontal: 16,
            }}
          >
            <ButtonItem>
              <ButtonLabel>{"Update Biometric information"}</ButtonLabel>
              <Feather name={"chevron-right"} size={24} color={"#e5e5e5"} />
            </ButtonItem>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SchoolMediaScreen", {
                selectedPage: selectedPage,
              });
            }}
            style={{
              marginVertical: 8,
              overflow: "hidden",
              borderRadius: 8,
              marginHorizontal: 16,
            }}
          >
            <ButtonItem>
              <ButtonLabel>{"Classroom moments"}</ButtonLabel>
              <Feather name={"chevron-right"} size={24} color={"#e5e5e5"} />
            </ButtonItem>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SchoolMediaScreen", {
                selectedPage: selectedPage,
              });
            }}
            style={{
              marginVertical: 8,
              overflow: "hidden",
              borderRadius: 8,
              marginHorizontal: 16,
            }}
          >
            <ButtonItem>
              <ButtonLabel>{"Class Announcement"}</ButtonLabel>
              <Feather name={"chevron-right"} size={24} color={"#e5e5e5"} />
            </ButtonItem>
          </TouchableOpacity>
        </ScrollView>
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
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
