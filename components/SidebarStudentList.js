import React, { useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  LogBox,
} from "react-native";
import SidebarStudentItem from "./SidebarStudentItem";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import { useNavigation } from "@react-navigation/native";
import { borderWidth, primaryColor } from "../utils/Color";

export default function SidebarStudentList() {
  const navigation = useNavigation();
  const [studentMasterList, setStudentMasterList] = useState([]);
  useEffect(() => {
    LogBox.ignoreLogs([
      /VirtualizedLists should never be nested inside plain ScrollViews/,
    ]);
    let masterList = Student.shared.getMasterListInfo();
    setStudentMasterList(masterList)     
    console.log("MasterList: ",Student.shared.getStudentMasterList())
    let studentIDList = Student.shared.getStudentMasterList();
    if(studentIDList === null  ){
      console.log("Calling getParent Info")
      supabase_api.shared.getParentInfo(supabase_api.shared.uid,"children_list").then((res)=>{
        console.log("Sidebar: childrenList: ",res)
        Student.shared.setStudentMasterList(res?.children_list)
      }).catch((error)=>{
        ErrorLogger.shared.ShowError("SidebarStudentList: getParentInfo: ",error)
      }).finally(()=>{
        fetchStudentInfo()
      })
    }else{
      fetchStudentInfo()
    }
    return () => {};
  }, []);

  const fetchStudentInfo =()=>{
    supabase_api.shared
    .getMasterStudentInfoList(Student.shared.getStudentMasterList())
    .then((res) => {
      console.log("masterList: ",res)
      Student.shared.setMasterListInfo(res);
      setStudentMasterList(res);
    })
    .catch((error) =>
      ErrorLogger.shared.ShowError(
        "SidebarStudentList: getMasterStudentInfoList: ",
        error
      )
    )
    .finally(() => setLoading(false));
  }

  useEffect(() => {
    handleMasterListUpdate = (newData) => {
      console.log("masterList: ", newData);
      setStudentMasterList(newData);
    };

    Student.shared.subscribeMasterList(handleMasterListUpdate);

    return () => {
      Student.shared.unsubscribeMasterList(handleMasterListUpdate);
    };
  }, []);

  const renderFooter = () => {
    return (
      <View style={{paddingVertical:16}}>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("SelectSchoolScreen")}
        >
          <Text style={styles.addButtonLabel}>Add Children</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() =>
            navigation.navigate("ProfileStack", {
              screen: "ManageChildrenScreen",
            })
          }
        >
          <Text style={styles.mangeButtonLabel}>Manage Children</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      contentContainerStyle={{ marginTop: 12, paddingHorizontal: 16 }}
      data={studentMasterList}
      renderItem={({ item }) => <SidebarStudentItem item={item} />}
      keyExtractor={(item, index) => String(index)}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      ListFooterComponent={renderFooter}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  addButton: {
    borderRadius: 24,
    backgroundColor: primaryColor,
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  addButtonLabel: {
    paddingHorizontal: 24,
    color: "#FFFFFF",
    fontFamily: "RHD-Bold",
  },
  manageButton: {
    borderRadius: 24,
    borderColor: primaryColor,
    borderWidth: borderWidth,
    marginTop: 8,
    paddingVertical: 12,
    alignItems: "center",
  },
  mangeButtonLabel: {
    paddingHorizontal: 24,
    color: primaryColor,
    fontFamily: "RHD-Bold",
  },
});
