import React, { useEffect, useState } from "react";
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

const StudentAcademicReportItem = ({
  item,
  index,
  ref,
  handleNext,
  onReportUpdate,
  maxMarks, // Pass the maximum marks for validation
  error=false,
}) => {
  const [marks, setMarks] = useState(""); // State for marks input
  const [remarks, setRemarks] = useState(""); // State for remarks input
  const [marksFocused, setMarksFocused] = useState(false);
  const [remarksFocused, setRemarksFocused] = useState(false);
  const [isRemarkVisible, setIsRemarkVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(error?"Marks cannot be empty!":null); // State for error message

  useEffect(() => {
    
  //generator a random number betweem -1 to maxMarks and call onMarksChange for the same
  const randomMarks = Math.floor(Math.random() * (maxMarks + 2)) - 1; // Random between -1 and maxMarks
  onMarksChange(randomMarks.toString());
  }, [])
  
  // Function to handle marks change
  const onMarksChange = (value) => {
    const enteredMarks = parseFloat(value);
    if (enteredMarks >= -1 && enteredMarks <= maxMarks) {
      setMarks(value);
      setErrorMessage(null); // Clear error message if valid
      onReportUpdate(item.id, value, remarks); // Call callback with updated data
    } else {
      setErrorMessage(`Marks should be between -1 and ${maxMarks}`);
      setMarks(value)
    }
  };

  // Function to handle remarks change
  const onRemarksChange = (value) => {
    setRemarks(value);
    onReportUpdate(item.id, marks, value); // Call callback with updated data
  };

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
            backgroundColor: defaultImageBgColor,
          }}
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
        keyboardType="numeric"
        selectionColor={primaryColor}
        onSubmitEditing={() => handleNext(index)}
        placeholder={` Enter mark (Max ${maxMarks})`}
        placeholderTextColor={borderColor ?? underlayColor}
        value={marks}
        onFocus={() => setMarksFocused(true)}
        onBlur={() => setMarksFocused(false)}
        onChangeText={onMarksChange} // Call onMarksChange on text change
      />

      {/* Display error message if the marks are invalid */}
      {errorMessage && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      {isRemarkVisible && (
        <TextInput
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
          onSubmitEditing={() => handleNext(index)}
          selectionColor={primaryColor}
          onFocus={() => setRemarksFocused(true)}
          onBlur={() => setRemarksFocused(false)}
          value={remarks}
          onChangeText={onRemarksChange} // Call onRemarksChange on text change
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
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "RHD-Medium",
  },
});

export default React.memo(StudentAcademicReportItem);
