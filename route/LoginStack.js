import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screen/LoginStack/LoginScreen";
import SignupScreen from "../screen/LoginStack/SignupScreen";
import AboutUsScreen from "../screen/SettingStack/AboutUsScreen";
import TermsOfServiceScreen from "../screen/SettingStack/TermsOfServiceScreen";
import PrivacyPolicyScreen from "../screen/SettingStack/PrivacyPolicyScreen";
// import ForgotPasswordScreen from "../screen/LoginStack/ForgotPasswordScreen";



const Stack = createNativeStackNavigator();

const LoginStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="LoginScreen"
      screenOptions={{ headerShown: false, animation: "slide_from_right" }}
    >
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="SignupScreen" component={SignupScreen} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
      <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      {/* <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} /> */}
      
      
    </Stack.Navigator>
  );
};

export default LoginStack;
