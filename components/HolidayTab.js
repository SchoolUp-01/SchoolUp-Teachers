import { StyleSheet, View } from "react-native";
import { InputTitle } from "./styledComponents";
import HolidayList from "./HolidayList";

export default function HolidayTab() {
  return (
    <View>
      <View  style={styles.container}>
        <InputTitle>Upcoming Holiday</InputTitle>
      </View>
      <HolidayList/>
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
