import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {scheduleData} from './scheduleData';

const ScheduleScreen = () => {
 const [currentTime, setCurrentTime] = useState('');
 const [timeTable, setTimeTable] = useState([]);

 useEffect(() => {
    fetchTimeTable();
 }, []);

 const fetchTimeTable = async () => {
    setTimeTable(scheduleData);
 };

 useEffect(() => {
    const timer = setInterval(() => {
      const date = new Date();
      setCurrentTime(date.toLocaleTimeString());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
 }, []);

 const onShowSchedule = () => {
    Alert.alert(
      'Schedule',
      `The kid's schedule for today is as follows: ${timeTable.join(', ')}`,
    );
 };

 return (
    <View style={styles.container}>
      <Text style={styles.text}>Current Time: {currentTime}</Text>
      <TouchableOpacity style={styles.button} onPress={onShowSchedule}>
        <Text style={styles.buttonText}>Show Schedule</Text>
      </TouchableOpacity>
    </View>
 );
};

const styles = StyleSheet.create({
 container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
 },
 text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
 },
 button: {
    backgroundColor: '#2196F3',
    padding: 10,
    margin: 10,
    borderRadius: 5,
 },
 buttonText: {
    color: '#fff',
    fontSize: 16,
 },
});

export default ScheduleScreen;