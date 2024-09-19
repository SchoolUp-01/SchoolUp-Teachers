import React, { useRef, useState } from "react";
import {
  ButtonItem,
  ButtonLabel,
  Container,
  ContentView,
  ErrorText,
  ScreenHint,
  Title,
  ToolbarBorder,
  MenuItem as MI,
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
  primaryText,
  secondaryText,
} from "../utils/Color";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import ContentList from "../components/ContentList";
import * as ImagePicker from "expo-image-picker";
import ErrorLogger from "../utils/ErrorLogger";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import InAppNotification from "../utils/InAppNotification";
import supabase_api from "../backend/supabase_api";
import BottomModal, { ConfirmDeleteDialog } from "../components/Modals";
import ClassSearchModal from "../components/ClassSearchModal";

const { width, height } = new Dimensions.get("screen");

const EditMemoriesScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const item = route?.params?.item;
  const [mediaList, setMediaList] = useState(JSON.parse(item?.media)??[]);
  const [mediaError, setMediaError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const titleRef = useRef();
  const [title, setTitle] = useState(item?.title ?? "");
  const [titleFocused, setTitleFocused] = useState(false);
  const [titleError, setTitleError] = useState("");
  const [type, setType] = useState(item?.type ?? "");
  const [description, setDescription] = useState(item?.caption ?? "");
  const [descriptionFocused, setDescriptionFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showClassDialog, setShowClassDialog] = useState(false);
  const [classList, setClassList] = useState([]);
  const [showDialog,setShowDialog] =useState(false);

  const toggleClassModal = async (selectedList) => {
    setShowClassDialog(!showClassDialog);
  };

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
      setMediaError("");
    } catch (E) {
      ErrorLogger.shared.ShowError("NewPostScreen: pickImage: ", E);
    }
  };

  const removeMedia = (index) => {
    const updatedMediaList = [...mediaList];
    updatedMediaList.splice(index, 1);

    setMediaList(updatedMediaList);
    setRefreshing(true);
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
    if (loading) {
      InAppNotification.shared.showWarningNotification({
        title: "Please wait while we upload your content to our servers",
        description: "",
      });
      return;
    }
    if (title.length === 0) {
      setTitleError("Title cannot be empty!");
      titleRef.current.focus();
      return;
    }
    if (mediaList.length === 0) {
      setMediaError("Select media to upload");
      return;
    }
    setLoading(true);
    supabase_api.shared
      .addStudentMemory(title, description, type, mediaList)
      .then((res) => {
        InAppNotification.shared.showSuccessNotification({
          title: "Successfully added!",
          description: "",
        });
        navigation.goBack();
      })
      .catch((error) => {
        InAppNotification.shared.showErrorNotification({
          title: "Something went wrong!",
          description: "Please try again in sometime.",
        });
        ErrorLogger.shared.ShowError(
          "AddMemoriesScreen: addStudentMemory: ",
          error
        );
      });
  };

  const handleDelete = () =>{
    supabase_api.shared
    .removeStudentMemory(item?.id)
    .then((res) => {
      InAppNotification.shared.showSuccessNotification({
        title: "Removed Moment!",
        description: "",
      });
      navigation.goBack();
    })
    .catch((error) => {
      InAppNotification.shared.showErrorNotification({
        title: "Something went wrong!",
        description: "Please try again in sometime.",
      });
      ErrorLogger.shared.ShowError(
        "EditMemoriesScreen: removeStudentMemory: ",
        error
      );
    });
  }

  const MenuItem = ({
    label,
    icon,
    color = primaryColor,
    disabled = false,
  }) => {
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => {
          setType(label);
          if (label == "Class") toggleClassModal();
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
            marginBottom: 16,
          }}
        >
          <View style={[styles.iconContainer]}>
            <MaterialIcons
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

  const renderSelectionList = () => {
    if (type == "School") return;
    else if (type == "Class" && classList?.length !==0) {
      return (
        <View style={styles.inputView}>
          <Text style={styles.inputText}>Selected Classes</Text>
          <View
            style={{
              flexDirection: "row",
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            {classList.map((item, index) => (
              <MenuItem
                key={index} // Assuming the index can be used as a key
                label={`Class ${item.standard}${item.section}`} // Assuming standard and section properties exist in item
                icon="" // Empty string for icon
                color="#ffb902" // Color for the MenuItem
                disabled={true} // Disabled state
              />
            ))}
          </View>
        </View>
      );
    }
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ConfirmDeleteDialog
        isVisible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleDelete}
        type={"Moment"}
      />
      <ClassSearchModal
        showClassDialog={showClassDialog}
        callBackFunction={toggleClassModal}
        selectedList={classList}
        setSelectedList={setClassList}
      />

      <ToolbarBorder>
        <MI
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MI>
        <Title>{"Edit Moment"}</Title>
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
          <Text
            style={{
              fontSize: 16,
              fontFamily: "RHD-Bold",
              color: primaryColor,
            }}
          >
            Save Changes
          </Text>
        </TouchableOpacity>
      </ToolbarBorder>
      <ContentView>
        <ScrollView>
          <View style={styles.inputView}>
            <Text style={styles.inputText}>
              Title <Text style={{ color: "#ff0033" }}>*</Text>{" "}
            </Text>
            <TextInput
              ref={titleRef}
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
              onChangeText={(text) => {
                setTitle(text);
                setTitleError("");
              }}
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
            <Text style={styles.inputText}>Publish to</Text>
            <View
              style={{
                flexDirection: "row",
                marginTop: 8,
                flexWrap: "wrap",
              }}
            >
              <MenuItem label={"School"} icon={"school"} color="#688d15" />
              <MenuItem label={"Class"} icon={"class"} color="#ffb902" />
              <MenuItem label={"Student"} icon={"group"} color="#0968e5" />
            </View>
          </View>
          {renderSelectionList()}
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
                  title={"Media"}
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
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <TouchableOpacity onPress={pickImage}>
                    <Feather
                      name="paperclip"
                      size={20}
                      color={mediaError !== "" ? "#ff0033" : secondaryText}
                    />
                  </TouchableOpacity>
                  {mediaError !== "" && (
                    <ErrorText style={{ fontSize: 14, marginStart: 8 }}>
                      {mediaError}
                    </ErrorText>
                  )}
                </View>
                <Text style={{ fontFamily: "RHD-Medium" }}>
                  {description.length + " / 240"}
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <TouchableOpacity onPress={() => handleSubmit()}>
          <View style={styles.primaryButton}>
            {showDialog && <ActivityIndicator size={36} color={"#fff"} />}
            {!showDialog && <Text style={styles.primaryText}>Delete Memory </Text>}
          </View>
        </TouchableOpacity>
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
    flex: 1,
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
    height: 40,
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
    backgroundColor: "#e03737",
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
    fontFamily: "RHD-Bold",
    fontSize: 16,
    alignSelf: "center",
  },
  errorView: {
    flexDirection: "row",
    marginStart: 6,
    alignItems: "center",
    marginTop: 8,
  },
  searchView: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
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
export default React.memo(EditMemoriesScreen);
