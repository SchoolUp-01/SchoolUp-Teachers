import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SettingsScreen from "../screen/SettingStack/SettingsScreen";
import HelpScreen from "../screen/SettingStack/HelpScreen";
import TermsOfServiceScreen from "../screen/SettingStack/TermsOfServiceScreen";
import PrivacyPolicyScreen from "../screen/SettingStack/PrivacyPolicyScreen";
import AboutUsScreen from "../screen/SettingStack/AboutUsScreen";



const Stack = createNativeStackNavigator();

const SettingStack = () => {
  return (
    <Stack.Navigator
      initialRouteName="SettingsScreen"
      screenOptions={{ headerShown: false, animation:"slide_from_bottom" }}
    >
      <Stack.Screen name="SettingsScreen" component={SettingsScreen} />
      <Stack.Screen name="HelpScreen" component={HelpScreen} />
      <Stack.Screen name="TermsOfServiceScreen" component={TermsOfServiceScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="AboutUsScreen" component={AboutUsScreen} />
    </Stack.Navigator>
  );
};

export default SettingStack;
