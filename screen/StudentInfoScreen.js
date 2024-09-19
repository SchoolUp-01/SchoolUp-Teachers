import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import MemoriesList from "../components/MemoriesList";
import { useEffect, useState } from "react";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";

export default function StudentInfoScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [studentStatistics, setStudentStatistics] = useState(null);

  useEffect(() => {
    supabase_api.shared
      .getStudentStatistics(
        Student.shared.studentID,
        "weight,height,blood_group"
      )
      .then((res) => {
        setStudentStatistics(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "StudentInfoScreen: getStudentStatistics: ",
          error
        );
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  const RenderStudentInfo = () => {
    const {
      avatar,
      class_info,
      id,
      name,
      school_info: { name: schoolName },
    } = Student.shared.getStudentInfo();
    return (
      <View style={styles.container}>
        <Image
          style={styles.avatar}
          defaultSource={require("../assets/DefaultImage.jpg")}
          source={{ uri: avatar }}
        ></Image>
        <View style={styles.middleView}>
          <Text
            style={{
              fontSize: 16,
              lineHeight: 24,
              fontFamily: "RHD-Bold",
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              lineHeight: 18,
              fontFamily: "RHD-Medium",
              color: secondaryText,
            }}
          >
            {schoolName}
          </Text>
        </View>
        <View>
          <View
            style={{
              backgroundColor: primaryColor_50,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
            }}
          >
            <Text
              style={{
                fontSize: 12,
                lineHeight: 18,
                color: primaryColor_800,
                fontFamily: "RHD-Medium",
              }}
            >
              {Student.shared.getMasterStudentSectionDetails()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const RenderStudentBioDetails = () => {
    if (loading) return;

    const { weight, height, blood_group } = studentStatistics;
    if (weight && height && blood_group) {
      return (
        <View style={styles.infoView}>
          <View style={styles.infoItemView}>
            <Text style={styles.infoValue}>45 KG</Text>
            <Text style={styles.iconLabel}>Weight</Text>
          </View>
          <View style={styles.infoItemView}>
            <Text style={styles.infoValue}>5'2 ft</Text>
            <Text style={styles.iconLabel}>Height</Text>
          </View>
          <View style={styles.infoItemView}>
            <Text style={[styles.infoValue, { color: "green" }]}>18.1 </Text>
            <Text style={styles.iconLabel}>BMI</Text>
          </View>
          <View style={styles.infoItemView}>
            <Text style={[styles.infoValue]}>O+ </Text>
            <Text style={styles.iconLabel}>Blood Group</Text>
          </View>
          {/* <View style={styles.infoItemView}>
            <Text style={styles.iconLabel}>View{'\n'}Report</Text>
          </View> */}
        </View>
      );
    } else {
      return (
        <View>
          {/* <Text>Biometrics Information Unavailable</Text>
          <Text>Request data from School Administration?</Text> */}
        </View>
      );
    }
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" color={primaryText} size={24} />
        </MenuItem>
        <Title>Student Information</Title>
        <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Children complaint",
            });
          }}
        >
          <Feather name="alert-circle" color={primaryText} size={20} />
        </MenuItem>
      </ToolbarBorder>
      <ContentView>
        <RenderStudentInfo />
        <RenderStudentBioDetails />
        {/* <StudentInfoShimmer />  */}
        <View style={styles.feedbackView}>
          <View style={styles.avatarSmall}></View>
          <Text style={styles.feedbackText}>
            <Text style={{ fontFamily: "RHD-Bold" }}>Asha Bhosle: </Text>Rahul
            demonstrates exceptional creativity in his writing assignments,
            often crafting imaginative stories with vivid details that captivate
            his classmates.
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("StudentMemoryScreen");
          }}
        >
          <View style={styles.subView}>
            <Text style={styles.subText}>Memories</Text>
            <Feather name="chevron-right" color={primaryText} size={20} />
          </View>
        </TouchableOpacity>
        <MemoriesList />
        {/* <View style={styles.subView}>
          <Text style={styles.subText}>Awards and Recognition</Text>
          <Feather name="chevron-right" color={primaryText} size={20} />
        </View> */}
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: defaultImageBgColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 32,
    backgroundColor: defaultImageBgColor,
  },
  middleView: {
    marginHorizontal: 16,
    flex: 1,
  },
  feedbackView: {
    flexDirection: "row",
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 16,
    backgroundColor: primaryColor_50,
  },
  feedbackText: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    marginStart: 16,
    flexShrink: 1,
  },
  subView: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  subText: {
    fontSize: 16,
    fontFamily: "RHD-Medium",
    color: primaryText,
    textTransform: "capitalize",
  },
  contestDetailView: {},
  infoView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
    alignItems: "center",
    justifyContent: "space-evenly",
    paddingBottom: 8,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: "RHD-Bold",
    lineHeight: 30,
    color: primaryText,
    lineHeight: 24,
  },
  iconLabel: {
    fontSize: 14,
    fontFamily: "RHD-Medium",
    color: secondaryText,
    lineHeight: 21,
  },
  infoItemView: { flex: 1, alignItems: "center" },
});
