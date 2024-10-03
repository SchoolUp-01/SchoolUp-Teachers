import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  StyleSheet,
  ScrollView,
  FlatList,
  View,
  TextInput,
  TouchableOpacity,
  Text,
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
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryColor,
  primaryText,
  secondaryText,
} from "../utils/Color";
import EmptyState from "../components/EmptyState";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
import StudentReportShimmer from "../components/Shimmers/StudentReportShimmer";
import BottomModal from "../components/Modals";
import { OptionsButton } from "../components/Buttons";
import AcademicReportItem from "../components/AcademicReportItem";
import { ItemLabel } from "../components/Label";

const TAG_OPTIONS = [
  "All",
  "Setup Required",
  "Upcoming",
  "Active",
  "Evaluation In-Progress",
  "Completed",
];

const statusColors = {
  "Setup Required": "#FF6347", // Tomato Red
  Upcoming: "#FFA500", // Orange
  Active: "#32CD32", // Lime Green
  "Evaluation In-Progress": "#1E90FF", // Dodger Blue
  Completed: "#6A5ACD", // Slate Blue
};

const AcademicReportScreen = () => {
  const navigation = useNavigation();
  const [reportInfo, setReportInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState("All");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    supabase_api.shared
      .getExamInfo()
      .then((res) => setReportInfo(res))
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "AcademicReportScreen: getStudentReportInfo: ",
          error
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleModal = () => setModalVisible((prev) => !prev);

  const onRaiseConcern = () => {
    toggleModal();
    navigation.navigate("RaiseConcernScreen", { type: "Academics Report" });
  };

  const filteredReports = useMemo(() => {
    return reportInfo.filter((item) => {
      const matchesTag =
        selectedTag === "All" || item.status === selectedTag;
      const matchesSearch = item.title
        .toLowerCase()
        .includes(searchText.toLowerCase());
      return matchesTag && matchesSearch;
    });
  }, [reportInfo, selectedTag, searchText]);

  const renderHeader = useCallback(() => {
    return (
      <View>
        <View style={styles.searchView}>
          <Feather name="search" size={16} color={secondaryText} />
          <TextInput
            style={styles.searchInput}
            selectionColor={primaryColor}
            placeholder="Search exams"
            onChangeText={setSearchText}
            value={searchText}
            autoCapitalize="none"
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x" size={16} color={secondaryText} />
            </TouchableOpacity>
          )}
        </View>
        <ScrollView
          contentContainerStyle={styles.tagScroll}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {TAG_OPTIONS.map((tag) => (
            <OptionItem key={tag} item={tag} />
          ))}
        </ScrollView>
      </View>
    );
  }, [searchText, selectedTag]);

  const OptionItem = React.memo(({ item }) => {
    const isSelected = item === selectedTag;
    return (
      <TouchableOpacity
        style={[
          styles.optionItem,
          { backgroundColor: isSelected ? primaryColor : itemColor },
        ]}
        onPress={() => setSelectedTag(item)}
      >
        <Text
          style={[
            styles.optionText,
            {
              color: isSelected ? "#fff" : primaryText,
              fontFamily: isSelected ? "RHD-Bold" : "RHD-Medium",
            },
          ]}
        >
          {item}
        </Text>
      </TouchableOpacity>
    );
  });
  
  const renderContent = () => {
    const isSearchActive = searchText.length > 0;
    const isTagFiltered = selectedTag !== "All";
  
    if (loading) {
      return <StudentReportShimmer />;
    }
  
    return (
      <>
        {renderHeader()}
        {filteredReports.length === 0 ? (
          <View style={styles.emptyStateView}>
            {isSearchActive || isTagFiltered ? (
              <Text style={styles.noResultsText}>
                No search results for{" "}
                {isSearchActive && isTagFiltered
                  ? `search: "${searchText}" and tag: "${selectedTag}"`
                  : isSearchActive
                  ? `search: "${searchText}"`
                  : `tag: "${selectedTag}"`}
              </Text>
            ) : (
              <EmptyState
                title="No Information available"
                description="No Reports available at the moment, please check back later."
                animation={require("../assets/animations/no_data.json")}
              />
            )}
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{ paddingVertical: 8 }}
            data={filteredReports}
            renderItem={({ item }) => <AcademicReportItem item={item} />}
            keyExtractor={(item, index) => index.toString()}
          />
        )}
      </>
    );
  };

  

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <BottomModal isVisible={modalVisible} onClose={toggleModal}>
        <OptionsButton
          icon="alert-circle"
          name={"Raise Concern"}
          color={primaryText}
          callBack={onRaiseConcern}
        />
      </BottomModal>
      <ToolbarBorder>
        <MenuItem onPress={() => navigation.goBack()}>
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <Title>Academic</Title>
        <MenuItem onPress={toggleModal}>
          <Feather name={"more-horizontal"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      <ContentView>{renderContent()}</ContentView>
    </Container>
  );
};

const styles = StyleSheet.create({
  searchView: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 12,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontFamily: "RHD-Medium",
    marginHorizontal: 16,
  },
  tagScroll: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 16,
    paddingEnd: 16,
  },
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
});

export default React.memo(AcademicReportScreen);
