import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import AnimatedLottieView from "lottie-react-native";
import { primaryColor, primaryText, secondaryText } from "../../utils/Color";
import { Container } from "../../components/styledComponents";

const { width } = Dimensions.get("screen");

export default class WelcomeScreen extends React.PureComponent {
  intervalID = null;
  state = {
    selectedPage: 0,
    ref: new React.createRef(),
  };

  componentDidMount() {
    this.intervalID = setInterval(this.playTransition, 2500);
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  playTransition = () => {
    let page = this.state.selectedPage + 1;
    if (page > 2) page = 0;
    this.state.ref?.current?.setPage(page);
    this.setState({ selectedPage: page });
  };

  trackerColor = (index) =>
    this.state.selectedPage === index ? primaryColor : secondaryText;

  renderPager = () => (
    <View style={styles.pagerContent}>
      <AnimatedLottieView
        autoPlay
        style={styles.animationStyle}
        source={require("../../assets/school_main.json")}
      />
    </View>
  );

  renderButtons = () => (
    <View>
      <TouchableOpacity
        style={styles.centered}
        onPress={() =>
          this.props.navigation.navigate("LoginStack", { screen: "SignupScreen" })
        }
      >
        <View style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Join SchoolUp now!</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.centered, styles.buttonSpacing]}
        onPress={() =>
          this.props.navigation.navigate("LoginStack", { screen: "LoginScreen" })
        }
      >
        <View style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Login</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  renderSupportText = () => (
    <View style={styles.supportView}>
      {["AboutUsScreen", "PrivacyPolicyScreen", "TermsOfServiceScreen"].map(
        (screen, index) => (
          <React.Fragment key={screen}>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("LoginStack", { screen })
              }
            >
              <Text style={styles.supportText}>
                {screen.replace("Screen", "").split(/(?=[A-Z])/).join(" ")}
              </Text>
            </TouchableOpacity>
            {index < 2 && <Text style={styles.separator}>|</Text>}
          </React.Fragment>
        )
      )}
    </View>
  );

  render() {
    return (
      <Container>
        <StatusBar animated barStyle="auto" />
        {this.renderPager()}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Welcome to SchoolUp</Text>
          <Text style={styles.description}>Connecting dots, Building Bridges</Text>
        </View>
        <View style={styles.footerView}>
          {this.renderButtons()}
          {this.renderSupportText()}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  pagerContent: {
    paddingHorizontal: 16,
    justifyContent: "space-evenly",
    marginTop: width * 0.4,
    height: width * 0.6,
    alignItems: "center",
  },
  animationStyle: {
    width: width * 0.75,
    height: width * 0.75,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
  centered: {
    alignSelf: "center",
  },
  buttonSpacing: {
    marginTop: 16,
  },
  primaryButton: {
    backgroundColor: primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    height: 52,
    width: width * 0.85,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "RHD-Medium",
  },
  secondaryButton: {
    borderColor: primaryColor,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 8,
    height: 52,
    width: width * 0.85,
  },
  secondaryButtonText: {
    color: "#c7230e",
    fontSize: 16,
    fontFamily: "RHD-Medium",
  },
  title: {
    textAlign: "center",
    fontFamily: "RHD-Medium",
    fontSize: 24,
    color: primaryText,
    marginTop: 16,
  },
  description: {
    fontSize: 16,
    marginTop: 8,
    fontFamily: "RHD-Regular",
    textAlign: "center",
    color: secondaryText,
    paddingHorizontal: 16,
  },
  supportView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 16,
    alignItems: "center",
  },
  supportText: {
    fontSize: 12,
    fontFamily: "RHD-Regular",
    color: secondaryText,
    paddingHorizontal: 8,
  },
  separator: {
    color: secondaryText,
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
  },
  textContainer: {
    marginTop: width * 0.2,
  },
});
