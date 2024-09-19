import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Permissions, Platform, Dimensions, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { Container, ContentView, MenuItem, TitleHeader, TitleSubHeader, TitleView, Toolbar } from "../../components/styledComponents";
import { Feather } from "@expo/vector-icons";
import { primaryColor, primaryText } from "../../utils/Color";
import { useNavigation } from "@react-navigation/native";
import Teacher from "../../state/TeacherManager";
const {width,height} = new Dimensions.get("screen")
export default function PunchInScreen() {
  const navigation = useNavigation()
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const initialLocation = { latitude: 15.342269629336844, latitude: 75.14544709254676, latitudeDelta: 0.0, longitudeDelta: 0.0 };
 const schoolLocation={latitude:15.342808506530352, latitude:75.148301461400875}
 
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      console.log("Location: ",location?.coords)
      setLocation(location?.coords);
      getCoordinatesFromAddress()
    })();
  }, []);
  const [coordinates, setCoordinates] = useState(null);

  const getCoordinatesFromAddress = async () => {
    const address = 'Shanti Niketan English Medium School'; // Replace this with the desired address or place name

    try {
      let location = await Location.geocodeAsync(address);
      setCoordinates(location[0]);
      console.log('Coordinates:', location[0]);
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handleMapPress = async (event) => {
    try {
      console.log(event.nativeEvent)
      const { latitude, longitude } = event.nativeEvent.coordinate;
      setCoordinates({ latitude, longitude });

      // You can also use the obtained latitude and longitude for other purposes
      console.log('Picked Location:', { latitude, longitude });
    } catch (error) {
      console.error('Error handling map press:', error);
    }
  };

  return (
    <Container>
      <ContentView>
      <Toolbar style={{flexShrink:1}}>
          <MenuItem
            onPress={() => {
              navigation.goBack();
            }}
          >
            <Feather name={"arrow-left"} size={24} color={primaryText} />
          </MenuItem>
          <TitleView>
            <TitleSubHeader>Punch - in</TitleSubHeader>
            <TitleHeader>{Teacher.shared.getSchoolID()}</TitleHeader>
          </TitleView>
        </Toolbar>
      {location ? (
        <MapView  onPress={handleMapPress} style={styles.map} initialRegion={location}>
          <Marker coordinate={location} title="Your Location" />
          <Marker coordinate={schoolLocation} title="School " />
        </MapView>
      ) : (
        <Text>{errorMsg}</Text>
      )}
       <TouchableOpacity style={styles.primaryButton} onPress={() => handleSubmit()}>
            <View >
              {loading && <ActivityIndicator size={36} color={"#fff"} />}
              {!loading && (
                <Text style={styles.primaryText}>Punch In</Text>
              )}
            </View>
          </TouchableOpacity>
      </ContentView>
    </Container>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width:width,
    height:height-160
  },

  primaryButton: {
    width: width-32,
    position:"absolute",
    bottom:24,
    start:0,
    backgroundColor: primaryColor,
    marginVertical: 16,
    marginHorizontal: 16,
    borderRadius: 8,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryText: {
    color: "#fff",
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    fontSize: 16,
    alignSelf: "center",
  },
});
