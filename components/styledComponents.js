import styled from "styled-components/native";
import { StatusBar, StyleSheet, Dimensions } from "react-native";
import {
  backgroundColor,
  borderColor,
  borderWidth,
  itemBorder,
  itemColor,
  primaryColor_500,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";

const { width, height } = Dimensions.get("screen");

export const Container = styled.View`
  flex-direction: column;
  flex: 1;
  background-color: ${backgroundColor};
`;

export const ContentView = styled.SafeAreaView`
  flex-direction: column;
  flex: 1;
  background-color: ${backgroundColor};
`;

export const Toolbar = styled.View`
  flex-direction: row;
  justify-content: space-between;
  flex-shrink: 1;
  min-height: 56px;
`;

export const ToolbarBorder = styled.View`
  flex-direction: row;
  justify-content: space-between;
  min-height: 56px;
  border-bottom-width: ${borderWidth}px;
  border-color: ${borderColor}

`;

export const InputTitle = styled.Text`
  font-size: 16px;
  color: ${primaryText};
  align-self: flex-start;
  justify-content: center;
  height: 24px;
  text-align: center;
  font-weight: 500;
  font-family: RHD-Medium;
`;

export const Title = styled.Text`
  position: absolute;
  text-align: center;
  align-self: center;
  start: 72px;
  font-size: 20px;
  font-family: "RHD-Medium";
  flex-shrink: 1;
  color: ${primaryText};
  font-weight: 500;
`;

export const TitleView = styled.View`
  padding-vertical: 6px;
  margin-horizontal: 6px;
  align-items: flex-start;
  justify-content: flex-start;
  flex-grow: 1;
  flex-shrink: 1;
  align-self: center;
`;

export const TitleHeader = styled.Text`
  font-size: 16px;
  font-family: "RHD-Medium";
  color: ${primaryText};
  line-height: 21px;
`;

export const TitleSubHeader = styled.Text`
  font-size: 10px;
  font-family: "RHD-Medium";
  color: ${secondaryText};
`;

export const MenuItem = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`;

export const SubView = styled.View`
  flex-direction: row;
  align-items: center;
  align-content: center;
  justify-content: space-between;
`;
export const ErrorText = styled.Text`
  font-size: 10px;
  color: #ff0033;
  align-self: flex-start;
  justify-content: center;
  font-family: "RHD-Medium";
  margin-start: 4px;
  text-align-vertical: center;
`;
export const OptionsView = styled.View`
  height: 36px;
  flex-direction: row;
  margin-vertical: 8px;
`;

export const OptionsText = styled.Text`
  align-self: center;
  text-align-vertical: center;
  margin-start: 32px;
  font-weight: 500;
  font-size: 16px;
  font-family: RHD-Medium;
  color: ${primaryText};
`;

export const ButtonItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: 16px;
  padding-vertical: 6px;
  border-width: ${itemBorder}px;
  border-color: ${borderColor};
  background-color: ${itemColor};
  border-radius: 8px;
`;

export const ButtonLabel = styled.Text`
  padding-end: 8px;
  padding-vertical: 8px;
  font-family: "RHD-Medium";
  font-size: 16px;
  color: ${primaryText};
`;

export const ScreenHint = styled.Text`
  padding-horizontal: 8px;
  margin-bottom: 8px;
  font-size: 12px;
  color: ${secondaryText};
  font-family: "RHD-Regular";
`;