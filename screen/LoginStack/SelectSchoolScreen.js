import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from "react-native";
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
  primaryText,
  underlayColor,
} from "../../utils/Color";
import { useNavigation } from "@react-navigation/native";
import supabase_api from "../../backend/supabase_api";
import StudentDetailsTab from "../../components/TeachersDetailsTab";
import ErrorLogger from "../../utils/ErrorLogger";

const { width, height } = new Dimensions.get("screen");
export default function SelectSchoolScreen() {
  const navigation = useNavigation();
  const [schoolID, setSchoolID] = useState(
    "172ee426-74fd-4b06-b353-7c319178d18c"
  );
  const [studentError, setStudentError] = useState("");
  const [isStudentFocused, setIsStudentFocused] = useState(false);
  const [schoolName, setSchoolName] = useState("");
  const [schoolError, setSchoolError] = useState("");
  const [isSchoolFocused, setIsSchoolFocused] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const [loading, setLoading] = useState(false);
  const [studentInfo, setStudentInfo] = useState("");
  const [studentInfoError, setStudentInfoError] = useState(false);
  const [studentAddedError, setStudentAddedError] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const schoolIDRef = useRef();
  const schoolNameRef = useRef();

  useEffect(() => {
    if (schoolName.length > 0) {
      const timer = setTimeout(() => {
        fetchSuggestions();
      }, 100); // Adjust the debounce time as needed

      return () => clearTimeout(timer);
    }
  }, [schoolName]);

  const fetchSuggestions = () => {
    try {
      supabase_api.shared
        .getSchoolNameSuggestions(schoolName)
        .then((res) => {
          setSuggestions(res || []);
          setShowSuggestions(true);
        })
        .catch((error) => {
          ErrorLogger.shared.ShowError(
            "SelectSchoolScreen: getSchoolNameSuggestions: ",
            error
          );
        });
    } catch (error) {
      ErrorLogger.shared.ShowError(
        "SelectSchoolScreen: getSchoolNameSuggestions: ",
        error
      );
    }
  };

  const handleStudentUniqueID = (text) => {
    setSchoolID(text);
    if (text !== "") setSchoolError("");
    setButtonDisabled(text == "" || schoolName == "");
  };

  const handleSchoolNameChange = (text) => {
    setIsSchoolFocused(true);
    setSchoolName(text);
    if (text !== "") setSchoolError("");
    setButtonDisabled(schoolID == "" || text == "");
  };

  const handleFindStudent = async () => {
    if (buttonDisabled) return;
    setLoading(true);
    setStudentAddedError(false);
    setStudentInfoError(false);
    supabase_api.shared
      .getStudentDetailsWithVerification(
        schoolID,
        schoolName,
        "id,name,avatar,class_info!inner(id,standard,section,classteacher_id,teacher_info(name,avatar)),school_info!inner(id,name)"
      )
      .then((res) => {
        if (res === null) setStudentInfoError(true);
        else {
          setStudentInfo(res);
          let alreadyAdded = Student.shared.isAlreadyAdded(schoolID);
          setButtonDisabled(alreadyAdded);
          if (alreadyAdded) setStudentAddedError(true);
        }
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "SelectSchoolScreen: handleFindStudent: ",
          error
        );
      })
      .finally(() => setLoading(false));
  };

  const AddStudentToParentList = () => {
    if (!buttonDisabled && !loading) {
      setLoading(true);
      supabase_api.shared
        .addStudentToParentList(studentInfo?.id)
        .then((res) => {
          Student.shared.setStudentInfoComplete(studentInfo);
          Student.shared.addMasterListInfo(studentInfo);
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate("HomeScreen");
          }
        })
        .catch((error) => {
          ErrorLogger.shared.ShowError(
            "SelectSchoolScreen: AddStudentToParentList: ",
            error
          );
        })
        .finally(() => setLoading(false));
    }
  };

  const renderStudentInfo = () => {
    if (!studentInfoError && studentInfo !== "" && !!studentInfo) {
      return <StudentDetailsTab info={studentInfo} />;
    } else {
      return (
        <>
          <View style={styles.inputView}>
            <Text style={styles.inputText}>School Unique Id</Text>

            <TextInput
              ref={schoolIDRef}
              style={[
                styles.input,
                {
                  borderColor: isStudentFocused
                    ? studentError != ""
                      ? "#ff0033"
                      : primaryColor
                    : borderColor,
                  borderWidth: isStudentFocused ? 1 : borderWidth,
                },
              ]}
              onChangeText={(text) => handleStudentUniqueID(text)}
              onSubmitEditing={() => schoolNameRef.current.focus()}
              value={schoolID}
              selectionColor={studentError ? "#ff0033" : primaryColor}
              autoCapitalize="none"
              placeholder={"xxxx-xxxx-xxxx-xxxx"}
              placeholderTextColor={borderColor ?? underlayColor}
              onFocus={() => setIsStudentFocused(true)}
              onBlur={() => setIsStudentFocused(false)}
            ></TextInput>
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputText}>School Name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: isSchoolFocused
                    ? schoolError != ""
                      ? "#ff0033"
                      : primaryColor
                    : borderColor,
                  borderWidth: isSchoolFocused ? 1 : borderWidth,
                },
              ]}
              onChangeText={(text) => handleSchoolNameChange(text)}
              onSubmitEditing={() => handleFindStudent()}
              value={schoolName}
              selectionColor={studentError ? "#ff0033" : primaryColor}
              autoCapitalize="none"
              placeholder={"Enter School name"}
              placeholderTextColor={borderColor ?? underlayColor}
              onFocus={() => {
                setIsSchoolFocused(true);
                handleFocus();
              }}
              onBlur={() => setIsSchoolFocused(false)}
            ></TextInput>
          </View>
          {studentInfoError && (
            <View style={styles.errorView}>
              <Feather color={"#ff0033"} size={16} name="alert-circle" />
              <ErrorText style={{ fontSize: 14, marginStart: 12 }}>
                {
                  "No School Information found, please check School details and try again."
                }
              </ErrorText>
            </View>
          )}
        </>
      );
    }
  };

  const handleFocus = () => {
    // Simulated suggestions for demonstration
    const dummySuggestions = ["Suggestion 1", "Suggestion 2", "Suggestion 3"];
    // setSuggestions(dummySuggestions);
    setShowSuggestions(true);
  };

  const renderSuggestions = () => {
    if (isSchoolFocused && suggestions.length != 0) {
      return (
        <View style={styles.suggestionContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setSchoolName(suggestion?.name);
                setShowSuggestions(false);
                setIsSchoolFocused(false);
              }}
            >
              <Text style={styles.suggestionText}>{suggestion.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      );
    }
    return null;
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
                <Text style={styles.headerText}>Select School</Text>
              </View>
              <Text style={styles.subText}>
                Provide details about your School and any other pertinent
                information.
              </Text>
            </View>
            <Text style={styles.basicHeaderText}>School Information</Text>

            {renderStudentInfo()}
            {studentAddedError && (
              <View style={styles.errorView}>
                <Feather color={"#ff0033"} size={16} name="alert-circle" />
                <ErrorText style={{ fontSize: 14, marginStart: 12 }}>
                  {"Student already added to the list."}
                </ErrorText>
              </View>
            )}
            <TouchableOpacity
              disabled={loading}
              onPress={() => {
                studentInfo == ""
                  ? handleFindStudent()
                  : AddStudentToParentList();
              }}
            >
              <View style={buttonDisabled ? styles.disabled : styles.button}>
                {loading && <ActivityIndicator color="#fff" size={24} />}
                {!loading && (
                  <Text style={styles.primaryText}>
                    {studentInfo == "" ? "Find School" : "Select Student"}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {renderSuggestions()}
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
  },
  primaryButton: {
    backgroundColor: primaryColor_300,
    marginVertical: 24,
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
    fontSize: 18,
    alignSelf: "center",
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
  errorView: {
    flexDirection: "row",
    marginStart: 6,
    alignItems: "center",
    paddingHorizontal: 16,
    marginTop: 16,
  },
  suggestionContainer: {
    position: "absolute",
    flex: 1,
    width: width - 32,
    top: 320, // Adjust this value to position the suggestion view
    left: 16, // Adjust this value to position the suggestion view
    backgroundColor: "white",
    borderWidth: borderWidth,
    borderColor: borderColor,
    padding: 10,
    zIndex: 1,
  },
  suggestionText: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
  },
});
