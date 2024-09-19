import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  TouchableOpacity,
} from "react-native";
import {
  borderColor,
  borderWidth,
  underlayColor,
  primaryText,
  primaryColor_800,
  primaryColor,
} from "../utils/Color";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { getActions } from "../state/RecentActionManager";
import { ActionData } from "../utils/ActionData";

export default function RecentActionsTab() {
  const navigation = useNavigation();
  const [actionList, setActionList] = useState([]);
  const [loading, setLoading] = useState(true);
  useFocusEffect(
    React.useCallback(() => {
      getLatestActions();
      return () => null;
    }, [])
  );

  async function getLatestActions() {
    let actions = await getActions();
    if(actions.length<4){
      actions.push(1);
      actions.push(2);
      actions.push(3);
      actions.push(4);
    }
    setActionList(actions);
    setLoading(false);
  }

  const MenuItem = ({ item, color = primaryColor }) => {
    const { icon, label, screen } = item;
    return (
      <TouchableHighlight
        activeOpacity={0.95}
        underlayColor={underlayColor}
        onPress={() => {
          navigation.navigate("ActionStack", { screen: screen });
        }}
      >
        <View
          style={{
            flexShrink: 1,
            alignItems: "center",
            justifyContent: "center",
            marginHorizontal: 8,
          }}
        >
          <View style={[styles.iconContainer, { backgroundColor: color }]}>
            <Feather
              style={[{ justifyContent: "center", alignSelf: "center" }]}
              size={20}
              color={primaryText}
              name={icon??""}
            />
          </View>
          <Text style={styles.subLabel} numberOfLines={2}>
            {label}
          </Text>
        </View>
      </TouchableHighlight>
    );
  };

  const MenuTitle = ({ title }) => {
    return (
      <View style={styles.item}>
        <Text style={styles.label}>{title}</Text>
      </View>
    );
  };

  return (
    <LinearGradient
      style={{
        flex: 1,
        justifyContent: "flex-end",
        paddingHorizontal: 8,
        marginVertical: 8,
      }}
      colors={["#fff", "#fff"]}
    >
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("ActionStack");
          }}
        >
          <View style={styles.recentHeaderView}>
            <MenuTitle title={"Recent Actions"} />
            <Feather
              style={[{ justifyContent: "center", alignSelf: "center" }]}
              size={20}
              color={primaryText}
              name={"chevron-right"}
            />
          </View>
        </TouchableOpacity>

        {loading ? (
          <View></View>
        ) : (
          <View style={styles.recentView}>
            <MenuItem item={ActionData[actionList[0]]} color={"#B7F0AD"} />
            <MenuItem item={ActionData[actionList[1]]} color="#E5E8B6" />
            <MenuItem item={ActionData[actionList[2]]} color="#AEA4BF" />
            <MenuItem item={ActionData[actionList[3]]} color="#FFCAB1" />
          </View>
        )}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: primaryColor_800,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  subItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    marginHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: borderWidth,
    borderBottomColor: borderColor,
  },
  subLabel: {
    fontSize: 14,
    color: primaryText,
    marginTop: 8,
    fontFamily: "RHD-Medium",
    flexShrink: 1,
    textAlign: "center",
  },
  recentView: {
    flexDirection: "row",
    justifyContent: "space-around",
    // paddingHorizontal: 16,
    paddingVertical: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: primaryColor_10, //c7c7c7
  },
  label: {
    paddingVertical: 12,
    fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryText, //979797
    fontWeight: "500",
  },
  recentHeaderView: {
    flexDirection: "row",
    justifyContent: "space-between",
    // borderBottomColor: primaryColor_300,
    // borderBottomWidth: borderWidth,
    paddingHorizontal: 16,
  },
});
