import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Container, ToolbarBorder } from "./styledComponents";
import CurrentTimeTableView from "./CurrentTimeTableView";
import UpcomingTeachersList from "./UpcomingTeachersList";

export default function ClassesTab() {
  return (
    <View>
      <View  style={styles.container}>
        <Text style={styles.title}>Upcoming Classes</Text>
      </View>
      <UpcomingTeachersList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal:16,paddingVertical:8
  },
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
});
