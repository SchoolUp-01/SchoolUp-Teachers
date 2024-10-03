import { Text, View } from "react-native"

export const ApprovedLabel = () =>{
    return(
        <View
          style={{
            width: 90,
            backgroundColor: "#00b1042a",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            marginEnd: 16,
            alignItems:"center",
            justifyContent:"center",
            height:36,
            alignSelf:"center"
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "RHD-Medium",
              fontSize: 14,
              lineHeight: 21,
              color: "#00b104",
            }}
          >
            Approved
          </Text>
        </View>
    )
}

export const PendingLabel =({label}) =>{
    return(
        <View
          style={{
            width: 90,
            backgroundColor: "#FFAC002a",
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 4,
            marginEnd: 16,
            alignItems:"center",
            justifyContent:"center",
            height:36,
            alignSelf:"center"
          }}
        >
          <Text
            style={{
              textAlign: "center",
              fontFamily: "RHD-Medium",
              fontSize: 14,
              lineHeight: 21,
              color: "#FFAC00",
            }}
          >
            {label}
          </Text>
        </View>
    )
}

export const NoticeLabel =({label}) =>{
  return(
      <View
        style={{
          width: 90,
          backgroundColor: "#f74c062a",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
          marginEnd: 16,
          alignItems:"center",
          justifyContent:"center",
          height:36,
          alignSelf:"center"
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "RHD-Medium",
            fontSize: 14,
            lineHeight: 21,
            color: "#f74c06",
          }}
        >
          {"Notice"}
        </Text>
      </View>
  )
}

export const EventLabel =({label}) =>{
  return(
      <View
        style={{
          width: 90,
          backgroundColor: "#b330e12a",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
          marginEnd: 16,
          alignItems:"center",
          justifyContent:"center",
          height:36,
          alignSelf:"center"
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "RHD-Medium",
            fontSize: 14,
            lineHeight: 21,
            color: "#b330e1",
          }}
        >
          {"Event"}
        </Text>
      </View>
  )
}

export const MeetingLabel =({label}) =>{
  return(
      <View
        style={{
          width: 90,
          backgroundColor: "#FFAC002a",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
          marginEnd: 16,
          alignItems:"center",
          justifyContent:"center",
          height:36,
          alignSelf:"center"
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "RHD-Medium",
            fontSize: 14,
            lineHeight: 21,
            color: "#FFAC00",
          }}
        >
          {label}
        </Text>
      </View>
  )
}

export const ItemLabel = ({label,color}) =>{
  return(
      <View
        style={{
          backgroundColor: color+"2a",
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 4,
          alignItems:"center",
          justifyContent:"center",
          alignSelf:"center"
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontFamily: "Inter-Medium",
            fontSize: 12,
            color: color,
          }}
        >
          {label}
        </Text>
      </View>
  )
}