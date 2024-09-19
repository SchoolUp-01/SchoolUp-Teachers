import { primaryText } from "../utils/Color";
import { MenuItem, Title, ToolbarBorder } from "./styledComponents";
import { Feather } from "@expo/vector-icons";

export const BasicToolBar = ({ title, navigation }) => {
  return (
    <ToolbarBorder>
      <MenuItem
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Feather name={"arrow-left"} size={24} color={primaryText} />
      </MenuItem>
      <Title>{title}</Title>
    </ToolbarBorder>
  );
};
