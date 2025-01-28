import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  ScrollView,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  Title,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import ConcernReportItem from "../components/ConcernReportItem";
import EmptyState from "../components/EmptyState";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryText,
  primaryColor,
  secondaryText,
} from "../utils/Color";
import { concern_info_db } from "../utils/Constants";
import Teacher from "../state/TeacherManager";
import { supabase } from "../backend/supabaseClient";

const ConcernScreen = () => {
  const navigation = useNavigation();
  const LIMIT = 5;
  const schoolID = Teacher.shared.getSchoolID()
  const [concernList, setConcernList] = useState([]);
  const [selectedTag, setSelectedTag] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState(0);
  const [lastItem, setLastItem] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const fetchInProgressRef = useRef(false);

  useEffect(() => {
    resetAndFetchConcerns();
  }, [searchText, selectedTag]);

  useEffect(() => {
      if (schoolID !== null) {
        const channels = realTimeListener();
        return () => {
          channels.unsubscribe();
        };
      }
    }, [schoolID]);

  const realTimeListener = useCallback(() => {
      return supabase
        .channel("concern-report-changes")
        .on(
          "postgres_changes",
          {
            event: '*',
            schema: "public",
            table: concern_info_db,
            filter: `school_id=eq.${schoolID}`,
          },
          async (payload) => {
            const { eventType, new: newRecord, old: oldRecord } = payload;
            try {
              switch (eventType) {
                case "INSERT":
                  const newConcern = await supabase_api.shared.getConcernReportByID(
                    newRecord?.id
                  );
                  setConcernList((prevList) => [newConcern, ...prevList]);
                  break;
  
                case "UPDATE":
                  const updatedConcern =
                    await supabase_api.shared.getConcernReportByID(newRecord?.id);
                  setConcernList((prevList) =>
                    prevList.map((item) =>
                      item.id === updatedConcern.id
                        ? { ...item, ...updatedConcern }
                        : item
                    )
                  );
                  break;
  
                case "DELETE":
                  setConcernList((prevList) =>
                    prevList.filter((item) => item.id !== oldRecord.id)
                  );
                  break;
              }
            } catch (error) {
              ErrorLogger.shared.ShowError(
                "ConcernScreen: realTimeListener: ",
                error
              );
            }
          }
        )
        .subscribe();
    }, [schoolID]);

  const retrieveConcerns = useCallback(
    async (isReset = false) => {
      if (fetchInProgressRef.current || (lastItem && !isReset)) return;

      isReset ? setRefreshing(true) : setLoading(true);
      fetchInProgressRef.current = true;

      try {
        const offset = isReset ? 0 : lastVisible;
        const data = await supabase_api.shared.getConcernReport(
          offset,
          LIMIT + offset,
          searchText.trim(),
          selectedTag
        );

        const uniqueItems = isReset
          ? data
          : data.filter(
              (newItem) =>
                !concernList.some(
                  (existingItem) => existingItem.id === newItem.id
                )
            );

        setConcernList((prev) => (isReset ? data : [...prev, ...uniqueItems]));
        setLastItem(uniqueItems.length < LIMIT);
        setLastVisible((prev) => prev + uniqueItems.length);
      } catch (error) {
        ErrorLogger.shared.ShowError("retrieveConcerns: ", error);
      } finally {
        fetchInProgressRef.current = false;
        isReset ? setRefreshing(false) : setLoading(false);
      }
    },
    [lastVisible, searchText, selectedTag, lastItem, concernList]
  );

  const resetAndFetchConcerns = useCallback(() => {
    setLastItem(false);
    setConcernList([]);
    setLastVisible(0);
    retrieveConcerns(true);
  }, [retrieveConcerns]);

  const OptionItem = useCallback(
    ({ item }) => (
      <TouchableOpacity
        style={[
          styles.optionItem,
          { backgroundColor: item === selectedTag ? primaryColor : itemColor },
        ]}
        onPress={() => setSelectedTag(item)}
      >
        <Text
          style={[
            styles.optionText,
            {
              color: item === selectedTag ? "#fff" : primaryText,
              fontFamily: item === selectedTag ? "RHD-Bold" : "RHD-Medium",
            },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    ),
    [selectedTag]
  );

  const renderHeader = useCallback(() => {
    return (
      <View>
        <View style={styles.searchView}>
          <Feather name="search" size={16} color={secondaryText} />
          <TextInput
            style={styles.searchInput}
            selectionColor={primaryColor}
            placeholder="Search Students or concern type"
            onChangeText={setSearchText}
            value={searchText}
            autoCapitalize="none"
          />
          {searchText && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x" size={16} color={secondaryText} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          contentContainerStyle={styles.tagsContainer}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {["All", "New", "Open", "Closed"].map((tag) => (
            <OptionItem key={tag} item={tag} />
          ))}
        </ScrollView>
      </View>
    );
  }, [OptionItem, searchText]);

  const renderEmpty = useCallback(() => {
    if (loading || refreshing) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={{ color: secondaryText }}>Loading...</Text>
        </View>
      );
    }
    if (!loading && !refreshing && !concernList.length) {
      return (
        <EmptyState
          title=""
          description={`You don't have any ${selectedTag!=='All' ?selectedTag:searchText} concerns.`}
          animation={require("../assets/animations/no_data.json")}
        />
      );
    }
    return null;
  }, [loading, refreshing, concernList, selectedTag]);

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryText} />
        </MenuItem>
        <Title>Parent Concerns</Title>
        <MenuItem
          onPress={() =>
            navigation.navigate("RaiseConcernScreen", {
              type: "Children complaint",
            })
          }
        >
          <Feather name="alert-circle" size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      {renderHeader()}
      <ContentView>
        <FlatList
          data={concernList}
          renderItem={({ item }) => (
            <ConcernReportItem item={item} tag={selectedTag} />
          )}
          keyExtractor={(item) => item.id.toString()}
          refreshing={refreshing}
          onRefresh={resetAndFetchConcerns}
          ListEmptyComponent={renderEmpty}
          onEndReached={() => retrieveConcerns()}
          onEndReachedThreshold={0.5}
        />
      </ContentView>
    </Container>
  );
};

const styles = StyleSheet.create({
  optionText: {
    fontSize: 14,
    paddingHorizontal: 8,
  },
  optionItem: {
    marginEnd: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
  },
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 16,
    fontFamily: "RHD-Medium",
  },
  tagsContainer: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  loadingContainer: {
    padding: 16,
    alignItems: "center",
  },
});

export default React.memo(ConcernScreen);
