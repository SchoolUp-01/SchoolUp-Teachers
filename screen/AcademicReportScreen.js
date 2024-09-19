import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  FlatList,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import {
  primaryText,
  secondaryText,
} from "../utils/Color";
import EmptyState from "../components/EmptyState";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import StudentReportShimmer from "../components/Shimmers/StudentReportShimmer";
import BottomModal from "../components/Modals";
import { OptionsButton } from "../components/Buttons";
import AcademicReportItem from "../components/AcademicReportItem";

const AcademicReportScreen = () => {
  const navigation = useNavigation();
  const [reportInfo, setReportInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [remarkInfo, setRemarkInfo] = useState(null);

  useEffect(() => {
    supabase_api.shared
      .getIncompleteAcademicReportInfo()
      .then((res) => {
        setReportInfo(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "AcademicReportScreen: getStudentReportInfo: ",
          error
        );
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const onRaiseConcern = () => {
    toggleModal();
    navigation.navigate("RaiseConcernScreen", {
      type: "Academics Report",
    });
  };

  const showRemarkDialog = (info) => {
    if (info == null) return;
    setRemarkInfo(info);
    setShowDialog(true);
  };

  const renderContent = () => {
    if (loading) {
      return <StudentReportShimmer />;
    } else if (reportInfo.length == 0) {
      return (
        <EmptyState
          title="No Information available"
          description="No Reports available at the moment, please check back later."
          animation={require("../assets/animations/no_data.json")}
        />
      );
    } else {
      return (
        <>
          <ScrollView>
            <FlatList
              contentContainerStyle={{ paddingVertical: 8 }}
              data={reportInfo}
              renderItem={({ item, index }) => (
                <AcademicReportItem item={item} />
              )}
              keyExtractor={(item, index) => index.toString()}
            />
          </ScrollView>
        </>
      );
    }
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <BottomModal isVisible={modalVisible} onClose={toggleModal}>
        <OptionsButton
          icon="alert-circle"
          name={"Raise Concern"}
          color={primaryText}
          callBack={onRaiseConcern}
        />
      </BottomModal>
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <Title>Academic Reports</Title>
        <MenuItem onPress={() => toggleModal()}>
          <Feather name={"more-horizontal"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      <ContentView>{renderContent()}</ContentView>
    </Container>
  );
};

const styles = StyleSheet.create({
  examView: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 16,
  },
  examHeader: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    color: primaryText,
  },
  examSubHeader: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "RHD-Regular",
    color: primaryText,
  },
  label: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    color: secondaryText,
    textAlign: "left",
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
});
export default React.memo(AcademicReportScreen);
