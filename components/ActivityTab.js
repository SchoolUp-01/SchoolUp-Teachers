import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Container, ToolbarBorder } from "../components/styledComponents";
import CurrentTimeTableView from "./CurrentTimeTableView";
import { borderColor, borderWidth, primaryColor } from "../utils/Color";

export default function ActivityTab() {
  return (
    <View>
      <View  style={styles.container}>
        {/* <Text style={styles.title}></Text>
        <Text style={styles.title}>5</Text> */}
          <View style={styles.item}>
          <Text style={styles.label}>Rahul's Activities</Text>
        </View>
      </View>
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
  item: {
    flexDirection: "row",
    alignItems: "center",
  },
  label: {
    paddingVertical: 12,
    marginHorizontal: 16,
    // fontFamily: "RHD-Medium",
    fontSize: 16,
    color: primaryColor, //979797
    fontWeight: 'bold',
  },
});
