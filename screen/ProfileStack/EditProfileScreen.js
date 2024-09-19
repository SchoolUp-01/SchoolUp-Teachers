import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";

import {
  Container,
  ContentView,
  ErrorText,
} from "../../components/styledComponents";
import CustomStatusBarView from "../../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryColor,
  primaryColor_300,
  primaryColor_50,
  primaryText,
  secondaryText,
} from "../../utils/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import supabase_api from "../../backend/supabase_api";
import { supabase } from "../../backend/supabaseClient";
import InAppNotification from "../../utils/InAppNotification";
import ErrorLogger from "../../utils/ErrorLogger";

export default function EditProfileScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [user, setUser] = useState(route.params.user);
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar ?? "");
  const [fullName, setFullName] = useState(user?.name ?? "");
  const [fullNameError, setFullNameError] = useState("");
  const [isFullNameFocused, setIsFullNameFocused] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    String(user?.phone_number) ?? ""
  );
  const [phoneNumberError, setPhoneNumberError] = useState("");
  const [phoneNumberFocused, setPhoneNumberFocused] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const fullNameRef = useRef();
  const phoneNumberRef = useRef();

  useEffect(() => {
    setProfileAvatar(user?.avatar);
    setFullName(user?.name);
    setPhoneNumber(String(user?.phone_number));
    supabase_api.shared
      .getParentInfo(supabase_api.shared.uid, "*")
      .then((res) => {
        setUser(res);
        setProfileAvatar(res?.avatar);
        setFullName(res?.name);
        setPhoneNumber(String(res?.phone_number));
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "EditProfileScreen: getParentInfo: ",
          error
        );
      });
    return () => {
      null;
    };
  }, []);

  useEffect(() => {
    setButtonDisabled(
      user.name !== fullName ||
        String(user.phone_number) !== phoneNumber ||
        user.avatar !== profileAvatar
    );
  }, [user, fullName, phoneNumber, profileAvatar]);

  const handleNameChange = (text) => {
    setFullName(text);
    if (text !== "") setFullNameError("");
  };

  const handlePhoneNumberChange = (text) => {
    let cleaned = ("" + text).replace(/[^0-9]/g, "").slice(0, 10);
    setPhoneNumber(cleaned);
    if (text !== "") setPhoneNumberError("");
    if (cleaned.length == 10) {
      Keyboard.dismiss();
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: true,
    });
    if (!result.canceled) {
      setProfileAvatar(result.assets[0].uri);
    }
  };

  handleNext = () => {
    if(!buttonDisabled) return
    if (fullName === "") {
      setFullNameError("Full name cannot be empty!");
      fullNameRef.current.focus();
      return;
    }
    if (phoneNumber === "") {
      setPhoneNumberError("Phone number cannot be empty!");
      phoneNumberRef.current.focus();
      return;
    }
    if (phoneNumber?.length < 10) {
      setPhoneNumberError("Phone number should be 10-digit!");
      phoneNumberRef.current.focus();
      return;
    }
    setLoading(true);
    supabase_api.shared
      .editUser(fullName, phoneNumber, profileAvatar,user)
      .then(() => {
        navigation.goBack();
        InAppNotification.shared.showSuccessNotification({title:"Profile updated successfully",description:''})
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("EditProfileScreen: editUser: ",error)
        setLoading(false);
      });
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ContentView>
        <View style={{ flex: 1, justifyContent: "space-between" }}>
          <View>
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
                <Text style={styles.headerText}>Edit Profile</Text>
              </View>
              <Text style={styles.subText}>
                Update details about yourself and any other pertinent
                information.
              </Text>
            </View>
            <Text style={styles.basicHeaderText}>Basic Information</Text>
            <View style={styles.profileAvatarView}>
              <View>
                <Text style={styles.inputText}>Profile photo</Text>
                <Text style={styles.secondaryText}>Recommended 300 x 300</Text>
                <View style={{ flexDirection: "row", marginTop: 8 }}>
                  {profileAvatar == "" && (
                    <TouchableOpacity onPress={() => pickImage()}>
                      <Text style={styles.secondaryButton}>
                        Select Profile Picture
                      </Text>
                    </TouchableOpacity>
                  )}
                  {profileAvatar !== "" && (
                    <>
                      <TouchableOpacity onPress={() => pickImage()}>
                        <Text style={styles.secondaryButton}>Change</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setProfileAvatar("")}>
                        <Text style={styles.secondaryButton}>Remove</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
              {profileAvatar == "" && (
                <TouchableOpacity onPress={() => pickImage()}>
                  <Image
                    style={styles.avatar}
                    source={require("../../assets/DefaultImage.jpg")}
                  />
                </TouchableOpacity>
              )}
              {profileAvatar !== "" && (
                <TouchableOpacity onPress={() => pickImage()}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: profileAvatar }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Full name</Text>
              <TextInput
                ref={fullNameRef}
                style={[
                  styles.input,
                  {
                    borderColor: isFullNameFocused
                      ? fullNameError != ""
                        ? "#ff0033"
                        : primaryColor
                      : borderColor,
                    borderWidth: isFullNameFocused ? 1 : borderWidth,
                  },
                ]}
                value={fullName}
                onChangeText={(text) => handleNameChange(text)}
                onSubmitEditing={() => phoneNumberRef.current.focus()}
                selectionColor={fullNameError ? "#ff0033" : primaryColor}
                autoCapitalize="none"
                placeholder={"Enter full name"}
                placeholderTextColor={borderColor ?? underlayColor}
                onFocus={() => setIsFullNameFocused(true)}
                onBlur={() => setIsFullNameFocused(false)}
              ></TextInput>
              {fullNameError !== "" && (
                <View style={styles.errorView}>
                  <Feather color={"#ff0033"} size={12} name="alert-circle" />
                  <ErrorText>{fullNameError}</ErrorText>
                </View>
              )}
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Phone number</Text>
              <TextInput
                ref={phoneNumberRef}
                style={[
                  styles.input,
                  {
                    borderColor: phoneNumberFocused
                      ? phoneNumberError != ""
                        ? "#ff0033"
                        : primaryColor
                      : borderColor,
                    borderWidth: phoneNumberFocused ? 1 : borderWidth,
                  },
                ]}
                value={phoneNumber}
                onChangeText={(text) => handlePhoneNumberChange(text)}
                onSubmitEditing={() => handleNext()}
                selectionColor={phoneNumberError ? "#ff0033" : primaryColor}
                keyboardType="phone-pad"
                autoCapitalize="none"
                placeholder={"Enter 10-digit phone number"}
                placeholderTextColor={borderColor ?? underlayColor}
                onFocus={() => setPhoneNumberFocused(true)}
                onBlur={() => setPhoneNumberFocused(false)}
              ></TextInput>
              {phoneNumberError !== "" && (
                <View style={styles.errorView}>
                  <Feather color={"#ff0033"} size={12} name="alert-circle" />
                  <ErrorText>{phoneNumberError}</ErrorText>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={!buttonDisabled ? styles.disabled : styles.button}
            disabled={!buttonDisabled}
            onPress={() => {
              handleNext();
            }}
          >
            {!loading && (
              <Text
                style={{
                  color: !buttonDisabled ? primaryColor_50 : "white",
                  fontSize: 18,
                  fontFamily: "RHD-Medium",
                }}
              >
                Save Changes
              </Text>
            )}
            {loading && <ActivityIndicator color="#fff" size={24} />}
          </TouchableOpacity>
        </View>
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerText: {
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
  toolbarView: {
    marginHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  basicHeaderText: {
    fontFamily: "RHD-Medium",
    fontSize: 18,
    lineHeight: 27,
    marginHorizontal: 16,
    paddingVertical: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 120,
    borderColor: borderColor,
    borderWidth: borderWidth,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    color: primaryText,
  },
  secondaryText: {
    fontSize: 14,
    lineHeight: 24,
    fontFamily: "RHD-Regular",
    color: primaryText,
  },
  secondaryButton: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: borderWidth,
    borderColor: borderColor,
    marginEnd: 12,
    fontFamily: "RHD-Medium",
  },
  inputView: {
    marginTop: 20,
    marginHorizontal: 16,
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
  },
  primaryButton: {
    backgroundColor: primaryColor,
    marginBottom: 24,
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
  profileAvatarView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
  },
  errorView: {
    flexDirection: "row",
    marginStart: 6,
    alignItems: "center",
    marginTop: 4,
  },
  button: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: primaryColor,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:16

  },
  disabled: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: primaryColor_300,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:16

  },
});
