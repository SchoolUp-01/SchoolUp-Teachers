import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SearchScreen from "../screen/SearchScreen";
import AttendanceScreen from "../screen/DailyTaskScreen";
import TeachersScreen from "../screen/TeachersScreen";
import NotificationScreen from "../screen/NotificationScreen";
import ApplyLeaveScreen from "../screen/ApplyLeaveScreen";
import LessonPlanScreen from "../screen/LessonPlanScreen";
import TimeTableScreen from "../screen/TimeTableScreen";
import AcademicReportScreen from "../screen/AcademicReportScreen";
import BusRouteTrackerScreen from "../screen/BusRouteTrackerScreen";
import RequestMealScreen from "../screen/RequestMeal";
import FeeReceiptScreen from "../screen/FeeReceiptScreen";
import StudentInfoScreen from "../screen/StudentInfoScreen";
import HolidayCalenderScreen from "../screen/HolidayCalenderScreen";
import SchoolInformationScreen from "../screen/SchoolInformationScreen";
import RaiseConcernScreen from "../screen/RaiseConcernScreen";
import ExamScreen from "../screen/ExamScreen";
import ParentsCommunicationScreen from "../screen/ParentsCommunicationScreen";
import SubjectTopicScreen from "../screen/SubjectTopicScreen";
import StudentMemoryScreen from "../screen/StudentMemoryScreen";
import SchoolMediaScreen from "../screen/SchoolMediaScreen";
import UpdateTaskScreen from "../screen/UpdateTaskScreen";
import LeaveScreen from "../screen/LeaveScreen";
import UpdateLeaveScreen from "../screen/UpdateLeaveScreen";
import ConcernScreen from "../screen/ConcernScreen";
import AddMemoriesScreen from "../screen/AddMemoriesScreen";
import DailyTaskScreen from "../screen/DailyTaskScreen";
import AddNotificationScreen from "../screen/AddNotificationScreen";
import MediaScreen from "../screen/MediaScreen";
import AddEventScreen from "../screen/AddEventScreen";
import EventScreen from "../screen/EventScreen";
import UpdateReportsScreen from "../screen/UpdateReportsScreen";
import AnnouncementSettingScreen from "../screen/AnnouncementSettingScreen";
import MemoriesScreen from "../screen/MemoriesScreen";
import ViewTaskScreen from "../screen/ViewTaskScreen";
import UpdateConcernScreen from "../screen/UpdateConcernScreen";
import ManageClassroomScreen from "../screen/ManageClassroomScreen";
import EditMemoriesScreen from "../screen/EditMemoriesScreen";
import UpdateBiometricScreen from "../screen/UpdateBiometricScreen";

const Stack = createNativeStackNavigator();

const ActionStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SearchScreen"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="SearchScreen" component={SearchScreen} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="DailyTaskScreen" component={DailyTaskScreen} />
      <Stack.Screen name="UpdateTaskScreen" component={UpdateTaskScreen} />
      <Stack.Screen name="ViewTaskScreen" component={ViewTaskScreen} />
      <Stack.Screen name="TeachersScreen" component={TeachersScreen} />
      <Stack.Screen
        name="ParentsCommunicationScreen"
        component={ParentsCommunicationScreen}
      />
      <Stack.Screen name="LessonPlansScreen" component={LessonPlanScreen} />
      <Stack.Screen name="SubjectTopicScreen" component={SubjectTopicScreen} />
      <Stack.Screen name="ExamScreen" component={ExamScreen} />

      <Stack.Screen name="TimeTableScreen" component={TimeTableScreen} />
      <Stack.Screen name="ApplyLeaveScreen" component={ApplyLeaveScreen} />
      {/* <Stack.Screen name="MessageScreen" component={MessageScreen} />
      <Stack.Screen name="NewChatScreen" component={NewChatScreen} /> */}
      <Stack.Screen
        name="AcademicReportScreen"
        component={AcademicReportScreen}
      />
      <Stack.Screen name="FeeReceiptScreen" component={FeeReceiptScreen} />
      <Stack.Screen
        name="HolidayCalenderScreen"
        component={HolidayCalenderScreen}
      />
      <Stack.Screen
        name="BusRouteTrackerScreen"
        component={BusRouteTrackerScreen}
      />
      <Stack.Screen name="RequestMealScreen" component={RequestMealScreen} />
      <Stack.Screen name="StudentInfoScreen" component={StudentInfoScreen} />
      <Stack.Screen
        name="StudentMemoryScreen"
        component={StudentMemoryScreen}
      />
      <Stack.Screen
        name="SchoolInformationScreen"
        component={SchoolInformationScreen}
      />
      <Stack.Screen name="SchoolMediaScreen" component={SchoolMediaScreen} />
      <Stack.Screen name="RaiseConcernScreen" component={RaiseConcernScreen} />
      <Stack.Screen name="LeaveScreen" component={LeaveScreen} />
      <Stack.Screen name="UpdateLeaveScreen" component={UpdateLeaveScreen} />
      <Stack.Screen name="ConcernScreen" component={ConcernScreen} />
      <Stack.Screen name="MemoriesScreen" component={MemoriesScreen} />
      <Stack.Screen name="AddMemoriesScreen" component={AddMemoriesScreen} />
      <Stack.Screen name="MediaScreen" component={MediaScreen} />
      <Stack.Screen
        name="AddNotificationScreen"
        component={AddNotificationScreen}
      />
      <Stack.Screen name="EventScreen" component={EventScreen} />
      <Stack.Screen name="AddEventScreen" component={AddEventScreen} />
      <Stack.Screen name="UpdateReportsScreen" component={UpdateReportsScreen} />
      <Stack.Screen name="AnnouncementSettingScreen" component={AnnouncementSettingScreen} />
      <Stack.Screen name="UpdateConcernScreen" component={UpdateConcernScreen} />
      <Stack.Screen name="ManageClassroomScreen" component={ManageClassroomScreen} />
      <Stack.Screen name="EditMemoriesScreen" component={EditMemoriesScreen} />
      <Stack.Screen name="UpdateBiometricScreen" component={UpdateBiometricScreen} />
    </Stack.Navigator>
  );
};

export default ActionStack;
