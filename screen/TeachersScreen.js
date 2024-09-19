import React, { useState, useEffect } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  TitleHeader,
  TitleSubHeader,
  TitleView,
  ToolbarBorder,
} from "../components/styledComponents";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import CustomStatusBarView from "../components/CustomStatusBarView";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import EmptyState from "../components/EmptyState";
import TeacherScreenShimmer from "../components/Shimmers/TeacherScreenShimmer";
import { TextInput } from "react-native-gesture-handler";
const TeachersScreen = () => {
  let navigation = useNavigation();
  const [teachersList, setTeachersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getTeacherInfo();

    return () => {};
  }, []);

  const getTeacherInfo = () => {
    supabase_api.shared
      .getTeachersDetails(
        Student.shared.getMasterStudentClassID(),
        "teacher_info!inner(id,name,avatar),subject,progress,class_id"
      )
      .then((res) => {
        setTeachersList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "TeachersScreen: getTeachersDetails: ",
          error
        );
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  const handleRefresh =() =>{
    setRefreshing(true)
    setLoading(true)
    setTeachersList([])
    getTeacherInfo()
  }

  const TeacherItem = ({ item }) => {
    return (
      <View style={styles.teacherView}>
        <Image
          style={styles.avatar}
          defaultSource={require("../assets/DefaultImage.jpg")}
        />
        <View style={styles.subView}>
          <Text style={styles.headerText}>{item?.teacher_info?.name}</Text>
          <Text style={styles.subText}>{item?.subject}</Text>
        </View>
        <TouchableOpacity
          style={styles.imageButton}
          onPress={() => {
            navigation.navigate("ParentsCommunicationScreen", {
              teacherInfo: item?.teacher_info,
            });
          }}
        >
          <Text style={styles.messageText}>Message</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View>
          <TeacherScreenShimmer />
        </View>
      );
    } else {
      return (
        <EmptyState
          title="Teachers not available"
          description={
            "No Information available at the moment, please check back later."
          }
          animation={require("../assets/animations/no_teacher.json")}
        />
      );
    }
  };

  const renderHeader = () => {
    return (
      <View style={styles.searchView}>
        <Feather name="search" size={16} color={secondaryText} />
        <TextInput
          style={styles.searchInput}
          selectionColor={primaryColor}
          placeholder="Search teachers or subject"
          onChangeText={(search) => setSearchText(search)}
          value={searchText}
          autoCapitalize="none"
        />
        {searchText.length !== 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Feather name="x" size={16} color={secondaryText} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <TitleView>
          <TitleSubHeader>Teachers</TitleSubHeader>
          <TitleHeader numberOfLines={1}>
            {Student.shared.getMasterStudentName()}
          </TitleHeader>
        </TitleView>
        {/* <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Teachers",
            });
          }}
        >
          <Feather name={"search"} size={20} color={primaryText} />
        </MenuItem> */}
        <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Teachers",
            });
          }}
        >
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>

      <ContentView>
        {/* {renderHeader()} */}
        <FlatList
          data={teachersList}
          renderItem={({ item, index }) => <TeacherItem item={item} />}
          keyExtractor={(item, index) => String(index)}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[primaryColor]} // Customize the refresh indicator color if needed
              tintColor={primaryColor} // Customize the color of the loading indicator
            />
          }
        />
      </ContentView>
    </Container>
  );
}

export default React.memo(TeachersScreen)

const styles = StyleSheet.create({
  teacherView: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
    justifyContent: "space-between",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: defaultImageBgColor,
    marginEnd: 20,
    borderColor: borderColor,
    borderWidth: borderWidth,
  },
  imageButton: {
    marginHorizontal: 4,
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 16,
    backgroundColor: primaryColor,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  feed: {
    paddingVertical: 16,
  },
  subView: { flex: 1, flexShrink: 1, flexGrow: 1 },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
  },
  subText: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "RHD-Medium",
    color: secondaryText,
  },
  messageText: {
    fontFamily: "RHD-Medium",
    color: "#fff",
  },
  searchView: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 12,
    marginBottom: 12,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontFamily: "RHD-Medium",
    marginHorizontal: 16,
  },
});
