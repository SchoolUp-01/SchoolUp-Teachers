import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
} from "react-native";
import {
  borderColor,
  borderWidth,
  itemColor,
  primaryColor,
  secondaryText,
} from "../utils/Color";
import { useNavigation } from "@react-navigation/native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import BottomModal from "./Modals";
import { useEffect, useState } from "react";
import { ScreenHint } from "./styledComponents";
import supabase_api from "../backend/supabase_api";
import ErrorLogger from "../utils/ErrorLogger";
const { width, height } = new Dimensions.get("screen");
export default function ClassSearchModal({
  showClassDialog,
  callBackFunction,
  selectedList,
  setSelectedList,
}) {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    supabase_api.shared
      .getSchoolClasses()
      .then((res) => {
        setClassList(res);
      })
      .catch((error) => {
        ErrorLogger.shared.ShowError(
          "ClassSearchModal: getSchoolClasses: ",
          error
        );
      });

    return () => {};
  }, []);

  const onSelect = (item) => {
    setRefreshing(true);
    setSelectedList([...selectedList, item]); // Update state immutably
    setRefreshing(false);
  };

  const onRemove = (item) => {
    setRefreshing(true);
    const updatedList = selectedList.filter(
      (selectedItem) => selectedItem !== item
    ); // Filter out the removed item
    setSelectedList(updatedList); // Update state immutably
    setRefreshing(false);
  };

  const onCloseModal = () => {
    callBackFunction();
  };

  const ClassItem = ({ item }) => {
    const { id, standard, section, student_count } = item;
    const selected = selectedList?.indexOf(item) !== -1;
    const searchTextLower = searchText.toLowerCase();
    const standardLower = standard.toLowerCase();
    const sectionLower = section.toLowerCase();
    // Check if either standard or section contains the search text, irrespective of case
    if (
      standardLower.includes(searchTextLower) ||
      sectionLower.includes(searchTextLower)
    ) {
      return (
        <TouchableOpacity
          onPress={() => {
            if (selected) onRemove(item);
            else onSelect(item);
          }}
        >
          <View
            style={{
              width: width - 32,
              paddingVertical: 8,
              marginVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              borderWidth: selected ? 1 : borderWidth,
              borderColor: selected ? primaryColor : borderColor,
              borderRadius: 8,
              paddingHorizontal: 16,
            }}
          >
            <Image
              style={{
                width: 80,
                height: 56,
                borderRadius: 4,
                alignSelf: "center",
              }}
              source={{
                uri: "https://t4.ftcdn.net/jpg/04/94/66/87/240_F_494668734_88x2VsluK9x67wayJwMsthjpBB4oCgUn.jpg",
              }}
            />
            <View style={{ marginHorizontal: 16, justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "RHD-Medium",
                  fontSize: 18,
                  lineHeight: 27,
                }}
              >
                Grade {standard}, Section {section}
              </Text>
              <Text
                style={{
                  fontFamily: "RHD-Medium",
                  fontSize: 14,
                  lineHeight: 21,
                  marginStart: 2,
                  color: secondaryText,
                }}
              >
                {student_count} Students
              </Text>
            </View>
            {/* <View style={{ marginStart: 16,flex:1,justifyContent:'center',alignItems:"flex-end" }}>
            <Text style={{borderRadius:40,padding:8,borderColor: borderColor,borderWidth:borderWidth}}>65</Text>
          </View> */}
          </View>
        </TouchableOpacity>
      );
    } else return null;
  };

  const OptionItem = ({ item, selected }) => {
    return (
      <View
        key={item?.id}
        style={[
          styles.optionItem,
          {
            backgroundColor: selected ? primaryColor : itemColor,
          },
        ]}
      >
        <Text
          style={[
            styles.optionText,
            {
              color: selected ? "#fff" : primaryText,
              fontFamily: selected ? "RHD-Medium" : "RHD-Regular",
            },
          ]}
        >
          {selected ? selectedList?.length + " Classes Selected" : item}
        </Text>
      </View>
    );
  };

  return (
    <BottomModal isVisible={showClassDialog} onClose={onCloseModal}>
      <View style={styles.searchView}>
        <Feather name="search" size={16} color={secondaryText} />
        <TextInput
          style={styles.searchInput}
          selectionColor={primaryColor}
          placeholder="Search Standard or Section"
          onChangeText={(search) => setSearchText(search)}
          value={searchText}
          autoCapitalize="none"
        />
        {searchText.length !== 0 && (
          <TouchableOpacity onPress={() => setSearchText("")}>
            <Feather name="x" size={16} color={secondaryText} />
          </TouchableOpacity>
        )}
      </View>
      <ScreenHint>
        Only parents of selected students' classes can view this memory.
      </ScreenHint>
      <ScrollView
        horizontal
        contentContainerStyle={{
          width: width - 32,
          alignItems: "flex-start",
          paddingVertical: 8,
        }}
      >
        <OptionItem selected={true} />
        {/* {selectedList.forEach((item) => {
          <OptionItem key={item?.id} item={item} />;
        })} */}
      </ScrollView>
      <View style={{ height: (height * 1) / 2 }}>
        <FlatList
          nestedScrollEnabled
          data={classList}
          renderItem={({ item, index }) => (
            <ClassItem item={item} index={index} />
          )}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={{}}
          refreshing={refreshing}
        />
      </View>
      <TouchableOpacity
        style={styles.primaryButton}
        onPress={() => {
          onCloseModal();
        }}
      >
        {loading && <ActivityIndicator size={36} color={"#fff"} />}
        {!loading && <Text style={styles.primaryText}>Select Classes</Text>}
      </TouchableOpacity>
    </BottomModal>
  );
}

const styles = StyleSheet.create({
  searchView: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderColor: borderColor,
    borderWidth: borderWidth,
    borderRadius: 12,
    marginBottom: 12,
    height: 52,
  },
  searchInput: {
    flex: 1,
    fontFamily: "RHD-Medium",
    marginHorizontal: 16,
  },
  primaryButton: {
    width: width - 32,
    backgroundColor: primaryColor,
    marginBottom: 16,
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
  optionText: {
    fontSize: 14,
    lineHeight: 21,
    paddingHorizontal: 8,
    textAlignVertical: "center",
    fontFamily: "RHD-Regular",
  },
  optionItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: borderWidth,
    borderColor: borderColor,
    backgroundColor: itemColor,
  },
});
