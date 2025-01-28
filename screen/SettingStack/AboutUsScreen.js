import { Dimensions, ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  Toolbar,
} from "../../components/styledComponents";
import CustomStatusBarView from "../../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import { primaryColor, primaryColor_50, primaryText } from "../../utils/Color";

const { width, height } = Dimensions.get("screen");

export default function AboutUsScreen() {
  const navigation = useNavigation();
  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <Toolbar>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color={primaryText} />
        </MenuItem>
        <Title>About</Title>
      </Toolbar>
      <ContentView>
        <ScrollView>
          <Text
            style={{
              paddingHorizontal: 16,
              fontFamily: "RHD-Medium",
              fontSize: 16,
              lineHeight: 24,
              marginTop: 16,
            }}
          >
            <Text style={{ color: primaryColor, fontFamily: "RHD-Bold" }}>
              📘 Welcome to SchoolUp: Empowering Teachers to Transform Education! 🏫{"\n\n"}
            </Text>
            SchoolUp is your go-to platform for streamlining communication,
            enhancing classroom engagement, and managing educational tasks
            effortlessly. Designed with teachers in mind, SchoolUp is here to
            support and empower you to focus on what you do best—teaching!{"\n\n"}
            <Text style={{ color: primaryColor, fontFamily: "RHD-Bold" }}>
              📡 Seamless Communication:
            </Text>{" "}
            Connect with parents instantly, share updates, and ensure a unified
            approach to student progress.{"\n\n"}
            <Text style={{ color: primaryColor, fontFamily: "RHD-Bold" }}>
              📑 Simplified Management:
            </Text>{" "}
            Manage assignments, schedules, and performance reports all from one
            user-friendly app.{"\n\n"}
            <Text style={{ color: primaryColor, fontFamily: "RHD-Bold" }}>
              💡 Personalized Insights:
            </Text>{" "}
            Gain deeper insights into student learning patterns to tailor
            strategies for better outcomes.{"\n\n"}
            <Text style={{ color: primaryColor, fontFamily: "RHD-Bold" }}>
              🔔 Real-Time Notifications:
            </Text>{" "}
            Keep parents informed with timely updates on student achievements
            and important events.{"\n\n"}
            <Text style={{ color: primaryColor, fontFamily: "RHD-Bold" }}>
              🌟 Collaborative Growth:
            </Text>{" "}
            Work hand-in-hand with parents and administrators to create a
            thriving educational environment.{"\n\n"}
            <Text
              style={{
                color: primaryColor,
                fontFamily: "RHD-Bold",
                fontStyle: "italic",
              }}
            >
              " Together, we shape the future, one student at a time! "
            </Text>
            {"\n\n"}Join the SchoolUp community today and experience a smarter,
            more effective way to teach and inspire. 🚀✨
          </Text>
        </ScrollView>
      </ContentView>
    </Container>
  );
}
