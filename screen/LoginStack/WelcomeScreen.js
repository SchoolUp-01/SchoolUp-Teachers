import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
// import PagerView from "react-native-pager-view";
import { StatusBar } from "expo-status-bar";
import AnimatedLottieView from "lottie-react-native";

import { primaryColor, primaryText, secondaryText,primaryColor_800 } from "../../utils/Color";
import { Container } from "../../components/styledComponents";
// import { Circle, Container } from "../styledComponents";
const { width, height } = Dimensions.get("screen");

export default class WelcomeScreen extends React.PureComponent {
  intervalID = null;
  state = {
    animation: null,
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
    if (page > 2) {
      page = 0;
    }
    this.state.ref?.current?.setPage(page);
    this.setState({
      selectedPage: page,
    });
  };

  trackerColor = (indexOfComp) =>
    this.state.selectedPage === indexOfComp ? primaryColor : secondaryText;

  renderPager = (title, description, animation) => {
    return (
      <View style={styles.pagerContent}>
        <AnimatedLottieView
          autoPlay
          resizeMode="cover"
          ref={(animation) => {
            this.animation = animation;
          }}
          style={{
            flex:1,
            backgroundColor: "transparent",
          }}
          source={animation}
        />
       
      </View>
    );
  };


  

  renderButtons = () => {
    return(
      <View>
      <TouchableOpacity
        style={{
          alignSelf: "center",
        }}
        onPress={() => this.props.navigation.navigate("LoginStack",{screen:"SignupScreen"})}

      >
        <View style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Join Schoolup now!</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignSelf: "center",
          marginTop: 16,
        }}
        onPress={() => this.props.navigation.navigate("LoginStack",{screen:"LoginScreen"})}
      >
        <View style={styles.secondaryBotton}>
          <Text style={styles.secondaryBottonText}>Login</Text>
        </View>
      </TouchableOpacity>
    </View>
    )
  };

  renderSupportText = () => {
    return (
      <View style={styles.supportView}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("AboutScreen");
          }}
        >
          <Text style={styles.supportText}>About us</Text>
        </TouchableOpacity>
        <Text style={{ color: secondaryText }}>|</Text>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("LoginStack",{screen:"CreateProfileScreen"});
          }}
        >
          <Text style={styles.supportText}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={{ color: secondaryText }}>|</Text>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate("TermsAndConditionScreen");
          }}
        >
          <Text style={styles.supportText}>Terms of use</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <Container>
        <StatusBar animated barStyle="auto"></StatusBar>
        {this.renderPager(
            "elcome to StaWge",
            "A learning platform that combines education and real-world problem-solving.",
            require('../../assets/school_main.json'))
            }
             <View style={{marginTop:width*0.2}}>
          <Text style={styles.title}>{"Welcome to SchoolUp"}</Text>
          <Text style={styles.description}>{"Connecting dots, Building Bridges"}</Text>
        </View>
        <View style={styles.footerView}>
          {/* {this.showTracker()} */}
          {this.renderButtons()}
          {this.renderSupportText()}
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  pagerContent: {
    paddingHorizontal: 16,
    justifyContent: "space-evenly",
    marginTop: width*0.4,
    height: width*0.6,
    alignItems:"center"
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
  supportText: {
    fontSize: 12,
    fontFamily: "RHD-Regular",
    color: secondaryText,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  trackerView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 60,
  },
  supportView: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginHorizontal: 16,
    alignSelf: "center",
    alignItems: "center",
  },
  footerView: {
    flex: 1,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-around",
  },
  primaryButton: {
    backgroundColor: primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    height: 52,
    width: width * 0.85,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "RHD-Medium",
  },
  secondaryBotton: {
    borderColor: primaryColor,
    borderWidth: StyleSheet.hairlineWidth,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingTop: 8,
    paddingBottom: 8,
    height: 52,
    width: width * 0.85,
  },
  secondaryBottonText: {
    color: "#c7230e",
    fontSize: 16,
    fontFamily: "RHD-Medium",
  },
});
