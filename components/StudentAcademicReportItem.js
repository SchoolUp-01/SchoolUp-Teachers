import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  itemBorder,
  itemColor,
  primaryColor,
  primaryColor_800,
  primaryText,
  secondaryText,
  underlayColor,
} from "../utils/Color";

const StudentAcademicReportItem = ({ item,index,ref,handleNext }) => {
  const [marksFocused, setMarksFocused] = useState(false);
  const [remarksFocused, setRemarksFocused] = useState(false);
  const [isRemarkVisible, setIsRemarkVisible] = useState(false);

  return (
    <View style={styles.itemContainer}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Image
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            marginEnd: 16,
            borderWidth: borderWidth,
            borderColor: borderColor,
            backgroundColor:defaultImageBgColor
          }}
          // source={{ uri: avatar }}
          defaultSource={require("../assets/DefaultImage.jpg")}
        />
        <View style={{ alignSelf: "center", flex: 1 }}>
          <Text style={styles.itemLabel}>{item.name}</Text>
          <Text style={[styles.subLabel]}>Roll no: {item?.roll_no}</Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            setIsRemarkVisible(!isRemarkVisible);
          }}
          style={{
            paddingVertical: 6,
            borderRadius: 8,
            paddingHorizontal: 12,
            marginTop: 4,
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: "RHD-Medium", color: primaryColor_800 }}>
            {isRemarkVisible ? "Remove" : " + Add Remark"}
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        ref={ref}
        style={[
          styles.input,
          {
            borderColor: marksFocused ? primaryColor : borderColor,
            borderWidth: marksFocused ? 1 : itemBorder,
          },
        ]}
        // keyboardType="numeric"
        selectionColor={primaryColor}
        onSubmitEditing={() => handleNext(index)}
        placeholder={` Enter mark here`}
        placeholderTextColor={borderColor ?? underlayColor}
        onFocus={() => setMarksFocused(true)}
        onBlur={() => setMarksFocused(false)}
      />
      {isRemarkVisible && (
        <TextInput
          // ref={inputRefs.current[index]}
          style={[
            styles.input,
            {
              height: 120,
              textAlignVertical: "top",
              paddingVertical: 4,
              borderColor: remarksFocused ? primaryColor : borderColor,
              borderWidth: remarksFocused ? 1 : itemBorder,
            },
          ]}
          placeholder={` Add a review (Optional)`}
          placeholderTextColor={borderColor ?? underlayColor}
          keyboardType="default"
          multiline
          onSubmitEditing={() => handleFocusNextInput(index)}
          selectionColor={primaryColor}
          onFocus={() => setRemarksFocused(true)}
          onBlur={() => setRemarksFocused(false)}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  itemLabel: {
    fontSize: 16,
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    lineHeight: 24,
  },
  subLabel: {
    fontSize: 14,
    textAlignVertical: "center",
    fontFamily: "RHD-Medium",
    lineHeight: 21,
    color: secondaryText,
  },
  input: {
    height: 48,
    fontSize: 16,
    color: primaryText,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontFamily: "RHD-Medium",
    backgroundColor: itemColor,
    borderColor: borderColor,
    borderWidth: borderWidth,
    marginTop: 12,
    textAlignVertical: "center",
  },
});

export default React.memo(StudentAcademicReportItem);
