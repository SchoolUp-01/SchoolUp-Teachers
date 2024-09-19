import { StyleSheet, View,Dimensions } from "react-native";
import { InputTitle } from "./styledComponents";
import { BarChart } from 'react-native-chart-kit';
export default function MarksBarView() {
  return (
    <View style={{alignItems:"center"}}>
     <BarChart
        data={{
          labels: ['English', 'Hindi', 'Kannada', 'Maths', 'Science', 'Social Science'],
          datasets: [
            {
              data: [20, 45, 28, 80, 99, 43],
            },
          ],
        }}
        width={Dimensions.get('window').width-16}
        height={220}
        // yAxisLabel={'Marks'}
        chartConfig={{
          backgroundColor: '#fff',
          backgroundGradientFrom: '#fff',
          backgroundGradientTo: '#fff',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        style={{
          marginVertical: 8,
        }}
        fromZero={true}
        withInnerLines={false}
        showBarTops={false}
        showValuesOnTopOfBars
        withVerticalLabels={true}
        withHorizontalLabels={false}
        horizontalLabelRotation={90}
      />
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
