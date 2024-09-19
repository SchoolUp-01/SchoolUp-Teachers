import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Alert,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import TimeTableView, { genTimeBlock } from "react-native-timetable";
import {
  Container,
  MenuItem,
  Title,
  TitleHeader,
  TitleSubHeader,
  TitleView,
  Toolbar,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_300,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import supabase_api from "../backend/supabase_api";
import PagerView from "react-native-pager-view";
import BottomModal from "../components/Modals";
import { OptionsButton } from "../components/Buttons";
import EmptyState from "../components/EmptyState";
import { getFormattedDay } from "../utils/DateUtils";
let days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

export default class TimeTableScreen extends Component {
  constructor(props) {
    super(props);
    this.numOfDays = 6;
    this.pivotDate = genTimeBlock("mon");
    let day = days[new Date().getDay()];
    this.today = genTimeBlock(day);
  }
  viewPager = React.createRef(null);
  tabList = ["Week View", "Current Day"];
  state = {
    eventList: [],
    selectedPage: 0,
    modalVisible: false,
    emptyState: false,
    tab: this.tabList[0],
  };

  componentDidMount() {
    this.getTimeTable();
  }

  getTimeTable = () => {
    supabase_api.shared.getTimeTable().then((res) => {
      if (res.length !== 0) {
        this.generateEvents(res);
        this.setState({
          emptyState: false,
        });
      } else
        this.setState({
          emptyState: true,
        });
    });
  };

  generateEvents = (classes) => {
    let events = [];
    for (let i = 0; i < classes.length; i++) {
      console.log("classes", classes[i]);
      let currentClass = classes[i];
      let event = {
        title: currentClass.title,
        startTime: genTimeBlock(
          currentClass.day,
          currentClass.start_hour,
          currentClass.start_minute
        ),
        endTime: genTimeBlock(
          currentClass.day,
          currentClass.end_hour,
          currentClass.end_minute
        ),
        location:
          getFormattedDay(currentClass?.class_info?.standard) +
          " " +
          currentClass?.class_info?.section +
          "",
        // extra_descriptions: [currentClass?.subject_info?.teacher_info?.name],
      };
      events.push(event);
    }
    this.setState({
      eventList: events,
    });
  };

  calculateCurrentTimePosition = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    // Calculate the position of the current time in the timetable (adjust the values based on your timetable layout)
    const totalTimetableMinutes = 24 * 60; // Total minutes in a 24-hour timetable
    const timetableHeight = 500; // Height of the timetable
    const position =
      ((totalTimetableMinutes - totalMinutes) / totalTimetableMinutes) *
      timetableHeight;

    return position + 176;
  };

  scrollViewRef = (ref) => {
    this.timetableRef = ref;
  };

  onEventPress = (evt) => {
    Alert.alert("onEventPress", JSON.stringify(evt));
  };

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  };

  onRaiseConcern = () => {
    this.toggleModal();
    this.props.navigation.navigate("RaiseConcernScreen", {
      type: "Time Table",
    });
  };

  tabItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ alignSelf: "center", justifyContent: "center", flex: 1 }}
        onPress={() => {
          this.viewPager.current.setPage(this.tabList.indexOf(item));
        }}
      >
        <View
          style={[
            styles.tabItem,
            {
              borderColor: item == this.state.tab ? primaryColor : borderColor,
              borderBottomWidth: item == this.state.tab ? 1 : 0,
            },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              {
                // color: item == this.state.tab ? primaryColor : primaryText,
                // fontFamily: item == this.state.tab ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {item}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderContent = () => {
    return (
      <>
        {/* <View
          style={{
            flexDirection: "row",
            height: 48,
            borderBottomWidth: borderWidth,
            borderBottomColor: borderColor,
            marginBottom: 8,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              this.viewPager.setPage(0);

              this.setState({
                selectedPage: 0,
              });
            }}
          >
            <View
              style={{
                marginHorizontal: 16,
                height: 48,
                flex: 1,
                borderColor:
                  this.state.selectedPage == 0 ? primaryText : borderColor,
                borderBottomWidth: this.state.selectedPage == 0 ? 1 : 0,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily:
                    this.state.selectedPage == 0 ? "RHD-Medium" : "RHD-Regular",
                  color:
                    this.state.selectedPage === 0 ? primaryText : secondaryText,
                }}
              >
                Week View
              </Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
            onPress={() => {
              this.viewPager.setPage(1);
              this.setState({
                selectedPage: 1,
              });
            }}
          >
            <View
              style={{
                marginHorizontal: 16,
                flex: 1,
                height: 48,
                borderColor:
                  this.state.selectedPage == 1 ? primaryText : borderColor,
                borderBottomWidth: this.state.selectedPage,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 16,
                  fontFamily:
                    this.state.selectedPage == 1 ? "RHD-Medium" : "RHD-Regular",
                  color:
                    this.state.selectedPage === 1 ? primaryText : secondaryText,
                }}
              >
                Current Day
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View> */}
        <View style={styles.tabView}>
          {this.tabItem(this.tabList[0])}
          {this.tabItem(this.tabList[1])}
        </View>

        <PagerView
          ref={(ref) => {
            this.viewPager = ref;
          }}
          style={{
            flex: 1,
          }}
          initialPage={this.state.selectedPage}
          onPageSelected={(position) => {
            this.setState({
              selectedPage: position.nativeEvent.position,
            });
          }}
        >
          <View>
            <TimeTableView
              scrollViewRef={this.scrollViewRef}
              events={this.state.eventList}
              pivotTime={9}
              pivotEndTime={15}
              pivotDate={this.pivotDate}
              nDays={this.numOfDays}
              onEventPress={this.onEventPress}
              headerStyle={styles.headerStyle}
              formatDateHeader="ddd"
              locale="en"
            />
          </View>
          <View>
            <TimeTableView
              events={this.state.eventList}
              pivotTime={9}
              pivotEndTime={15}
              pivotDate={this.today}
              nDays={1}
              onEventPress={this.onEventPress}
              headerStyle={styles.headerStyle}
              formatDateHeader="ddd"
              locale="en"
            />
          </View>
        </PagerView>
      </>
    );
  };

  render() {
    return (
      <Container>
        <CustomStatusBarView barStyle="dark-content" />
        <BottomModal
          isVisible={this.state.modalVisible}
          onClose={this.toggleModal}
        >
          {/* <OptionsButton
            icon="users"
            name={"Talk to Class teacher"}
            color={primaryText}
            callBack={this.onRaiseConcern}
          /> */}
          <OptionsButton
            icon="alert-circle"
            name={"Raise Concern"}
            color={primaryText}
            callBack={this.onRaiseConcern}
          />
        </BottomModal>
        <Toolbar>
          <MenuItem onPress={() => this.props.navigation.goBack()}>
            <Feather name={"arrow-left"} size={24} color={primaryText} />
          </MenuItem>
          <Title>Time Table</Title>
          <MenuItem
            onPress={() => {
              this.toggleModal();
            }}
          >
            <Feather name={"more-horizontal"} size={20} color={primaryText} />
          </MenuItem>
        </Toolbar>

        {!this.state.emptyState ? (
          this.renderContent()
        ) : (
          <EmptyState
            title="No Information available"
            description="No TimeTable available at the moment, please check back later."
            animation={require("../assets/animations/no_data.json")}
          />
        )}
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  headerStyle: {
    backgroundColor: primaryColor_300,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
    textAlign: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  tabItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 6,
    borderRadius: 16,
    alignItems: "center",
    alignSelf: "center",
    // backgroundColor: itemColor,
  },
  tabView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
});
