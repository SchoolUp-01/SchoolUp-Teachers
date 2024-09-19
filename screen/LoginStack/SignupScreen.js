import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Container, ErrorText } from "../../components/styledComponents";
import CustomStatusBarView from "../../components/CustomStatusBarView";
// import { Container, ErrorText } from "../styledComponents";
import { supabase } from "../../backend/supabaseClient";

import { Feather } from "@expo/vector-icons";
import {
  backgroundColor,
  borderColor,
  itemBorder,
  itemColor,
  primaryColor,
  primaryColor_300,
  primaryColor_50,
  primaryText,
  secondaryText,
  underlayColor,
} from "../../utils/Color";
import CheckBox from "expo-checkbox";
import ParsedText from "react-native-parsed-text";
import ErrorLogger from "../../utils/ErrorLogger";
import { useNavigation, useRoute } from "@react-navigation/native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";

WebBrowser.maybeCompleteAuthSession()
export default function SignupScreen() {
  const navigation = useNavigation();
  const route = useRoute()
  const emailRef = useRef();
  const passwordRef = useRef();
  const [email, setEmail] = useState(route.params?.email??"");
  const [emailFocused, setEmailFocused] = useState(false);
  const [password, setPassword] = useState(route.params?.password??"");
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLogin, setGoogleLogin] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(true);
  const [socialSignIn, setSocialSignIn] = useState(false);
  const [signupDisabled, setSignupDisabled] = useState(true);
  const [showGoogleSignModal, setShowGoogleSignModal] = useState(false);
  const [termsUpdated, setTermsUpdated] = useState(false);
  const [termsError, setTermsError] = useState("");

  handleEmailChange = (emailAddress) => {
    setEmail(emailAddress);
    setEmailError("");
    setSignupDisabled(
      emailAddress == "" || password == "" || termsUpdated == false
    );
  };

  handlePasswordChange = (passwordChanged) => {
    setPassword(passwordChanged);
    if (passwordChanged.length < 6) setPasswordError("");
    setSignupDisabled(
      email == "" || passwordChanged == "" || termsUpdated == false
    );
  };

  setAcceptTerm = (boolean) => {
    setTermsUpdated(boolean);
    setSignupDisabled(email == "" || password == "" || !boolean);
    if (termsUpdated) {
      setErrorMessage("");
      setTermsError(false);
    }
  };

  handleSignup = async () => {
    try {
      if (email === "") {
        setEmailError("Enter a valid email address");
        setErrorMessage("");
        emailRef.current.focus();
      } else if (password === "") {
        setPasswordError("Password cannot be empty");
        setErrorMessage("");
        passwordRef.current.focus();
      } else if (!termsUpdated) {
        setTermsError(true);
        setErrorMessage("Please accept terms and condition");
      } else {
        setLoading(true);
        setErrorMessage("");
        const { data, error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) {
          handleError(error);
        }
      }
    } catch (error) {
      // InAppNotification.shared.showErrorNotification({
      //   title: "Something somewhere went wrong!",
      //   description: "",
      // });
      ErrorLogger.shared.ShowError(
        "Exception: loginScreen: handleSignup ",
        error
      );
    }
  };

  handleLogin = () => {
    navigation.navigate("LoginScreen",{
      email:email,
      password:password
    });
  };

  handleError = (error) => {
    setLoading(false);
    if (error.status === 422) {
      if (String(error.message).includes("email")) {
        setEmailError("Enter a valid email address");
        emailRef.current.focus();
      } else {
        setPasswordError("Minimum length of password should be 6.");
        passwordRef.current.focus();
      }
    } else if (error.status === 400) {
      setErrorMessage("Email address already in use. Login");
    } else if (error.code === "auth/network-request-failed") {
      setErrorMessage(
        "We tired our best but it looks like there is no connectivity. Please check your internet connection and retry."
      );
    } else {
      // auth/network-request-failed
      console.log("Not equal " + error);
      setErrorMessage(error.code);
    }
  };

  signInWithGoogle = async() =>{
    returnUrl = AuthSession.makeRedirectUri({
      native: "https://SchoolUp.in/redirect/",
      useProxy: false,
      path: "redirect",
    });
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "schoolup://redirect",
      },
    });
    if (error) {
      ErrorLogger.shared.ShowError("LoginScreen: signInWithGoogle: ", error);
    }
    else {
      WebBrowser.openAuthSessionAsync(data?.url, returnUrl)
        .catch((error) => {
          InAppNotification.shared.showErrorNotification({
            title: "Something somewhere went wrong!",
            description: "",
          });
          ErrorLogger.shared.ShowError(
            "Exception: LoginScreen: signInWithGoogle ",
            error
          );
        })
        .finally(() => {
          
        });
  }
}

  closeGoogleModal = () => {
    setShowGoogleSignModal(false);
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={{
                padding: 16,
              }}
              onPress={() => navigation.goBack()}
            >
              <Feather
                name="arrow-left"
                size={24}
                color={primaryText}
              ></Feather>
            </TouchableOpacity>
            <Text style={styles.greetings}>
              Hello, Welcome to <Text style={styles.appName}>SchoolUp</Text>{" "}
            </Text>
            <Text style={styles.secondaryGreetings}>
              Sign-up to get started
            </Text>
            <View style={styles.errorMessage}>
              {errorMessage !== "" && (
                <ParsedText
                  style={styles.error}
                  parse={[
                    {
                      pattern: /Login/,
                      style: styles.linkText,
                      onPress: handleLogin,
                    },
                  ]}
                  childrenProps={{ allowFontScaling: false }}
                >
                  {errorMessage}
                </ParsedText>
              )}
            </View>
            <View style={styles.form}>
              <View>
                <Text style={styles.inputTitle}>Email</Text>
                <TextInput
                  ref={emailRef}
                  style={[
                    styles.input,
                    {
                      borderColor:
                      emailError != ""
                        ? "#E9446A"
                        : emailFocused
                        ? primaryColor
                        : borderColor,
                    borderWidth:
                      emailError != "" ? 1 : emailFocused ? 1 : itemBorder,
                    },
                  ]}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onChangeText={(email) => handleEmailChange(email)}
                  selectionColor={emailError !== "" ? "#ff0033" : primaryColor}
                  value={email}
                  onSubmitEditing={() => passwordRef.current.focus()}
                  placeholder={"Enter Email Address"}
                  placeholderTextColor={borderColor ?? underlayColor}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                ></TextInput>
                {emailError !== "" && (
                  <View style={styles.errorView}>
                    <Feather color={"#ff0033"} size={12} name="alert-circle" />
                    <ErrorText>{emailError}</ErrorText>
                  </View>
                )}
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputTitle}>Password</Text>
                <View
                  style={[
                    styles.passwordView,
                    {
                      borderColor:
                        passwordError != ""
                          ? "#E9446A"
                          : passwordFocused
                          ? primaryColor
                          : borderColor,
                      borderWidth:
                        passwordError != ""
                          ? 1
                          : passwordFocused
                          ? 1
                          : itemBorder,
                    },
                  ]}
                >
                  <TextInput
                    ref={passwordRef}
                    style={styles.passwordInput}
                    keyboardType="default"
                    autoCompleteType="off"
                    secureTextEntry={passwordVisible}
                    autoCapitalize="none"
                    selectionColor={
                      passwordError !== "" ? "#ff0033" : primaryColor
                    }
                    onChangeText={(password) => handlePasswordChange(password)}
                    value={password}
                    onSubmitEditing={() => handleSignup()}
                    placeholder={"Enter Password"}
                    placeholderTextColor={borderColor ?? underlayColor}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}s
                  ></TextInput>
                  <TouchableOpacity
                    style={styles.passwordIcon}
                    onPress={() => setPasswordVisible(!passwordVisible)}
                  >
                    <Feather
                      name={passwordVisible ? "eye" : "eye-off"}
                      size={16}
                      color={primaryText}
                    ></Feather>
                  </TouchableOpacity>
                </View>
                {passwordError !== "" && (
                  <View style={styles.errorView}>
                    <Feather color={"#ff0033"} size={12} name="alert-circle" />
                    <ErrorText>{passwordError}</ErrorText>
                  </View>
                )}
              </View>
              <View style={styles.checkBoxView}>
                <CheckBox
                  value={termsUpdated}
                  onValueChange={(boolean) => {
                    setAcceptTerm(boolean);
                  }}
                  color={
                    termsUpdated
                      ? primaryColor
                      : termsError
                      ? "#e03737"
                      : secondaryText
                  }
                  style={{ checkColor: primaryColor, padding: 8 }}
                />

                <ParsedText
                  style={styles.checkBoxText}
                  parse={[
                    {
                      pattern: /Privacy Policy/,
                      style: styles.linkText,
                      onPress: this.onPrivacyClicked,
                    },
                    {
                      pattern: /Terms and Conditions/,
                      style: styles.linkText,
                      onPress: this.onTermsClicked,
                    },
                  ]}
                >
                  By Registering you accept our Privacy Policy and Terms and
                  Conditions
                </ParsedText>
              </View>
            </View>

            <TouchableOpacity
              style={signupDisabled ? styles.disabled : styles.button}
              onPress={() => handleSignup()}
            >
              {!loading && (
                <Text
                  style={{
                    color: signupDisabled ? primaryColor_50 : "white",
                    fontSize: 18,
                    fontFamily: "RHD-Medium",
                  }}
                >
                  Sign up
                </Text>
              )}
              {loading && <ActivityIndicator color="#fff" size={24} />}
            </TouchableOpacity>
            <View style={styles.dividerView}>
              <View style={styles.divider} />
              <Text style={styles.dividerText}>You can connect with</Text>
              <View style={styles.divider} />
            </View>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => {
                signInWithGoogle();
              }}
            >
              <Image
                style={styles.socialIcon}
                source={require("../../assets/iv_google.png")}
                resizeMode="cover"
              ></Image>
              {!googleLogin && (
                <Text style={styles.socialText}>Sign in using Google</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.bottomView}>
            <TouchableOpacity
              onPress={() => handleLogin()}
            >
              <Text
                style={[
                  styles.linkText,
                  {
                    fontSize: 14,
                  },
                ]}
              >
                Already have an account here?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    backgroundColor: backgroundColor,
  },
  greetings: {
    marginHorizontal: 20,
    fontSize: 18,
    fontWeight: "500",
    color: primaryText,
    fontFamily: "RHD-Medium",
  },
  error: {
    color: "#ff0033",
    fontSize: 14,
    fontWeight: "100",
    fontFamily: "RHD-Medium",
  },
  errorMessage: {
    marginTop: 24,
    //height: 72,
    // alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
  },
  form: {
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  inputTitle: {
    color: primaryText,
    fontSize: 14,
    fontFamily: "RHD-Regular",
    marginStart: 8,
  },
  inputView: { marginTop: 24 },
  input: {
    height: 48,
    fontSize: 16,
    color: primaryText,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginVertical: 8,
    fontFamily: "RHD-Medium",
    backgroundColor: itemColor,
  },
  button: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: primaryColor,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    marginTop: 24,
    marginHorizontal: 20,
    backgroundColor: primaryColor_300,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  noError: {
    color: "#8a8f9e",
  },
  linkText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#2d9cdb",
    fontFamily: "RHD-Medium",
  },
  centeredView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#00000080",
  },
  modalView: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#00000080",
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: { height: 24, width: 24, borderRadius: 12 },
  socialText: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "RHD-Medium",
    marginTop: 16,
    textAlign: "center",
    marginStart: 8,
  },
  secondaryGreetings: {
    fontFamily: "RHD-Medium",
    marginHorizontal: 20,
    color: secondaryText,
    fontSize: 14,
    marginTop: 4,
  },
  socialButton: {
    marginHorizontal: 20,
    flexDirection: "row",
    backgroundColor: underlayColor,
    borderWidth: 0.6,
    borderColor: underlayColor,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  dividerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 32,
    marginHorizontal: 20,
  },
  divider: {
    flex: 1,
    width: 60,
    height: StyleSheet.hairlineWidth,
    alignSelf: "center",
    backgroundColor: borderColor,
  },
  dividerText: {
    marginHorizontal: 24,
    fontFamily: "RHD-Regular",
    color: secondaryText,
  },
  socialText: {
    flex: 0.75,
    textAlign: "center",
    alignSelf: "center",
    marginStart: 16,
    fontSize: 18,
    fontFamily: "RHD-Medium",
    color: primaryText,
  },
  errorView: {
    flexDirection: "row",
    marginStart: 6,
    alignItems: "center",
  },
  bottomView: {
    alignSelf: "center",
    marginBottom: 20,
    flexDirection: "row",
  },
  appName: { fontFamily: "RHD-Bold", color: primaryColor },
  passwordView: {
    marginVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: itemColor,
    flexDirection: "row",
    justifyContent: "space-between",
    height: 48,
  },
  passwordInput: {
    alignSelf: "center",
    fontFamily: "RHD-Medium",
    flex: 1,
    marginEnd: 8,
    color: primaryText,
    fontSize: 16,
  },
  passwordIcon: { alignSelf: "center", marginEnd: 8 },
  checkBoxView: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  checkBoxText: {
    color: "#8A8F9E",
    marginStart: 16,
    flexShrink: 1,
    fontFamily: "RHD-Medium",
  },
});
