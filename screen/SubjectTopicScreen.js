import { useEffect,useState} from "react";
import {
  Container,
  ContentView,
  MenuItem,
  TitleHeader,
  TitleSubHeader,
  TitleView,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { borderColor, borderWidth, primaryText, secondaryText } from "../utils/Color";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import { FlatList,TouchableOpacity,View,Text,StyleSheet } from "react-native";

export default function SubjectTopicScreen() {
  const navigation = useNavigation();
  const [subjectTopicList, setSubjectTopicList] = useState([]);

  useEffect(() => {
    supabase_api.shared.getSubjectTopicDetails(
      "Mathematics",
      "3",
      "CBSE"
    ).then((res)=>{
      setSubjectTopicList(res)
    }).catch((error)=>{
      ErrorLogger.shared.ShowError("SubjectTopicScreen: getSubjectTopicDetails: ",error)
    });

    return () => {};
  }, []);

  const renderItem = ({ index,item}) => (
    <TouchableOpacity onPress={()=> navigation.navigate("SubjectTopicScreen")}>
      <View style={styles.item}>
      <View style={{ flexDirection: "row", justifyContent: "space-between",alignItems:"center",paddingVertical:8 }}>
        <Text style={styles.subject}>{`Chapter ${index + 1}: ${item.title}`}</Text>
        <Feather name="chevron-down" size={20} color={secondaryText} />
      </View>
      <Text style={styles.topic}>{item?.description??"Current Topic Details"}</Text>
      {/* <Text style={styles.subject}>{item.subject}</Text>
      
      <Text style={styles.topic}>{item.progress}</Text> */}
    </View>
    </TouchableOpacity>
  );

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <TitleView>
          <TitleSubHeader>Topics</TitleSubHeader>
          <TitleHeader numberOfLines={1}>Mathematics</TitleHeader>
        </TitleView>
        <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Lesson Plan",
            });
          }}
        >
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      <ContentView>
      <FlatList
      contentContainerStyle={styles.feed}
        data={subjectTopicList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={1}
      />
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  feed:{
    paddingVertical:16,
  },
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