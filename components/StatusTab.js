import { StyleSheet, View,Image } from "react-native";
import { MenuItem, Title, ToolbarBorder } from "./styledComponents";
import { useNavigation } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import Teacher from "../state/TeacherManager";

export default function StatusTab() {
  const navigation = useNavigation();

  return (
    <View>
      <ToolbarBorder>
        <Image style={{width: 300/3, height:100/3 , alignSelf:"center",marginStart:20}} source={require('../assets/icon_schoolup_d_324_107.png')}/>
        <View style={{ flexDirection: "row" }}>
          <MenuItem
            onPress={() => {
              navigation.navigate("ActionStack", {
                screen: "NotificationScreen",
              });
            }}
          >
            <Feather
              style={{ alignSelf: "center" }}
              name="bell"
              size={20}
              color={"#000"}
            />
          </MenuItem>
       
        </View>
      </ToolbarBorder>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 48,
    borderColor: borderColor,
    borderWidth: borderWidth,
    marginHorizontal: 16,
    borderRadius: 24,
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 18,
    backgroundColor: defaultImageBgColor,
  },
});
