import React from "react";
import { useNavigation } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import { StyleSheet } from "react-native";
import { Container, MenuItem, Toolbar } from "../../components/styledComponents";
import CustomStatusBarView from "../../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import { backgroundColor, primaryText } from "../../utils/Color";

export default function PrivacyPolicyScreen() {
  const navigation = useNavigation();

  return (
    <Container style={styles.container}>
      <CustomStatusBarView
        barStyle="dark-content"
        backgroundColor={backgroundColor}
      />
      <Toolbar>
        <MenuItem onPress={() => navigation?.goBack?.()}>
          <Feather name="x" size={24} color={primaryText} />
        </MenuItem>
      </Toolbar>
      <WebView
        source={{ uri: "https://schoolup.co/privacy-policies" }}
        style={styles.webview}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        setSupportZoom={true}
      />
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor,
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});
