import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, Circle } from 'react-native-maps';
import CustomStatusBarView from '../../components/CustomStatusBarView';
import { Container, MenuItem, Title, ToolbarBorder } from '../../components/styledComponents';
import { Feather } from "@expo/vector-icons";
import { primaryText } from '../../utils/Color';
import EmptyState from '../../components/EmptyState';
import { useNavigation } from '@react-navigation/native';

const SCHOOL_LOCATION = {
  latitude: 15.3647, // Replace with actual school coordinates
  longitude: 75.124,
};

const MAX_DISTANCE = 100; // meters

export default function PunchInScreen() {
  const [location, setLocation] = useState(SCHOOL_LOCATION);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  let navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      try {
        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
      } catch (error) {
        setErrorMsg('Unable to get current location. Using school location.');
      }
    })();
  }, []);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c;
  };

  const handleCheckInOut = () => {
    const distance = calculateDistance(
      location.latitude,
      location.longitude,
      SCHOOL_LOCATION.latitude,
      SCHOOL_LOCATION.longitude
    );

    console.log("Latitude: ",location.latitude)
    console.log("longitude: ",location.longitude)

    if (distance <= MAX_DISTANCE) {
      setIsCheckedIn(!isCheckedIn);
      setErrorMsg(null);
    } else {
      setErrorMsg('You are too far from the school to check in/out');
    }
  };

  return (
    <Container>
      {/* <MapView
        style={styles.map}
        initialRegion={{
          latitude: SCHOOL_LOCATION.latitude,
          longitude: SCHOOL_LOCATION.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker coordinate={SCHOOL_LOCATION} title="School" />
        {location !== SCHOOL_LOCATION && <Marker coordinate={location} title="Your Location" pinColor="blue" />}
        <Circle
          center={SCHOOL_LOCATION}
          radius={MAX_DISTANCE}
          fillColor="rgba(0, 255, 0, 0.1)"
          strokeColor="rgba(0, 255, 0, 0.3)"
        />
      </MapView> */}
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
      <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <Title>Check-in</Title>
      </ToolbarBorder>
      <EmptyState
          title="Coming Soon"
          description={"Please wait, while we are working hard to bring this feature live"}
          // animation={require("../../assets/animations/no-chat.json")}
          // primaryButtonText={"Start New Conversation"}
          // primaryOnClick={() => navigation.navigate("TeachersScreen")}
        />
      {/* <View style={styles.buttonContainer}>
        <Button
          title={isCheckedIn ? "Check Out" : "Check In"}
          onPress={handleCheckInOut}
        />
      </View>
      {errorMsg && <Text style={styles.errorText}>{errorMsg}</Text>}
      <Text style={styles.statusText}>
        Status: {isCheckedIn ? "Checked In" : "Checked Out"}
      </Text> */}
    </Container>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
  statusText: {
    textAlign: 'center',
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});