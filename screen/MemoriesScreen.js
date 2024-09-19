import React, { useEffect, useState } from "react";
import {
  ButtonItem,
  ButtonLabel,
  Container,
  ContentView,
  MenuItem,
  Title,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { BasicToolBar } from "../components/ToolBarLayout";
import { useNavigation } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
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
  TextInput,
  FlatList,
  RefreshControl,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ContentList from "../components/ContentList";
import * as ImagePicker from "expo-image-picker";
import ErrorLogger from "../utils/ErrorLogger";
import supabase_api from "../backend/supabase_api";
import PreviewContentList from "../components/PreviewContentList";
import moment from "moment";
import MemoryShimmer from "../components/Shimmers/MemoryShimmer";

const { width, height } = new Dimensions.get("screen");

const MemoriesScreen = () => {
  const navigation = useNavigation();
  const [memoryList, setMemoryList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastVisible, setLastVisible] = useState(0);
  const [lastItem, setLastItem] = useState(false);
  const limit = 10;

  useEffect(() => {
    getMemory();
    return () => {};
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setMemoryList([]);
    setLastItem(false);
    setLastVisible(0);
    getMemory();
  };

  const getMemory = () => {
    if (!loading && !lastItem) {
      setLoading(true);
      supabase_api.shared
        .getAllMemories(lastVisible, lastVisible + limit)
        .then((res) => {
          const mergedList = [...memoryList, ...res];
          setMemoryList(mergedList);
          setLastItem(res.length < limit);
          setLastVisible(mergedList.length);
        })
        .catch((error) => {
          ErrorLogger.shared.ShowError(
            "MemoriesScreen: getAllMemories: ",
            error
          );
        })
        .finally(() => {
          setLoading(false);
          setRefreshing(false);
        });
    }
  };

  const MemoryItem = ({ item, index }) => {
    const {
      id,
      title,
      caption,
      media,
      class_list,
      student_list,
      school_id,
      created_at,
    } = item;
    return (
      <View
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderWidth: borderWidth,
          borderColor: borderColor,
          borderRadius: 8,
          marginHorizontal: 16,
          marginVertical: 8,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <View>
            <Text
              style={{ fontFamily: "RHD-Medium", fontSize: 16, lineHeight: 24 }}
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
              {"School Memory"}{" "}
              <Text style={{ color: secondaryText }}>
                • {moment(created_at).fromNow()}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => [
              navigation.navigate("EditMemoriesScreen", {
                item: item,
              }),
            ]}
            style={{
              backgroundColor: primaryColor_50,
              paddingVertical: 6,
              borderRadius: 8,
              paddingHorizontal: 12,
              marginTop: 4,
              alignItems: "center",
            }}
          >
            <Text style={{ fontFamily: "RHD-Medium", color: primaryColor_800 }}>
              Edit Memory
            </Text>
          </TouchableOpacity>
        </View>
        {caption!== ""&&
        <Text
        style={{
          fontFamily: "RHD-Regular",
          fontSize: 14,
          lineHeight: 21,
          marginVertical: 8,
        }}
        numberOfLines={3}
      >
        {caption}
      </Text>}
        <PreviewContentList mediaList={JSON.parse(media)} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return <MemoryShimmer />;
    else
      return (
        <EmptyState
          title="No Memories"
          description={
            "Currently, there are no Memories. create an memory and you'll see it here!"
          }
          animation={require("../assets/animations/no-notification.json")}
          primaryButtonText={"Add New Memories"}
          primaryOnClick={() => navigation.navigate("AddMemoriesScreen")}
        />
      );
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
        <Title>School Memories</Title>
        <TouchableOpacity
          style={{
            marginEnd: 16,
            alignSelf: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            navigation.navigate("AddMemoriesScreen");
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
      <FlatList
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 24 }}
        data={memoryList}
        renderItem={({ item, index }) => (
          <MemoryItem item={item} index={index} />
        )}
        keyExtractor={(item) => String(item.id).toString()}
        ListEmptyComponent={renderEmpty}
        onEndReached={getMemory}
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

export default React.memo(MemoriesScreen);
