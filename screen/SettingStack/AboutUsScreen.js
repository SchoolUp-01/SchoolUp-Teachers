import { Dimensions, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Container, MenuItem, Title, Toolbar } from "../../components/styledComponents";
import CustomStatusBarView from "../../components/CustomStatusBarView";
import { Feather } from "@expo/vector-icons";
import { primaryColor_50, primaryText } from "../../utils/Color";
const {width,height} = new Dimensions.get("screen")
export default function AboutUsScreen() {
  const navigation = useNavigation();
  return (
    <Container style={{backgroundColor: primaryColor_50}}>
      <CustomStatusBarView barStyle="dark-content" backgroundColor={primaryColor_50}/>
      <Toolbar>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="x" size={24} color={primaryText} />
        </MenuItem>
        <Title >About us</Title>
      </Toolbar>
     
    </Container>
  );
}
