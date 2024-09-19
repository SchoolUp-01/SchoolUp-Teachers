import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import {
  Container,
  MenuItem,
  TitleHeader,
  TitleSubHeader,
  TitleView,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  primaryColor_300,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";

const subjects = [
  { id: "1", subject: "Physics", topic: "Force and Motion", progress: 75 },
  {
    id: "2",
    subject: "Chemistry",
    topic: "Elements and Compounds",
    progress: 68,
  },
  { id: "3", subject: "Biology", topic: "Cells and Organisms", progress: 84 },
  { id: "4", subject: "Physics", topic: "Energy and Heat", progress: 82 },
  { id: "5", subject: "Chemistry", topic: "Atomic Structure", progress: 70 },
  { id: "6", subject: "Biology", topic: "Genetics and Heredity", progress: 80 },
];

const LessonPlanScreen = () => {
  const navigation = useNavigation();
  const [search, setSearch] = useState("");
  const [subjectList, setSubjectList] = useState([]);

  useEffect(() => {
    supabase_api.shared
      .getSubjectInfoList()
      .then((res) => {
        setSubjectList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "LessonPlanScreen: getSubjectInfoList: ",
          error
        );
      });

    return () => {};
  }, []);

  const renderItem = ({ item, color = primaryColor_300 }) => (
    <TouchableOpacity onPress={()=> navigation.navigate("SubjectTopicScreen")}>
      <View style={styles.item}>
      <View style={{ flexDirection: "row", justifyContent: "space-between",alignItems:"center",paddingVertical:8 }}>
        <Text style={styles.subject}>{item.subject}</Text>
        <Feather name="chevron-right" size={20} color={secondaryText} />
      </View>
      <Text style={styles.topic}>{item?.topic??"Current Topic Details"}</Text>
      {/* <Text style={styles.subject}>{item.subject}</Text>
      
      <Text style={styles.topic}>{item.progress}</Text> */}
    </View>
    </TouchableOpacity>
  );

  const filteredSubjects = subjects.filter((subject) =>
    subject.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <TitleView>
          <TitleSubHeader>Lesson Plan</TitleSubHeader>
          <TitleHeader numberOfLines={1}>
            {/* {Student.shared.getMasterStudentName()} */}
          </TitleHeader>
        </TitleView>
        <MenuItem onPress={() => {
          navigation.navigate("RaiseConcernScreen", {
            type: "Lesson Plan",
          });
        }}>
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>

      <View
        style={{
          backgroundColor: underlayColor,
          height: 42,
          borderRadius: 8,
          justifyContent: "center",
          marginHorizontal: 16,
          alignContent: "center",
          marginBottom: 8,
          marginTop: 16,
        }}
      >
        {/* <TextInput
          style={{
            paddingStart: 10,
            color: primaryText,
          }}
          placeholderTextColor={secondaryText}
          placeholder={"Search for topics..."}
          onChangeText={setSearch(search)}
          value={search}
        ></TextInput> */}
      </View>
      <FlatList
        data={subjectList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderColor: "gray",
    borderWidth: 1,
    margin: 10,
    padding: 10,
  },
  item: {
    flex: 1,
    borderWidth: borderWidth,
    borderColor: borderColor,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 4,
    marginStart: 16,
    marginEnd: 16,
    marginBottom:16,
    // flexShrink: 1,
  },
  subject: {
    fontSize: 18,
    fontWeight: "bold",
  },
  topic: {
    fontSize: 16,
    lineHeight:24,
    fontFamily:"RHD-Medium",
    color:primaryText
  },
  infoText: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 8,
    textAlignVertical: "center",
    fontSize: 12,
    fontFamily: "RHD-Medium",
    marginEnd: 16,
    flexShrink: 1,
    alignSelf: "center",
    borderColor: "green",
    borderWidth: borderWidth,
  },
});

export default LessonPlanScreen;
