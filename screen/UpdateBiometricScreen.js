import { Text } from "react-native";
import { Container, ContentView } from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";

export default function UpdateBiometricScreen() {
  const navigation = useNavigation();
  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <BasicToolBar title={"Update Biometric"} navigation={navigation} />
      <ContentView>
        <EmptyState
          title="Feature under construction"
          description="We're putting the finishing touches and expect to launch this feature very soon."
          animation={require("../assets/under_construction.json")}
        />
      </ContentView>
    </Container>
  );
}
