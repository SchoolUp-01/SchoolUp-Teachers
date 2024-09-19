import React, { useState, useEffect } from "react";

import {
  Container,
  ContentView,
  ErrorText,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation, useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  ScrollView,
  BackHandler,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import {
  borderColor,
  borderWidth,
  itemBorder,
  itemColor,
  primaryColor,
  primaryColor_300,
  primaryColor_50,
  primaryColor_800,
  primaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";

export default function RaiseConcernScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [reason, setReason] = useState("");
  const [reasonFocused, setReasonFocused] = useState(false);
  const [reasonError, setReasonError] = useState("");
  const [type, setType] = useState(route.params?.type ?? "General");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (reason !== "") {
          showExitConfirmation();
        } else navigation.goBack();
        return true; // Return true to prevent default back behavior
      }
    );

    return () => backHandler.remove();
  }, []);

  const showExitConfirmation = () => {
    Alert.alert(
      "Are you sure?",
      "Do you want to discard unsaved changes?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ],
      { cancelable: false }
    );
  };

  const handleSubmit = () => {
    setLoading(true);
    if (reason === "") {
      setReasonError("Reason cannot be empty!");
      setReasonFocused(true);
      setLoading(false);
    } else {
      supabase_api.shared
        .addConcernReport(type, reason)
        .then((res) => {
          //todo show message after successfully submission
          navigation.goBack();
        })
        .catch((error) => {
          ErrorLogger.shared.ShowError(
            "RaiseConcernScreen: addConcernReport: ",
            error
          );
        })
        .finally(() => setLoading(false));
    }
  };

  const MenuItem = ({ item }) => {
    return (
      <View
        style={[
          styles.feedItem,
          {
            borderColor: item == type ? primaryColor : borderColor,
          },
        ]}
      >
        <TouchableOpacity onPress={() => setType(item)}>
          <Text
            style={[
              styles.tagText,
              {
                color: item == type ? primaryColor : primaryText,
                fontFamily: item == type ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ContentView
        style={{
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View style={styles.toolbarView}>
          <View style={styles.headerView}>
            <TouchableOpacity
              onPress={() => {
                if (reason !== "") {
                  showExitConfirmation();
                } else navigation.goBack();
              }}
            >
              <Feather
                style={{ marginEnd: 16 }}
                name="arrow-left"
                color={primaryText}
                size={24}
              />
            </TouchableOpacity>
            <Text style={styles.headerText}>Raise Concern</Text>
          </View>
          <Text style={styles.subText}>
            To process your Report smoothly, please provide the following
            details
          </Text>
        </View>
        <ScrollView>
          <KeyboardAvoidingView>
            <Text style={styles.basicHeaderText}>Report Information</Text>
            <View
              style={{
                justifyContent: "space-between",
              }}
            >
              <View style={styles.inputView}>
                <Text style={styles.inputText}>Type</Text>
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <MenuItem item={"General"} />
                  <MenuItem item={"Daily Task"} />
                  <MenuItem item={"Teachers"} />
                  <MenuItem item={"Lesson Plan"} />
                  <MenuItem item={"Exams"} />
                  <MenuItem item={"Time Table"} />
                  <MenuItem item={"Academics Report"} />
                  <MenuItem item={"Leave Application"} />
                  <MenuItem item={"Holiday Calendar"} />
                  <MenuItem item={"Fee Receipt"} />
                  <MenuItem item={"Bus Route Tracker"} />
                  <MenuItem item={"Children complaint"} />
                </View>
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputText}>Reason</Text>
                <TextInput
                  style={[
                    styles.input,
                    {
                      height: 120,
                      borderColor: reasonFocused ? primaryColor : borderColor,
                      borderWidth: reasonFocused ? 1 : borderWidth,
                    },
                  ]}
                  numberOfLines={6}
                  multiline
                  autoCapitalize="none"
                  selectionColor={primaryColor}
                  placeholder={""}
                  onChangeText={(text) => {
                    setReason(text);
                    setReasonError(text !== "" ? "" : reasonError);
                  }}
                  value={reason}
                  placeholderTextColor={borderColor ?? underlayColor}
                  onFocus={() => setReasonFocused(true)}
                  onBlur={() => setReasonFocused(false)}
                  onSubmit={() => handleSubmit()}
                ></TextInput>
              </View>
              {reasonError !== "" && (
                <View style={styles.errorView}>
                  <Feather color={"#ff0033"} size={12} name="alert-circle" />
                  <ErrorText>{reasonError}</ErrorText>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <View>
          <TouchableOpacity onPress={() => handleSubmit()}>
            <View style={styles.primaryButton}>
              {loading && <ActivityIndicator size={36} color={"#fff"} />}
              {!loading && (
                <Text style={styles.primaryText}>Submit Report</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </ContentView>
    </Container>
  );
}
const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: "#333",
    marginTop: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    marginTop: 5,
  },
  datePicker: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
  },
  recentView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: primaryColor_10, //c7c7c7
    borderBottomColor: primaryColor_300,
    borderBottomWidth: borderWidth,
  },
  label: {
    paddingVertical: 12,
    marginHorizontal: 16,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryColor, //979797
    fontWeight: "500",
  },
  textInput: {
    fontSize: 16,
    marginVertical: 8,
    color: primaryText,
    paddingVertical: 8,
    borderWidth: itemBorder,
    backgroundColor: itemColor,
    borderColor: borderColor,
    borderRadius: 8,
    paddingHorizontal: 8,
    textAlignVertical: "top",
    minHeight: 84,
    fontFamily: "RHD-Medium",
  },
  button: {
    margin: 16,
    backgroundColor: primaryColor,
    borderRadius: 8,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
  },
  defaultItem: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderColor: borderColor,
    borderRadius: 12,
    borderWidth: borderWidth,
    marginEnd: 12,
    fontFamily: "RHD-Regular",
    fontSize: 14,
    lineHeight: 21,
  },
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
    height: 40,
    textAlignVertical: "center",
    fontSize: 16,
    alignContent: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  inputView: {
    marginTop: 8,
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
    textAlignVertical: "top",
  },
  primaryButton: {
    backgroundColor: primaryColor,
    marginHorizontal: 16,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginBottom:16
  },
  primaryText: {
    color: "#fff",
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    fontSize: 16,
    alignSelf: "center",
  },
  dateText: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    marginEnd: 8,
    // textAlignVertical:"center"
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
  dateView: {
    flexDirection: "row",
    justifyContent: "center",
    // borderColor: borderColor,
    // borderWidth: borderWidth,
    // paddingHorizontal: 12,
    // paddingVertical: 12,
    // borderRadius: 8,
    marginTop: 8,
    // marginEnd: 16,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    backgroundColor: primaryColor_50,
    marginStart: -16, //todo check for alternatives
  },
  androidDateView: {
    flexDirection: "row",
    justifyContent: "center",
    borderColor: borderColor,
    borderWidth: borderWidth,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
    marginEnd: 16,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#fff",
  },
  leaveInfoText: {
    fontFamily: "RHD-Medium",
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
    color: primaryColor_800,
    backgroundColor: primaryColor_50,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#000000BC",
  },
  errorView: {
    flexDirection: "row",
    marginStart: 6,
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 8,
  },
});
