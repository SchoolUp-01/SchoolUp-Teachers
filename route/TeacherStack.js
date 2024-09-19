import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PunchInScreen from "../screen/TeacherStack/PunchInScreen";



const Stack = createNativeStackNavigator();

const TeacherStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="PunchInScreen"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="PunchInScreen" component={PunchInScreen} />
      

    </Stack.Navigator>
  );
};

export default TeacherStack;
