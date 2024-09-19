import React, { useState, useEffect } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  Toolbar,
} from "../../components/styledComponents";
import { useNavigation } from "@react-navigation/native";
import CustomStatusBarView from "../../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../../utils/Color";
import ManageChildrenScreenShimmer from "../../components/Shimmers/ManageChildrenScreenShimmer";
import supabase_api from "../../backend/supabase_api";
import ErrorLogger from "../../utils/ErrorLogger";
import { RemoveChildDialog } from "../../components/Modals";
import { student_info_db } from "../../utils/Constants";
import InAppNotification from "../../utils/InAppNotification";
import EmptyState from "../../components/EmptyState";

export default function ManageChildrenScreen() {
  const navigation = useNavigation();
  const [masterStudentInfoList, setMasterStudentInfoList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [studentID, setStudentID] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentInfo, setStudentInfo] = useState(null);
  const [studentIndex, setStudentIndex] = useState(null);

  

  useEffect(() => {
    supabase_api.shared
      .getMasterStudentInfoList(Student.shared.getStudentMasterList())
      .then((res) => {
        Student.shared.setMasterListInfo(res)
        setMasterStudentInfoList(res);
      })
      .catch((error) =>
        ErrorLogger.shared.ShowError(
          "ManageChildrenScreen: getMasterStudentInfo: ",
          error
        )
      )
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  useEffect(() => {
    handleMasterListUpdate = (newData) => {
      setMasterStudentInfoList(newData);
    };

    Student.shared.subscribeMasterList(handleMasterListUpdate);

    return () => {
      Student.shared.unsubscribeMasterList(handleMasterListUpdate);
    };
  }, []);


  const handleRemove = () => {
    if (studentID !== null) {
      supabase_api.shared
        .removeStudentFromParentList(studentID)
        .then((res) => {
          Student.shared.removeMasterListInfo(studentIndex)
          if (studentID === Student.shared.studentID) {
            let masterList = Student.shared.getStudentMasterList();
            if (masterList?.length === 0) {
              Student.shared.setStudentID(null);
              Student.shared.setStudentInfoComplete(null);
            } else {
              const masterStudent = masterStudentInfoList.find(
                (student) => student.id === masterList[0]
              );
              if (masterStudent !== null) {
                Student.shared.setStudentID(masterStudent.id);
                Student.shared.setStudentInfoComplete(masterStudent);
              } else {
                Student.shared.setStudentID(null);
                Student.shared.setStudentInfoComplete(null);
              }
            }
          }

          InAppNotification.shared.showSuccessNotification({
            title: "Student removed from list",
            description: "",
          });
          setMasterStudentInfoList(masterStudentInfoList.filter(obj => obj.id !== studentID))
        })
        .catch((error) => {
          ErrorLogger.shared.ShowError(
            "ManageChildrenScreen: removeStudentFromParentList: ",
            error
          );
        })
        .finally(() => setShowDialog(false));
    }
  };

  const InformationView = ({ label, value }) => {
    return (
      <View style={styles.informationView}>
        <Text style={styles.informationLabel}>{label}</Text>
        <Text style={styles.informationValue}>{value}</Text>
      </View>
    );
  };

  const StudentItem = ({ item,index }) => {
    const {
      id,
      name,
      avatar,
      roll_no,
      home_address,
      school_info: { name: schoolName },
      class_info: {
        standard,
        section,
        teacher_info: { name: teacherName, avatar: teacherAvatar },
      },
    } = item;
      return (
        <View style={styles.studentInfoView}>
          <View style={styles.container}>
            <Image
              style={styles.avatar}
              defaultSource={require("../../assets/DefaultImage.jpg")}
              source={{ uri: avatar }}
            ></Image>
            <View style={styles.middleView}>
              <Text style={styles.headerText}>{name}</Text>
              <Text style={styles.subText}>{schoolName}</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  setStudentID(id);
                  setStudentName(name);
                  setStudentInfo(item);
                  setShowDialog(true);
                }}
                style={styles.secondaryView}
              >
                <Text style={styles.secondaryText}>Remove Student</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.informationContainer}>
            <View style={{ flexDirection: "row" }}>
              <InformationView
                label="Standard"
                value={standard + " " + section + " section"}
              />
              <InformationView label="Class Teacher" value={teacherName} />
              <InformationView label="Roll No" value={roll_no} />
            </View>
            <View style={styles.informationContainer}>
              <InformationView
                label="Home Address"
                value={home_address ?? "No Information Available"}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("EditStudentScreen", {
                user: item,
                index:index
              });
            }}
            style={styles.primaryButton}
          >
            <Text style={styles.primaryText}>Edit Information</Text>
          </TouchableOpacity>
        </View>
      );
  };

  const renderEmpty = () => {
    if (loading) {
      return <ManageChildrenScreenShimmer />;
    } else if (!loading && masterStudentInfoList.length === 0) {
      return (
        <EmptyState
          title="No Children added"
          description="Add your children to SchoolUp and be part of their overall development."
          animation={require("../../assets/no_student.json")}
          primaryButtonText="Add Children"
          primaryOnClick={() => navigation.navigate("SelectSchoolScreen")}
        />
      );
    }
  };

  return (
    <Container style={{ backgroundColor: primaryColor_50 }}>
      <CustomStatusBarView
        bar-style={"light-content"}
        backgroundColor={primaryColor_50}
      />
      <Toolbar>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryText} />
        </MenuItem>
        <Title>Manage Children</Title>
      </Toolbar>
      <ContentView style={{ backgroundColor: primaryColor_50 }}>
        <FlatList
          data={masterStudentInfoList}
          renderItem={({ item,index }) => <StudentItem item={item} index={index} />}
          keyExtractor={(item, index) => String(index)}
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
        />
      </ContentView>

      {/* Confirmation dialog */}
      <RemoveChildDialog
        isVisible={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={handleRemove}
        childName={studentName}
      />
    </Container>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: defaultImageBgColor,
    borderWidth: borderWidth,
    borderColor: borderColor,
  },
  middleView: {
    marginHorizontal: 16,
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Bold",
  },
  subText: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "RHD-Medium",
    color: secondaryText,
  },
  secondaryView: {
    backgroundColor: primaryColor_50,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  secondaryText: {
    fontSize: 14,
    lineHeight: 21,
    color: primaryColor_800,
    fontFamily: "RHD-Medium",
  },
  studentInfoView: {
    paddingHorizontal: 16,
    marginHorizontal: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: "#fff",
  },
  informationContainer: {
    marginTop: 16,
    borderTopColor: borderColor,
    borderTopWidth: borderWidth,
  },
  informationView: {
    justifyContent: "space-between",
    paddingVertical: 8,
    // height: 60,
    flexShrink: 1,
    flexGrow: 1,
  },
  informationLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    textAlign: "left",
  },
  informationValue: {
    flex: 1,
    textAlign: "right",
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "left",
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: primaryColor_800,
    height: 48,
    borderRadius: 8,
    marginVertical: 8,
  },
  primaryText: {
    fontSize: 16,
    fontFamily: "RHD-Medium",
    color: primaryColor_50,
  },
});
