import React, { useEffect, useState } from "react";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryColor,
  primaryColor_50,
  primaryColor_800,
  primaryText,
  secondaryText,
} from "../utils/Color";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  Image,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ErrorLogger from "../utils/ErrorLogger";
import supabase_api from "../backend/supabase_api";
import moment from "moment";
import AnnouncementShimmer from "../components/Shimmers/AnnouncementShimmer";

const { width, height } = new Dimensions.get("screen");

const EventScreen = () => {
  const navigation = useNavigation();
  const [announcementList, setAnnouncementList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(0);
  const [lastItem, setLastItem] = useState(false);
  const limit = 1;

  useEffect(() => {
    getAllAnnouncement();
    return () => {};
  }, []);

  const getAllAnnouncement = () => {
    if (!loading && !lastItem) {
      setLoading(true);
      supabase_api.shared
        .getAllAnnouncement(lastVisible, lastVisible + limit)
        .then((res) => {
          const mergedList = [...announcementList, ...res];
          setAnnouncementList(mergedList);
          setLastItem(res.length < limit);
          setLastVisible(mergedList.length);
        })
        .catch((error) => {
          ErrorLogger.shared.ShowError(
            "EventScreen: getAllAnnouncement: ",
            error
          );
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setAnnouncementList([]);
    setLastItem(false);
    setLastVisible(0);
    getAllAnnouncement()
  };

  const AnnouncementItem = ({ item, index }) => {
    const {
      caption,
      class_id,
      created_at,
      id,
      media,
      school_id,
      student_id,
      title,
      type,
    } = item;
    let mediaUrl = media;
    if (mediaUrl !== null) mediaUrl = JSON.parse(media);
    return (
      <View
        style={{
          paddingBottom: 8,
          borderWidth: borderWidth,
          borderColor: borderColor,
          borderRadius: 8,
          marginHorizontal: 16,
          marginVertical: 8,
        }}
      >
        {mediaUrl !== null && (
          <Image
            style={{ width: width - 32, height: 120, marginBottom: 8 }}
            source={{ uri: mediaUrl[0].uri }}
            borderTopLeftRadius={8}
            borderTopRightRadius={8}
          />
        )}
        <View
          style={{
            paddingHorizontal: 12,

            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 1,
          }}
        >
          <View
            style={{
              flexShrink: 1,
              marginEnd: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "RHD-Medium",
                fontSize: 16,
                lineHeight: 24,
                overflow: "hidden",
              }}
              numberOfLines={2}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: "RHD-Medium",
                fontSize: 12,
                lineHeight: 16,
                color: primaryColor,
              }}
            >
              {type}
              <Text style={{ color: secondaryText }}>
                • {moment(created_at).fromNow()}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: primaryColor_50,
              paddingVertical: 6,
              borderRadius: 8,
              paddingHorizontal: 12,
              marginTop: 4,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "RHD-Medium", color: primaryColor_800 }}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: "RHD-Regular",
            fontSize: 14,
            lineHeight: 21,
            marginVertical: 8,
            paddingHorizontal: 12,
          }}
          numberOfLines={3}
        >
          {caption}
        </Text>
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return <AnnouncementShimmer />;
    } else {
      return (
        <EmptyState
          title="No Upcoming Announcement"
          description={
            "Currently, there are no scheduled Announcement. create an event and you'll see any upcoming event here!"
          }
          animation={require("../assets/animations/no-notification.json")}
          primaryButtonText={"Add New Announcement"}
          primaryOnClick={() => navigation.navigate("AddEventScreen")}
        />
      );
    }
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather
            style={{ marginEnd: 16 }}
            name="arrow-left"
            color={primaryText}
            size={24}
          />
        </MenuItem>
        <Title>Announcement</Title>
        <TouchableOpacity
          style={{
            marginEnd: 16,
            alignSelf: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("AddEventScreen");
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontFamily: "RHD-Bold",
              color: primaryColor,
            }}
          >
            Create
          </Text>
        </TouchableOpacity>
      </ToolbarBorder>
      <ContentView>
        <FlatList
          data={announcementList}
          renderItem={({ item, index }) => (
            <AnnouncementItem item={item} index={index} />
          )}
          keyExtractor={(item) => String(item.id).toString()}
          ListEmptyComponent={renderEmpty}
          onEndReached={getAllAnnouncement}
          onEndReachedThreshold={0.1}
          refreshing={refreshing}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              // progressViewOffset={progressViewOffset}
              colors={[primaryColor]} // Customize the refresh indicator color if needed
              tintColor={primaryColor} // Customize the color of the loading indicator
            />
          }
        />
      </ContentView>
    </Container>
  );
};

const styles = StyleSheet.create({
  toolbarView: {
    marginHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
  headerView: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    paddingVertical: 8,
  },
  headerText: {
    fontFamily: "RHD-Medium",
    fontSize: 20,
    lineHeight: 30,
  },
  subText: {
    fontFamily: "RHD-Regular",
    fontSize: 14,
    lineHeight: 21,
    color: primaryText,
  },
  inputView: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  inputText: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "RHD-Medium",
    color: primaryText,
    marginBottom: 8,
  },
  input: {
    height: 40,
    fontSize: 16,
    color: primaryText,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: "RHD-Medium",
    backgroundColor: itemColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
    marginTop: 4,
    textAlignVertical: "top",
  },
});
export default React.memo(EventScreen);
