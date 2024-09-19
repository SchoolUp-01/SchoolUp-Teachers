import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ParentScreen from "../screen/ProfileStack/ParentScreen";
import EditProfileScreen from "../screen/ProfileStack/EditProfileScreen";
import ManageChildrenScreen from "../screen/ProfileStack/ManageChildrenScreen";
import EditChildrenScreen from "../screen/ProfileStack/EditStudentScreen";
import EditStudentScreen from "../screen/ProfileStack/EditStudentScreen";



const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="ParentScreen"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="ParentScreen" component={ParentScreen} />
      <Stack.Screen name="EditProfileScreen" component={EditProfileScreen} />
      <Stack.Screen name="ManageChildrenScreen" component={ManageChildrenScreen} />
      <Stack.Screen name="EditStudentScreen" component={EditStudentScreen} />
   
    
    </Stack.Navigator>
  );
};

export default ProfileStack;
