import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from "react-native";
import {
  borderColor,
  borderWidth,
  primaryColor,
  primaryColor_50,
  primaryText,
  secondaryText,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { formatDate } from "../utils/DateUtils";
import { getOrdinalSuffix } from "../utils/Number";
import { InformationView } from "./Modals";
import { UserInformation } from "./InformationView";
import Avatar from "./Avatar";
import { ItemLabel } from "./Label";

const ConcernReportItem = ({ item, tag = "All" }) => {
  const navigation = useNavigation();
  const [loading] = useState(false);
  const [height] = useState(new Animated.Value(0));

  const navigateToScreen = () => {
    navigation.navigate("UpdateConcernScreen", {
      item: item,
    });
  };

  // Comprehensive safe destructuring with detailed null checking
  const safeItem = useMemo(() => {
    if (!item) return {};

    return {
      closed_on: item.closed_on || null,
      created_at: item.created_at || null,
      id: item.id || null,
      parent_info: item.parent_info || {
        avatar: null,
        id: null,
        name: ''
      },
      reason: item.reason || '',
      remarks: item.remarks || '',
      student_info: item.student_info || {
        avatar: null,
        id: null,
        name: '',
        class_info: {
          section: '',
          standard: ''
        }
      },
      type: item.type || '',
      status: item.status || ''
    };
  }, [item]);

  const {
    parent_info,
    student_info,
    reason,
    type,
    status,
    created_at
  } = safeItem;

  const getStatusColor = () => {
    switch (status) {
      case "New": return "#0000FF";
      case "Open": return "#008000";
      case "Closed": return "#800080";
      default: return "#808080";
    }
  };

  return (
    <View
      style={{
        paddingHorizontal: 16,
        marginVertical: 12,
        paddingVertical: 4,
        borderBottomWidth: borderWidth,
        borderColor: borderColor,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {student_info?.name && (
          <>
            <Avatar
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                borderWidth: borderWidth,
                borderColor: borderColor,
              }}
              width={48}
              height={48}
              user={{
                avatar: student_info.avatar || null,
                name: student_info.name || ''
              }}
            />
            <View style={{ flex: 1, marginHorizontal: 16 }}>
              <Text
                style={{
                  fontFamily: "RHD-Medium",
                  fontSize: 16,
                  lineHeight: 24,
                }}
              >
                {student_info.name}
              </Text>
              {(student_info.class_info?.standard || student_info.class_info?.section) && (
                <Text
                  style={{
                    fontFamily: "RHD-Medium",
                    fontSize: 14,
                    lineHeight: 21,
                    color: secondaryText,
                  }}
                >
                  {student_info.class_info?.standard 
                    ? getOrdinalSuffix(student_info.class_info.standard) 
                    : ''} {student_info.class_info?.section || ''}
                </Text>
              )}
            </View>
          </>
        )}
        <View style={{ marginTop: 8, flexDirection: "row", alignItems: "center", gap: 8 }}>
          {tag == "Open" && (
            <View
              style={{
                paddingHorizontal: 8,
                paddingVertical: 4,
                backgroundColor: primaryColor_50,
                borderRadius: 8,
                flexShrink: 1,
                marginEnd: 8,
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  lineHeight: 21,
                  fontFamily: "RHD-Medium",
                  color: primaryColor,
                }}
              >
                {"no new updates"}
              </Text>
            </View>
          )}
          {tag === 'All' && status && <ItemLabel label={status} color={getStatusColor()}/>}
          <TouchableOpacity onPress={navigateToScreen}>
            <Feather name="chevron-right" size={24} color={primaryText} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          columnGap: 16,
          marginTop: 8,
        }}
      >
        {type && <InformationView label="Type" value={type} />}
        {reason && <InformationView label="Reason" value={reason} />}
      </View>
      <View style={{ flexDirection: "row", flexWrap: "wrap", columnGap: 16 }}>
        {parent_info?.name && (
          <UserInformation
            title="Parent"
            name={parent_info.name}
            avatar={parent_info.avatar}
          />
        )}
        {created_at && (
          <InformationView label="Created on" value={formatDate(created_at)} />
        )}
      </View>
    </View>
  );
};

export default React.memo(ConcernReportItem);