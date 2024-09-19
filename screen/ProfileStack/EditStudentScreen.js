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
  underlayColor,
} from "../../utils/Color";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import supabase_api from "../../backend/supabase_api";
import { supabase } from "../../backend/supabaseClient";
import InAppNotification from "../../utils/InAppNotification";
import ErrorLogger from "../../utils/ErrorLogger";

export default function EditStudentScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const index = route.params.index;
  const [user, setUser] = useState(route.params.user);
  const [profileAvatar, setProfileAvatar] = useState(user?.avatar ?? "");
  const [homeAddress, setHomeAddress] = useState(user?.home_address ?? "");
  const [homeAddressError, setHomeAddressError] = useState("");
  const [isHomeAddressFocused, setIsHomeAddressFocused] = useState(false);
  const [contactNumber, setContactNumber] = useState(
    String(user?.contact_number) ?? ""
  );
  const [contactNumberError, setContactNumberError] = useState("");
  const [contactNumberFocused, setContactNumberFocused] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const homeAddressRef = useRef();
  const contactNumberRef = useRef();

  useEffect(() => {
    console.log("StudentINfo: ",user)
    setProfileAvatar(user?.avatar);
    setHomeAddress(user?.home_address);
    if(user?.contact_number) setContactNumber(String(user?.contact_number)??"");
    else setContactNumber("")
    // supabase_api.shared
    //   .getParentInfo(supabase_api.shared.uid, "*")
    //   .then((res) => {
    //     setUser(res);
    //     setProfileAvatar(res?.avatar);
    //     setFullName(res?.name);
    //     setPhoneNumber(String(res?.phone_number));
    //   })
    //   .catch((error) => {
    //     ErrorLogger.shared.ShowError(
    //       "EditProfileScreen: getParentInfo: ",
    //       error
    //     );
    //   });
    return () => {
      null;
    };
  }, []);

  useEffect(() => {
    setButtonDisabled(
      user.home_address !== homeAddress ||
        String(user.contact_number) !== contactNumber ||
        user.avatar !== profileAvatar
    );
  }, [user, homeAddress, contactNumber, profileAvatar]);

  const handleNameChange = (text) => {
    setHomeAddress(text);
    if (text !== "") setHomeAddressError("");
  };

  const handlePhoneNumberChange = (text) => {
    let cleaned = ("" + text).replace(/[^0-9]/g, "").slice(0, 10);
    setContactNumber(cleaned);
    if (text !== "") setContactNumberError("");
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
    if (homeAddress === "") {
      setHomeAddressError("Home Address cannot be empty!");
      homeAddressRef.current.focus();
      return;
    }
    if (contactNumber === "") {
      setContactNumber("Contact number cannot be empty!");
      contactNumberRef.current.focus();
      return;
    }
    if (contactNumber?.length < 10) {
      setPhoneNumberError("Contact number should be 10-digit!");
      contactNumberRef.current.focus();
      return;
    }
    setLoading(true);
    supabase_api.shared
      .editStudentInfo(homeAddress, contactNumber, profileAvatar,user)
      .then((res) => {
        console.log("Res: ",res)
        Student.shared.updateMasterListInfo(index,res)
        navigation.goBack();
        InAppNotification.shared.showSuccessNotification({title:user?.name+" Profile updated successfully",description:''})
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError("EditStudentProfile: editStudentInfo: ",error)
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
                <Text style={styles.headerText}>Edit Children Information</Text>
              </View>
              <Text style={styles.subText}>
                Update details about your child and any other pertinent
                information.
              </Text>
            </View>
            <Text style={styles.basicHeaderText}>Basic Information</Text>
            <View style={styles.profileAvatarView}>
              <View>
                <Text style={styles.inputText}>Display Picture</Text>
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
              {(profileAvatar == null || profileAvatar == "") && (
                <TouchableOpacity onPress={() => pickImage()}>
                  <Image
                    style={styles.avatar}
                    source={require("../../assets/DefaultImage.jpg")}
                  />
                </TouchableOpacity>
              )}
              {(profileAvatar !== null && profileAvatar !== "" )&& (
                <TouchableOpacity onPress={() => pickImage()}>
                  <Image
                    style={styles.avatar}
                    source={{ uri: profileAvatar }}
                  />
                </TouchableOpacity>
              )}
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Contact Information</Text>
              <TextInput
                ref={contactNumberRef}
                style={[
                  styles.input,
                  {
                    borderColor: contactNumberFocused
                      ? contactNumberError != ""
                        ? "#ff0033"
                        : primaryColor
                      : borderColor,
                    borderWidth: contactNumberFocused ? 1 : borderWidth,
                  },
                ]}
                value={contactNumber??""}
                onChangeText={(text) => handlePhoneNumberChange(text)}
                onSubmitEditing={() => handleNext()}
                selectionColor={contactNumberError ? "#ff0033" : primaryColor}
                keyboardType="phone-pad"
                autoCapitalize="none"
                placeholder={"Enter 10-digit phone number"}
                placeholderTextColor={borderColor ?? underlayColor}
                onFocus={() => setContactNumberFocused(true)}
                onBlur={() => setContactNumberFocused(false)}
              ></TextInput>
              {contactNumberError !== "" && (
                <View style={styles.errorView}>
                  <Feather color={"#ff0033"} size={12} name="alert-circle" />
                  <ErrorText>{contactNumberError}</ErrorText>
                </View>
              )}
            </View>
            <View style={styles.inputView}>
              <Text style={styles.inputText}>Home Address</Text>
              <TextInput
                ref={homeAddressRef}
                style={[
                  styles.input,
                  {
                    borderColor: isHomeAddressFocused
                      ? homeAddressError != ""
                        ? "#ff0033"
                        : primaryColor
                      : borderColor,
                    borderWidth: isHomeAddressFocused ? 1 : borderWidth,
                    height:120,
                  },
                ]}
                value={homeAddress}
                onChangeText={(text) => handleNameChange(text)}
                onSubmitEditing={() => handleNext()}
                selectionColor={homeAddressError ? "#ff0033" : primaryColor}
                numberOfLines={6}
                multiline
                placeholder={"Enter Home Address "}
                placeholderTextColor={borderColor ?? underlayColor}
                onFocus={() => setIsHomeAddressFocused(true)}
                onBlur={() => setIsHomeAddressFocused(false)}
              ></TextInput>
              {homeAddressError !== "" && (
                <View style={styles.errorView}>
                  <Feather color={"#ff0033"} size={12} name="alert-circle" />
                  <ErrorText>{homeAddressError}</ErrorText>
                </View>
              )}
            </View>
          </View>
          <TouchableOpacity
            style={!buttonDisabled ? styles.disabled : styles.button}
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
    marginBottom:16,
  },
  disabled: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: primaryColor_300,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginBottom:16,
  },
});
