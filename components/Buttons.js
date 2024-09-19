import { Dimensions, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { OptionsText, OptionsView } from "./styledComponents";
const {width, height} = new Dimensions.get('screen')
export const OptionsButton = ({ icon, color, name, callBack }) => {
  return (
    <TouchableOpacity
      style={{ flex: 1,width:width,paddingHorizontal:16 }}
      onPress={() => {
        if (!!callBack) callBack();
      }}
    >
      <OptionsView>
        <Feather
          style={{ alignSelf: "center" }}
          name={icon}
          size={24}
          color={color}
        />
        <OptionsText>{name}</OptionsText>
      </OptionsView>
    </TouchableOpacity>
  );
};
