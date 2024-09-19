import React, { useRef, useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import {
  Container,
  ContentView,
  MenuItem,
  TitleHeader,
  TitleSubHeader,
  TitleView,
  ToolbarBorder,
} from "../components/styledComponents";
import CustomStatusBarView from "../components/CustomStatusBarView";
import { useNavigation } from "@react-navigation/native";
import MarksInfoItem from "../components/MarksInfoItem";
import { Feather } from "@expo/vector-icons";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryText,
  secondaryText,
} from "../utils/Color";
import FeeInfoItem from "../components/FeeInfoItem";
import TransactionItem from "../components/TransactionItem";
import FeeDueItem from "../components/FeeDueItem";
import PagerView from "react-native-pager-view";

const FeeReceiptScreen = () => {
  const navigation = useNavigation();
  const [tab, setTab] = useState("School Fee");
  const [selectedPage, setSelectedPage] = useState(0);
  const pagerRef = useRef();
  const tabList = ["School Fee", "Activity Fee", "Other Fee"];

  const TabItem = ({ item }) => {
    return (
      <View
        style={[
          styles.tabItem,
          {
            borderColor: item == tab ? primaryColor : borderColor,
            borderBottomWidth: item == tab ? 1 : 0,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => {
            pagerRef.current.setPage(tabList.indexOf(item));
          }}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: item == tab ? primaryColor : primaryText,
                fontFamily: item == tab ? "RHD-Bold" : "RHD-Medium",
              },
            ]}
          >
            {item}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Container>
      <CustomStatusBarView barStyle="dark-content" />
      <ToolbarBorder>
        <MenuItem
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Feather name={"arrow-left"} size={24} color={primaryText} />
        </MenuItem>
        <TitleView>
          <TitleSubHeader>Fee Receipt</TitleSubHeader>
          <TitleHeader numberOfLines={1}>
            {Student.shared.getMasterStudentName()}
          </TitleHeader>
        </TitleView>
        <MenuItem onPress={() => {}}>
          <Feather name={"alert-circle"} size={20} color={primaryText} />
        </MenuItem>
      </ToolbarBorder>
      <ContentView>
        <View style={styles.tabView}>
          <TabItem item={tabList[0]} />
          <TabItem item={tabList[1]} />
          <TabItem item={tabList[2]} />
        </View>
        <PagerView
          ref={pagerRef}
          style={{
            flex: 1,
          }}
          initialPage={selectedPage}
          onPageSelected={(position) => {
            setSelectedPage(position.nativeEvent.position);
            setTab(tabList[position.nativeEvent.position]);
          }}
        >
          <View>
            <View
              style={{
                flexDirection: "row",
                marginVertical: 16,
                paddingHorizontal: 16,
                alignItems: "flex-start",
                justifyContent: "flex-start",
              }}
            >
              <View style={styles.feeItem}>
                <Text style={styles.feeLabel}>Total Amount</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.feeDenomination}>₹</Text>

                  <Text style={styles.feeValue}>16000</Text>
                </View>
              </View>
              <View style={styles.feeItem}>
                <Text style={styles.feeLabel}>Paid Amount</Text>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.feeDenomination}>₹</Text>

                  <Text style={styles.feeValue}>12000</Text>
                </View>
              </View>
              <View style={styles.feeItem}>
                <Text style={styles.feeLabel}>Due Amount</Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text style={styles.feeDenomination}>₹</Text>

                  <Text style={styles.feeValue}>4000</Text>
                </View>
              </View>
            </View>
            <ScrollView>
              <View>
                <Text style={styles.label}>Complete Fee Receipt</Text>
                <FeeInfoItem />
                <Text style={styles.label}>Fee Due</Text>
                <FeeDueItem amount={4000} date={"20th November 2023"} />
                <Text style={styles.label}>Transaction</Text>
                <TransactionItem amount={4000} date={"20th November 2023"} />
                <TransactionItem amount={4000} date={"5th September 2023"} />
                <TransactionItem amount={4000} date={"9th May 2023"} />
              </View>
            </ScrollView>
          </View>
          <View>
            <Text>School Activities</Text>
          </View>
          <View>
            <Text>Other Activities</Text>
          </View>
        </PagerView>
      </ContentView>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    color: "gray",
    marginBottom: 20,
  },
  subjectContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  subject: {
    fontSize: 18,
    fontWeight: "bold",
  },
  marks: {
    fontSize: 16,
    color: "gray",
  },
  feeItem: {
    flex: 1,
    alignItems: "center",
  },
  feeLabel: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    textAlign: "left",
    marginStart: 12,
  },
  feeValue: {
    fontFamily: "RHD-Bold",
    fontSize: 24,
    lineHeight: 36,
    color: primaryText,
    textAlignVertical: "bottom",
  },
  feeDenomination: {
    fontFamily: "RHD-Medium",
    fontSize: 16,
    lineHeight: 24,
    color: secondaryText,
    textAlignVertical: "bottom",
    alignSelf: "flex-end",
    marginBottom: 6,
    marginEnd: 6,
  },
  label: {
    fontFamily: "RHD-Medium",
    fontSize: 12,
    lineHeight: 16,
    color: secondaryText,
    textAlign: "left",
    alignSelf: "flex-start",
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
  },
  tabItem: {
    marginEnd: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    // backgroundColor: itemColor,
  },
  tabText: {
    fontSize: 16,
    lineHeight: 24,
    paddingHorizontal: 8,
    textAlignVertical: "center",
  },
  tabView: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginTop: 8,
    borderBottomWidth: borderWidth,
    borderColor: borderColor,
  },
});
export default FeeReceiptScreen;
