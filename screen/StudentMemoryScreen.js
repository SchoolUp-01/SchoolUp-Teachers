import { View,Image,Text } from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  TitleHeader,
  TitleSubHeader,
  TitleView,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";
import { primaryColor_50, primaryText } from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

export default function StudentMemoryScreen() {
  const navigation = useNavigation();
  return (
    <Container style={{ backgroundColor: primaryColor_50 }}>
      <CustomStatusBarView
        barStyle="dark-content"
        backgroundColor={primaryColor_50}
      />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <TitleView>
          <TitleSubHeader>Memories</TitleSubHeader>
          <TitleHeader numberOfLines={1}>
            {Student.shared.getMasterStudentName()}
          </TitleHeader>
        </TitleView>
        <MenuItem
          onPress={() => {
            navigation.navigate("RaiseConcernScreen", {
              type: "Exams",
            });
          }}
        >
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      <View style={styles.memoryItem}>
        <Image
          style={{ width: 180, height: 160 }}
          source={{
            uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/memories/schoolchildren.jpg.avif",
          }}
        ></Image>
        <Text style={styles.memoryText}>Student survey by Annual Status of Education Report (ASER)</Text>
      </View>
    </Container>
  );
}

const styles = StyleSheet.create({
  memoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor:"#fff",
    flexShrink:1,
    marginHorizontal:16,
    marginVertical:16
  },
  memoryText:{
    fontFamily:"RHD-Medium",
    fontSize:18,
    lineHeight:27,
    marginTop:8,
  }
});
