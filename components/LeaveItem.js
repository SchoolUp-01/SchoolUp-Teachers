import { StyleSheet, View, Text } from "react-native";
import { borderColor, borderWidth, primaryColor_800 } from "../utils/Color";
import { Months } from "../utils/Months";
import AnimatedLottieView from "lottie-react-native";

export default function LeaveItem({ item }) {
  const formatDate = (start_date, end_date) => {
    let sd = new Date(start_date);
    let ed = new Date(end_date);
    if (sd.toDateString() === ed.toDateString()) return sd.getDate() + "\n" + Months[sd.getMonth()];
    else if (sd.getMonth() === ed.getMonth()) {
      return sd.getDate() + " - " + ed.getDate() + "\n" + Months[sd.getMonth()];
    } else {
      return (
        sd.getDate() +
        "\t - \t" +
        ed.getDate() +
        "\n" +
        Months[sd.getMonth()] +
        "\t  \t" +
        Months[ed.getMonth()]
      );
    }
  };
  return (
    <View style={styles.leaveView}>
      <View style={styles.dateView}>
        <Text style={styles.date}>
          {formatDate(item?.start_date, item?.end_date)}
        </Text>
      </View>
      <View style={styles.leaveSubView}>
        <View>
          <Text style={styles.leaveType}>{item?.type}</Text>
          <Text style={styles.leaveReason}>{item?.remark}</Text>
        </View>
        {item?.avatar !== null && item?.avatar !== "" && (
          <AnimatedLottieView
            autoPlay
            style={{
              width: 64,
              height: 64,
              backgroundColor: "transparent",
              alignSelf: "center",
            }}
            source={{ uri: item?.avatar }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  leaveView: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: borderWidth,
    borderColor: borderColor,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  leaveType: { fontFamily: "RHD-Medium", fontSize: 16, lineHeight: 24 },
  leaveReason: { fontFamily: "RHD-Regular", fontSize: 14, lineHeight: 18 },
  leaveSubView: {
    flex: 1,
    flexDirection: "row",
    marginStart: 16,
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontFamily: "RHD-Bold",
    textAlign: "center",
    alignSelf: "center",
    fontSize: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: "#fff",
  },
  dateView: {
    flexDirection: "column",
    backgroundColor: primaryColor_800,
    borderTopStartRadius: 8,
    borderBottomStartRadius: 8,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    minWidth:72,
  },
});
