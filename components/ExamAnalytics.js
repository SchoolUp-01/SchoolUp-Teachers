import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet, ScrollView, Text } from 'react-native';
import { StackedBarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

const translations = {
  average: "Average Marks",
  diff: "Difference (Total - Average)",
};

const chartConfig = {
  backgroundColor: '#ffffff',
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  decimalPlaces: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: {
    borderRadius: 16,
  },
  propsForLabels: {
    fontSize: 12,
  },
};

export default function ExamAnalysis({ classData = null }) {
  const [examResults, setExamResults] = React.useState([]);

  useEffect(() => {
    if (classData) {
      const overallData = [{
        name: "Overall",
        total: classData.marks,
        average: classData.exam_metadata.average,
      }];

      const subjectWiseData = classData.exam_metadata.subject_wise_averages
        ? Object.values(classData.exam_metadata.subject_wise_averages).map(
            (subject) => ({
              name: subject.subject_name,
              total: Number(subject.max_marks),
              average: Number(subject.average),
            })
          )
        : [];

      setExamResults([...overallData, ...subjectWiseData]);
    }
  }, [classData]);

  if (!examResults || examResults.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        {/* Add your empty state UI */}
      </View>
    );
  }

  // Prepare data for StackedBarChart
  const data = {
    labels: examResults.map((item) => item.name),
    legend: [translations.average, translations.diff],
    data: examResults.map((item) => [item.average, Math.max(item.total - item.average, 0)]),
    barColors: ['#8147E7', '#B685F0'], // Average (dark purple), Difference (light purple)
  };

  const chartWidth = Math.max(width - 40, examResults.length * 80);

  

  return (
    <ScrollView horizontal style={styles.container} showsHorizontalScrollIndicator={false}>
      <View style={styles.chartContainer}>
        <View style={{ position: 'relative' }}>
          <StackedBarChart
            data={data}
            width={chartWidth}
            height={300}
            chartConfig={chartConfig}
            style={styles.chart}
            hideLegend={true}
            decimalPlaces={1}
            fromZero
          />
          {/* {renderValues()} */}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginStart:8
  },
  emptyContainer: {
    flexGrow: 1,
    paddingVertical: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chartContainer: {
    paddingRight: 20,
    backgroundColor: '#ffffff',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  valueText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
});
