import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from "react-native";
import {
  Container,
  ContentView,
  Title,
  ToolbarBorder,
  MenuItem as MI,
  ScreenHint,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation, useRoute } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";
import React, { useEffect, useState } from "react";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";
import { EventLabel, NoticeLabel } from "../components/Label";
import PreviewContentList from "../components/PreviewContentList";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import { InformationView } from "../components/Modals";
const { width, height } = new Dimensions.get("screen");
const AnnouncementSettingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(route.params.data);
  const [type, setType] = useState("School");
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartDate, setShowStartDate] = useState(false);
  const [showStartTime, setShowStartTime] = useState(false);
  const [showEndTime, setShowEndTime] = useState(false);

  useEffect(() => {
    return () => {};
  }, []);

  const handleSubmit = () => {
    if (loading) return;
    setLoading(true);
    supabase_api.shared
      .addAnnouncement(data, type, startDate, endDate)
      .then((res) => {
        console.log("success", res);
        navigation.goBack();
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "AnnouncementSettingScreen: addAnnouncement: ",
          error
        );
      });
  };

  const onStartTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setStartTime(currentTime);
    setShowStartTime(false);
  };

  const onEndTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setEndTime(currentTime);
    setShowEndTime(false);
  };

  const setDateStart = (event, date) => {
    setShowStartDate(false);
    setStartDate(date);
  };

  const MenuItem = ({ label, icon, color = primaryColor }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setType(label);
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

  const renderLabel = () => {
    if (data?.type === "Notice") {
      return <NoticeLabel />;
    } else if (data?.type === "Event") {
      return <EventLabel />;
    } else {
    }
    return (
      <View>
        <Text
          style={{
            fontSize: 14,
            lineHeight: 21,
            color: primaryText,
            fontFamily: "RHD-Medium",
            marginHorizontal: 20, // Added for spacing between texts
          }}
        >
          {data?.type}
        </Text>
      </View>
    );
  };

  const renderAnnouncementDetails = () => {
    const { title, type, description, mediaList } = data;
    return (
      <TouchableHighlight activeOpacity={0.95} underlayColor={underlayColor}>
        <View style={styles.feedItem}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center", // Added for vertical centering
            }}
          >
            <Text
              style={{
                fontSize: 16,
                lineHeight: 20,
                fontFamily: "RHD-Medium",
                color: primaryText,
                flex: 1, // Added to take remaining space
              }}
              numberOfLines={2} // Limit title to one line
            >
              {title}
            </Text>
            {/* {renderLabel()} */}
          </View>

          {description.length !== 0 && (<View
            style={{
              flexDirection: "row",
              marginTop: 4,
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                lineHeight: 21,
                overflow: "hidden",
                color: secondaryText,
                fontFamily: "RHD-Medium",
              }}
              numberOfLines={4}
            >
              {description}
            </Text>
          </View>)}
          {mediaList.length !== 0 && (
            <View>
              <PreviewContentList mediaList={mediaList} />
            </View>
          )}
          {mediaList.length === 0 && (
            <View style={{flexDirection:"row",paddingVertical:8,alignItems:'center'}}>
              <Feather name="info" color={secondaryText} size={12} />
              <Text style={{fontFamily:"RHD-Regular",marginStart:8,color:secondaryText}}>No Attachment Added</Text>
            </View>
          )}
        </View>
      </TouchableHighlight>
    );
  };

  const renderIOSDate = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View>
          <Text style={styles.informationLabel}>{"Date"}</Text>
          <DateTimePicker
            style={{
              marginStart: -16,
              padding: 0,
              backgroundColor: "#fff",
            }}
            testID="dateTimePicker"
            value={startDate}
            mode={"date"}
            is24Hour={true}
            onChange={setDateStart}
            textColor={primaryColor}
            accentColor={primaryColor}
            backgroundColor={"#fff"}
            minimumDate={new Date()}
          />
        </View>
        <View style={{ marginStart: 16 }}>
          <Text style={styles.informationLabel}>{"Start Time"}</Text>
          <DateTimePicker
            style={{
              marginStart: -16,
              padding: 0,
              backgroundColor: "#fff",
            }}
            testID="startTimePicker"
            value={startTime}
            mode={"time"}
            is24Hour={true}
            onChange={onStartTimeChange}
            textColor={primaryColor}
            accentColor={primaryColor}
            backgroundColor={"#fff"}
          />
        </View>
        <View style={{ marginStart: 16 }}>
          <Text style={styles.informationLabel}>{"End Time"}</Text>

          <DateTimePicker
            style={{
              marginStart: -16,
              padding: 0,
              backgroundColor: "#fff",
            }}
            testID="dateTimePicker"
            value={endTime}
            mode={"time"}
            is24Hour={true}
            onChange={onEndTimeChange}
            textColor={primaryColor}
            accentColor={primaryColor}
            backgroundColor={"#fff"}
          />
        </View>
      </View>
    );
  };

  const renderAndroidDate = () => {
    return (
      <View style={{ flexDirection: "row" }}>
        <View style={{}}>
          <Text style={styles.informationLabel}>{"Date"}</Text>
          <TouchableOpacity onPress={() => setShowStartDate(true)}>
            <View style={styles.androidDateView}>
              <Text style={styles.dateText}>{startDate.toDateString()}</Text>
              {showStartDate && (
                <DateTimePicker
                  style={{ margin: 0, padding: 0, backgroundColor: "#fff" }}
                  testID="dateTimePicker"
                  value={startDate}
                  mode={"date"}
                  is24Hour={true}
                  onChange={setDateStart}
                  textColor={primaryColor}
                  accentColor={primaryColor}
                  backgroundColor={"#fff"}
                  minimumDate={new Date()}
                />
              )}
            </View>
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <Text style={styles.informationLabel}>{"Start Time"}</Text>
          <TouchableOpacity onPress={() => setShowStartTime(true)}>
            <View style={styles.androidDateView}>
              {showStartTime && (
                <DateTimePicker
                  style={{ margin: 0, padding: 0, backgroundColor: "#fff" }}
                  testID="dateTimePicker"
                  value={startTime}
                  mode={"time"}
                  is24Hour={true}
                  onChange={onStartTimeChange}
                  textColor={primaryColor}
                  accentColor={primaryColor}
                  backgroundColor={"#fff"}
                />
              )}
              <Text style={styles.dateText}>
                {new Date(startTime).toLocaleTimeString()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{}}>
          <Text style={styles.informationLabel}>{"End Time"}</Text>
          <TouchableOpacity onPress={() => setShowEndTime(true)}>
            <View style={styles.androidDateView}>
              {showEndTime && (
                <DateTimePicker
                  style={{ margin: 0, padding: 0, backgroundColor: "#fff" }}
                  testID="dateTimePicker"
                  value={endTime}
                  mode={"time"}
                  is24Hour={true}
                  onChange={onEndTimeChange}
                  textColor={primaryColor}
                  accentColor={primaryColor}
                  backgroundColor={"#fff"}
                />
              )}
              <Text style={styles.dateText}>
                {new Date(endTime).toLocaleTimeString()}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEventTimings = () => {
    if (data?.type === "Notice") return;
    return (
      <View style={styles.inputView}>
        <Text style={styles.inputText}>Event Timings</Text>
        <View
          style={{
            flexDirection: "row",
            marginTop: 8,
            flexWrap: "wrap",
          }}
        >
          {Platform.OS == "ios" ? renderIOSDate() : renderAndroidDate()}
        </View>
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MI onPress={() => navigation.goBack()}>
          <Feather
            style={{ marginEnd: 16 }}
            name="arrow-left"
            color={primaryText}
            size={24}
          />
        </MI>
        <Title>{data?.type} Setting</Title>
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
            Publish
          </Text>
        </TouchableOpacity>
      </ToolbarBorder>
      <ContentView>
        <ScrollView>
          {renderAnnouncementDetails()}
          {renderEventTimings()}
          <View style={styles.inputView}>
            <Text style={styles.inputText}>Recipients</Text>
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
        </ScrollView>
        {/* <TouchableOpacity onPress={() => handleSubmit()}>
          <View style={styles.primaryButton}>
            {loading && <ActivityIndicator size={36} color={"#fff"} />}
            {!loading && (
              <Text style={styles.primaryText}>Publish Announcement</Text>
            )}
          </View>
        </TouchableOpacity> */}
      </ContentView>
    </Container>
  );
};

const styles = StyleSheet.create({
  feedItem: {
    flex: 1,
    marginVertical: 8,
    // padding: 8,
    // borderWidth: borderWidth,
    // borderColor: borderColor,
    marginHorizontal: 16,
    borderRadius: 8,
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
    backgroundColor: primaryColor,
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
    fontFamily: "RHD-Medium",
    fontSize: 16,
    alignSelf: "center",
  },
  informationLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    textAlign: "left",
    marginBottom: 4,
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
});

export default React.memo(AnnouncementSettingScreen);
