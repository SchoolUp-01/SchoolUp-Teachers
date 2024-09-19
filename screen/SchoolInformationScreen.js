import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import {
  ButtonItem,
  ButtonLabel,
  Container,
  ContentView,
  MenuItem,
  Title,
  Toolbar,
} from "../components/styledComponents";
import { useNavigation } from "@react-navigation/native";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import CustomStatusBarView from "../components/CustomStatusBarView";
import SchoolInformationScreenShimmer from "../components/Shimmers/SchoolInformationScreenShimmer";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import InAppNotification from "../utils/InAppNotification";
import BottomModal from "../components/Modals";
import { OptionsButton } from "../components/Buttons";
import ManagementList from "../components/ManagementList";
import PagerView from "react-native-pager-view";
const { width, height } = new Dimensions.get("screen");
export default function SchoolInformationScreen() {
  const navigation = useNavigation();
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("Events");
  const [selectedPage, setSelectedPage] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const pagerRef = useRef();


  useEffect(() => {
    supabase_api.shared
      .getSchoolInformation(Student.shared.getMasterStudentSchoolID())
      .then((res) => {
        setSchoolInfo(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "SchoolInformationScreen: getSchoolInformation: ",
          error
        );
        InAppNotification.shared.showErrorNotification({
          title: "Something went wrong",
          description: "Error code: " + error?.code,
        });
      })
      .finally(() => setLoading(false));

    return () => {};
  }, []);

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };

  const callToAction = async (item, value) => {
    if (!value || !item) 
    {
      InAppNotification.shared.showErrorNotification({title:"No Information Available",description:"Please check again"})
      return;}
    if (item == "Call us") {
      Linking.openURL(`tel:${value}`);
    }else if(item == "Email"){
      Linking.openURL(`mailto:${schoolInfo?.email_address}`);     
    }
    else if(item == "Website"){
      Linking.openURL(value);
    }
    else if(item == "Location"){
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(value)}`);   
    }
  };

  const OptionItem = ({ item, icon, value }) => {
    return (
      <TouchableOpacity onPress={() => callToAction(item, value)}>
        <View style={[styles.feedItem]}>
          <Feather
            style={{ alignSelf: "center" }}
            name={icon}
            size={16}
            color={primaryText}
          />
          <Text style={[styles.tagText]}>{item}</Text>
        </View>
      </TouchableOpacity>
    );
  };



  

  const MoreButton = ({label,selectedPage}) =>{
    return(
      <TouchableOpacity
          onPress={() => {
            navigation.navigate("SchoolMediaScreen",{
              selectedPage: selectedPage
            })
          }}
          style={{
            marginVertical: 8,
            overflow: "hidden",
            borderRadius: 8,
            marginHorizontal: 16,
          }}
        >
          <ButtonItem>
            <ButtonLabel>{label}</ButtonLabel>
            <Feather name={"chevron-right"} size={24} color={"#e5e5e5"} />
          </ButtonItem>
        </TouchableOpacity>
    )
  }

  const RenderContent = () => {
    if (schoolInfo === null) return;
    const 
      {
        avatar,
        contact_number,
        description,
        email_address,
        location,
        name,
        sub_title,
        website,
      }
    = schoolInfo;
    return (
      <View style={{flex:1,flexDirection:'column',flexGrow:1}}>
      
          <ImageBackground
            style={{
              width: width - 64,
              height: 220,
              alignSelf: "center",
              marginBottom: 16,
            }}
            imageStyle={{ borderRadius: 8 }}
            source={{
              uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/classes/music_bg.jpg",
            }}
          ></ImageBackground>
          <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
            {sub_title && (
              <Text style={styles.subDescription}>{sub_title}</Text>
            )}
            <Text style={styles.title}>{name}</Text>

            {description && (
              <Text style={styles.description} numberOfLines={6}>
                {description}
              </Text>
            )}
          </View>
          <View
            style={{
              flexDirection: "row",
              paddingHorizontal: 16,
              marginTop: 16,
              flexWrap: "wrap",
            }}
          >
            <OptionItem
              item={"Call us"}
              icon={"phone"}
              value={contact_number}
            />
            <OptionItem item={"Email"} icon={"mail"} value={email_address} />
            <OptionItem item={"Website"} icon={"globe"} value={website} />
            <OptionItem item={"Location"} icon={"map-pin"} value={location} />
          </View>
            <MoreButton label={"Events"} selectedPage={0}/>
            <MoreButton label={"Achievements"} selectedPage={1}/>
            <MoreButton label={"Management"} selectedPage={2}/>
        
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView bar-style={"dark-content"} />
      <BottomModal isVisible={modalVisible} onClose={toggleModal}>
        <OptionsButton
          icon="phone"
          name={"Call us"}
          color={primaryText}
          callBack={() => callToAction("Call us", schoolInfo?.contact_number)}
        />
        <OptionsButton
          icon="mail"
          name={"Email"}
          color={primaryText}
          callBack={() => callToAction("Email", schoolInfo?.email_address)}
        />
        <OptionsButton
          icon="globe"
          name={"Website"}
          color={primaryText}
          callBack={() => callToAction("Website", schoolInfo?.website)}
        />
        <OptionsButton
          icon="map-pin"
          name={"Location"}
          color={primaryText}
          callBack={() => callToAction("Location", schoolInfo?.location)}
        />
      </BottomModal>
      <Toolbar>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" color={primaryText} size={24} />
        </MenuItem>
        <Title></Title>
        <MenuItem onPress={toggleModal}>
          <Feather name="more-horizontal" color={primaryText} size={20} />
        </MenuItem>
      </Toolbar>
      <ContentView>
        <ScrollView nestedScrollEnabled>
        {loading ? <SchoolInformationScreenShimmer /> : RenderContent()}
        </ScrollView>
      </ContentView>
    </Container>
  );
}

const styles = StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 20,
    lineHeight: 30,
  },
  description: {
    fontSize: 16,
    marginTop: 4,
    fontFamily: "RHD-Medium",
    color: primaryText,
    lineHeight: 24,
  },
  subDescription: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: "RHD-Medium",
    color: primaryColor,
  },
  tagText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  feedItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    marginBottom: 8,
    // backgroundColor: itemColor,
  },
  
});
