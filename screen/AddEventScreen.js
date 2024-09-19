import React, { useRef, useState } from "react";
import {
  ButtonItem,
  ButtonLabel,
  Container,
  ContentView,
  ErrorText,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  itemColor,
  primaryColor,
  primaryColor_800,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableHighlight,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ContentList from "../components/ContentList";
import * as ImagePicker from "expo-image-picker";
import ErrorLogger from "../utils/ErrorLogger";
import InAppNotification from "../utils/InAppNotification";

const { width, height } = new Dimensions.get("screen");

const AddEventScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [title, setTitle] = useState("");
  const [titleFocused, setTitleFocused] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [description, setDescription] = useState("");
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [mediaList, setMediaList] = useState([]);
  const [mediaError, setMediaError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [type, setType] = useState(route.params?.type ?? "Notice");
  const [loading, setLoading] = useState(false);
  const eventTitleRef = useRef();

  const pickImage = async () => {
    try {
      setRefreshing(true);
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      });
      if (!result.canceled) {
        // if (result.assets[0].type === "video") {
        //   let thumbnail_uri = await optimizeVideo(result?.assets[0].uri);
        //   result.assets[0].video_uri = result?.assets[0].uri;
        //   result.assets[0].uri = thumbnail_uri;
        // }
        setMediaList([...mediaList, result.assets[0]]);
      }
      setRefreshing(false);
      setMediaError(mediaList.length === 0);
    } catch (E) {
      ErrorLogger.shared.ShowError("NewPostScreen: pickImage: ", E);
    }
  };

  const removeMedia = async (selectedIndex) => {
    if (selectedIndex >= 0 && selectedIndex < mediaList.length) {
      setRefreshing(true);
      // Create a copy of the medalists array
      const updatedMedalists = [...mediaList];
      // Remove the medalist at the specified index
      updatedMedalists.splice(selectedIndex, 1);
      // Update the state or perform any other necessary actions
      setMediaList(updatedMedalists);
      setRefreshing(false);
    } else {
      console.error("Invalid selectedIndex");
    }
  };

  const MenuItem = ({ label, icon, color = primaryColor }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setType(label);
        }}
      >
        <View
          style={{
            flexShrink: 1,
            alignItems: "center",
            borderWidth: type === label ? 1 : 0,
            borderColor: type === label ? color : 0,
            paddingVertical: 8,
            borderRadius: 40,
            flexDirection: "row",
            backgroundColor: color + "2a",
            paddingHorizontal: 16,
            marginEnd: 16,
            marginBottom:16
          }}
        >
          <View style={[styles.iconContainer]}>
            <Feather
              style={[{ justifyContent: "center", alignSelf: "center" }]}
              size={20}
              color={color}
              name={icon ?? ""}
            />
          </View>
          <Text style={[styles.subLabel]} numberOfLines={2}>
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const handleDescriptionChange = (text) => {
    if (text.length <= 240) {
      setDescription(text);
    } else {
      InAppNotification.shared.showWarningNotification({
        title: "Description cannot be more than 240 characters",
        description: "",
      });
    }
  };

  const handleSubmit = () => {
    if (title.length <= 0) {
      setTitleError("Announcement Title cannot be empty!");
      setTitleFocused(true);
      return;
    } else {
      const data = {
        title,
        type,
        description,
        mediaList,
      };
      navigation.navigate("AnnouncementSettingScreen", {
        data: data,
      });
    }
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <View style={styles.toolbarView}>
        <View style={styles.headerView}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather
              style={{ marginEnd: 16 }}
              name="arrow-left"
              color={primaryText}
              size={24}
            />
          </TouchableOpacity>
          <Text style={styles.headerText}>New Announcement</Text>
          <TouchableOpacity
            style={{
              marginEnd: 16,
              alignSelf: "center",
              justifyContent: "center",
            }}
            onPress={() => {
              handleSubmit();
            }}
          >
            {loading ? <ActivityIndicator size={24} color={primaryColor}  />:<Text
              style={{
                fontSize: 16,
                fontFamily:  (title==="")?"RHD-Medium":"RHD-Bold",
                color: (title==="")?secondaryText:primaryColor,
              }}
            >
              Next
            </Text>}
          </TouchableOpacity>
        </View>
        <Text style={styles.subText}>
          Simply provide event details, specify participants, and share
          additional information to enhance the school community experience!
          🚀✨
        </Text>
      </View>
      <ContentView>
        <ScrollView>
          <View>
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Announcement Title <Text style={{ color: "#ff0033" }}>*</Text></Text>
              <TextInput
                ref={eventTitleRef}
                style={[
                  styles.input,
                  {
                    borderColor: titleFocused
                      ? titleError != ""
                        ? "#ff0033"
                        : primaryColor
                      : borderColor,
                    borderWidth: titleError != "" ? 1 : borderWidth,
                  },
                ]}
                onChangeText={(text) => {setTitle(text);setTitleError("")}}
                // onSubmitEditing={() => schoolNameRef.current.focus()}
                value={title}
                selectionColor={titleError ? "#ff0033" : primaryColor}
                autoCapitalize="none"
                placeholder={" Enter Title"}
                placeholderTextColor={borderColor ?? underlayColor}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
              ></TextInput>
              {titleError !== "" && (
                  <View style={styles.errorView}>
                    <Feather color={"#ff0033"} size={12} name="alert-circle" />
                    <ErrorText>{titleError}</ErrorText>
                  </View>
                )}
            </View>
            
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Categories</Text>
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                <MenuItem label={"Notice"} icon={"credit-card"} color="#f74c06" />
                <MenuItem label={"Event"} icon={"calendar"} color="#b330e1" />
                <MenuItem label={"Meeting"} icon={"users"} color="#e20b8c" />
              </View>
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Description </Text>
              <View
                style={{
                  flexDirection: "column",
                  justifyContent: "space-between",
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  borderColor: descriptionFocused ? primaryColor : borderColor,
                  borderWidth: borderWidth,
                  marginTop: 4,
                  marginBottom: 20,
                }}
              >
                {mediaList.length !== 0 && (
                  <ContentList
                    mediaList={mediaList}
                    pickImage={pickImage}
                    refreshing={refreshing}
                    removeMedia={removeMedia}
                    showFooter={false}
                    title={"Announcement Media"}
                  />
                )}
                <TextInput
                  style={{
                    minHeight: 80,
                    fontSize: 16,
                    color: primaryText,
                    paddingHorizontal: 8,
                    fontFamily: "RHD-Medium",
                    marginTop: 8,
                    flexShrink: 1,
                    textAlignVertical:'top'
                  }}
                  numberOfLines={3}
                  multiline
                  autoCapitalize="none"
                  selectionColor={primaryColor}
                  placeholder={"Write here"}
                  onChangeText={handleDescriptionChange}
                  value={description}
                  placeholderTextColor={borderColor ?? underlayColor}
                  onFocus={() => setDescriptionFocused(true)}
                  onBlur={() => setDescriptionFocused(false)}
                  onSubmit={() => handleSubmit()}
                ></TextInput>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 8,
                    alignItems: "center",
                    paddingHorizontal: 8,
                    marginTop: 8,
                  }}
                >
                  <TouchableOpacity onPress={pickImage}>
                    <Feather name="paperclip" size={20} color={secondaryText} />
                  </TouchableOpacity>
                  <Text style={{ fontFamily: "RHD-Medium" }}>
                    {description.length + " / 240"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
        {/* <TouchableOpacity onPress={() => handleSubmit()}>
          <View style={styles.primaryButton}>
            {loading && <ActivityIndicator size={36} color={"#fff"} />}
            {!loading && <Text style={styles.primaryText}>Next</Text>}
          </View>
        </TouchableOpacity> */}
      </ContentView>
    </Container>
  );
};

const styles = StyleSheet.create({
  toolbarView: {
    marginHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerText: {
    flex:1,
    fontFamily: "RHD-Medium",
    fontSize: 20,
    lineHeight: 30,
  },
  subText: {
    fontFamily: "RHD-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: primaryText,
  },
  inputView: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    color: primaryText,
    marginBottom: 8,
  },
  input: {
    height: 48,
    fontSize: 16,
    color: primaryText,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: "RHD-Medium",
    backgroundColor: itemColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
    marginTop: 4,
    textAlignVertical: "center",
  },
  tagText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
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
    // backgroundColor: itemColor,
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  subLabel: {
    fontSize: 14,
    color: primaryText,
    fontFamily: "RHD-Medium",
    flexShrink: 1,
    textAlign: "center",
    marginHorizontal: 8,
  },
  primaryButton: {
    backgroundColor: primaryColor,
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#fff",
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    fontSize: 16,
    alignSelf: "center",
  },
  errorView: {
    flexDirection: "row",
    marginStart: 6,
    alignItems: "center",
    marginTop:8,
    marginHorizontal:16
  },
});
export default React.memo(AddEventScreen);
