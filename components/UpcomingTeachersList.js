import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Container, ToolbarBorder } from "../components/styledComponents";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  itemColor,
  primaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";

function TeacherItem(name, subject) {
  return (
    <View
      style={{
        alignItems: "center",
        borderColor: borderColor,
        borderWidth: borderWidth,
        marginEnd:20,
        paddingVertical:8,
        paddingHorizontal:12,
        borderRadius:8
      }}
    >
      <View
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: defaultImageBgColor,
          marginVertical: 8,
        }}
      />
      <Text style={styles.title}>Laxmi Nayak</Text>
      <Text style={styles.subTitle}>Science</Text>
    </View>
  );
}

export default function UpcomingTeachersList() {
  return (
    <ScrollView >
      <View style={{flexDirection:"row"}}>
        <TeacherItem name={"Laxmi Nayak"} subject={"Science"} />
        <TeacherItem name={"Laxmi Nayak"} subject={"Science"} />
        <TeacherItem name={"Laxmi Nayak"} subject={"Science"} />
        <TeacherItem name={"Laxmi Nayak"} subject={"Science"} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    // marginVertical: 8,
    // paddingHorizontal: 16,
    // paddingVertical: 8,
    flexDirection: "row",
  },
  subView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "700",
    fontSize: 14,
    lineHeight: 24,
    textAlignVertical: "center",
    alignSelf: "center",
  },
  subTitle: {
    fontWeight: "500",
    fontSize: 12,
    lineHeight: 18,
    textAlignVertical: "center",
    alignSelf: "center",
  },
});
