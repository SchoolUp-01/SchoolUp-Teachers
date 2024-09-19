import Theme from "./Theme";

import { Appearance, StyleSheet } from "react-native";

export const primaryColor ="#df5520" ;//"#";
  // Theme.shared.currentTheme === "dark" ? "#5448c8" : "#5448c8";
export const primaryColorStatus =
  Theme.shared.currentTheme === "dark" ? "#3d349f" : "#3d349f";
export const primaryColor_10 = "#df55202a";
export const primaryColor_50 = "#fdf6ef" ;//"#";
export const primaryColor_70 = "#df5520d9";
export const primaryColor_80 = "#fbead9";
export const primaryColor_300 = "#f1b380";//"#";
export const primaryColor_400 = "#eb8a4c";//"#";
export const primaryColor_500 = "ß#e66a29";
export const primaryColor_800 = "#df5520";//"#";

export var backgroundColor =
  Theme.shared.currentTheme === "dark" ? "#121212" : "#fff";
export const primaryText =
  Theme.shared.currentTheme === "dark" ? "#ffffffd9" : "#161924";
export const secondaryText =
  Theme.shared.currentTheme === "dark" ? "#ffffff99" : "#616161"; //616161
export const buttonText =
  Theme.shared.currentTheme === "dark" ? "#161924" : "#fff";
export const underlayColor =
  Theme.shared.currentTheme === "dark" ? "#212121" : "#f5f5f5";
export const defaultImageBgColor =
  Theme.shared.currentTheme === "dark" ? "#323232" : "#e5e5e5";
export const borderColor =
  Theme.shared.currentTheme === "dark" ? "#717171" : "#c4c4c4";

export const errorColor =
  Theme.shared.currentTheme === "dark" ? "#cf6679" : "#E03737";
export const errorColor_500 =
  Theme.shared.currentTheme === "dark" ? "#f04343" : "#f04343";
export const errorColor_200 =
  Theme.shared.currentTheme === "dark" ? "#fecaca" : "#fecaca";
export const borderWidth =
  Theme.shared.currentTheme === "dark"
    ? StyleSheet.hairlineWidth / 2
    : StyleSheet.hairlineWidth;

export const itemColor =
  Theme.shared.currentTheme === "dark" ? "#212121" : "#fff";
export const itemBorder =
  Theme.shared.currentTheme === "dark" ? 0 : StyleSheet.hairlineWidth;

export const successColor = "#00b104";
