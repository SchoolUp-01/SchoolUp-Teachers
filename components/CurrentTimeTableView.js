import React, { useState, useEffect } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import {
  borderColor,
  borderWidth,
  defaultImageBgColor,
  primaryColor,
  primaryColor_300,
  primaryColor_800,
} from "../utils/Color";
import { Feather } from "@expo/vector-icons";
import AnimatedLottieView from "lottie-react-native";
import supabase_api from "../backend/supabase_api";
import { LinearGradient } from "expo-linear-gradient";
import Teacher from "../state/TeacherManager";
let days = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
export default function CurrentTimeTableView() {
  const [schoolOver, setSchoolOver] = useState(false);
  const [studentID, setStudentID] = useState(Teacher.shared._teacherID);
  const [day, setDay] = useState(0);
  const [currentClass, setCurrentClass] = useState(null);
  const [holiday, setHoliday] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const [schoolCompleted, setSchoolCompleted] = useState(true);

  useEffect(() => {
    setCurrentClass('xyz')
    // let day = new Date().getDay();
    // if (day == 0) setSchoolOver(true);
    // setSchedule([])
    // setDay(day);
    // supabase_api.shared.getTimeTableForDay(days[day]).then((res) => {
    //   setSchedule(res);
    //   classes = getCurrentClass(res);
    //   setCurrentClass(classes);
    // });
    return () => {};
  }, [studentID]);


  function getCurrentClass(classArray) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    const currentTime = currentHour * 60 + currentMinute; // Convert current time to total minutes

    for (let i = 0; i < classArray.length; i++) {
      const startHour = classArray[i].start_hour;
      const startMinute = classArray[i].start_minute;
      const endHour = classArray[i].end_hour;
      const endMinute = classArray[i].end_minute;

      const classStartTime = startHour * 60 + startMinute;
      const classEndTime = endHour * 60 + endMinute;

      if (currentTime >= classStartTime && currentTime <= classEndTime) {
        return classArray[i];
      }else{ //-> To add additional check for school end time
        setSchoolOver(true) 
      }
    }

    return null; // Return null if no class is currently ongoing
  }

  const renderCurrentClass = () => {
    if (day == 0) {
      //render sunday schedule
      return(
        <View style={styles.container}>
        <ImageBackground
          style={{
            flex: 1,
            borderWidth: borderWidth,
            height: 160,
            borderColor: borderColor,
            borderRadius: 8,
          }}
          blurRadius={5}
          imageStyle={{ borderRadius: 8 }}
          source={require('../assets/white_bg.jpg')}
        >
          <View
            style={{
              flexDirection: "row",
              borderRadius: 8,
            }}
          >
            <View
              style={{
                paddingHorizontal: 16,
                paddingVertical: 12,
                justifyContent: "space-between",
                flex: 1,
                zIndex: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View>
                  <Text
                    style={{
                      fontFamily: "RHD-Bold",
                      fontSize: 18,
                      lineHeight: 27,
                      color: primaryColor,
                      zIndex: 1,
                    }}
                  >
                    Happy Sunday
                  </Text>
                  <Text
                    style={{
                      fontFamily: "RHD-Medium",
                      fontSize: 12,
                      lineHeight: 16,
                      color: primaryColor_800,
                    }}
                  >
                    No Classes today
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    marginTop: 4,
                    marginBottom: 8,
                  }}
                >

                  <Text
                    style={{
                      fontFamily: "RHD-Medium",
                      color: primaryColor_800,
                    }}
                  >
                    {new Date().toDateString()}
                  </Text>
                </View>
              </View>
            </View>
            <AnimatedLottieView
              style={{
                width: 160,
                height: 160,
                backgroundColor: "transparent",
                alignSelf: "center",
              }}
              source={{
                uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/holiday/sunday.json?t=2023-12-17T07%3A43%3A42.526Z",
              }}
            />
          </View>
        </ImageBackground>
      </View>
      )
    } else if (holiday) {
      //render holiday
      return <View></View>;
    } else if (currentClass) {
      //current class information
      return (
        <View style={styles.container}>
          <ImageBackground
            style={{
              flex: 1,
              borderWidth: borderWidth,
              height: 160,
              borderColor: borderColor,
              borderRadius: 8,
            }}
            blurRadius={1}
            imageStyle={{ borderRadius: 8 }}
            source={require('../assets/science_bg.jpg')}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#00000080",
                borderRadius: 8,
                flex: 1,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  justifyContent: "space-between",
                  flex: 1,
                  zIndex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "RHD-Bold",
                        fontSize: 18,
                        lineHeight: 27,
                        color: "#fff",
                        zIndex: 1,
                      }}
                    >
                      {"Science"}
                      {/* currentClass?.title */}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "RHD-Medium",
                        fontSize: 12,
                        lineHeight: 16,
                        color: "#fff",
                      }}
                    >
                      Current Period - 3B 
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor: primaryColor_300,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: primaryColor_800,
                        fontFamily: "RHD-Medium",
                        fontSize: 12,
                      }}
                    >
                      {10 +
                        ":" +
                        30 +
                        " - " +
                       11+
                        ":" +
                        20}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 4,
                      marginBottom: 8,
                    }}
                  >
                    <View style={styles.avatar}></View>

                    <Text
                      style={{
                        marginStart: 8,
                        fontFamily: "RHD-Medium",
                        color: "#fff",
                      }}
                    >
                      {"Asha Patil"}
                    </Text>
                    {/* //currentClass?.subject_info?.teacher_info?.name */}
                  </View>
                  <TouchableOpacity>
                    <Feather name="clipboard" color={"#fff"} size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      );
    } else if (schedule.length === 0) {
      //no information available
      return (
        <View style={styles.container}>
          <ImageBackground
            style={{
              flex: 1,
              borderWidth: borderWidth,
              height: 160,
              borderColor: borderColor,
              borderRadius: 8,
            }}
            blurRadius={1}
            imageStyle={{ borderRadius: 8 }}
            source={{
              uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/classes/no_timetable.jpg",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#00000070",
                borderRadius: 8,
                flex: 1,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  justifyContent: "space-between",
                  flex: 1,
                  zIndex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "RHD-Bold",
                        fontSize: 18,
                        lineHeight: 27,
                        color: "#fff",
                        zIndex: 1,
                      }}
                    >
                      No timetable available
                    </Text>
                    <Text
                      style={{
                        fontFamily: "RHD-Medium",
                        fontSize: 12,
                        lineHeight: 16,
                        color: "#fff",
                      }}
                    >
                      Timetable information is currently unavailable.
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor: primaryColor_300,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: primaryColor_800,
                        fontFamily: "RHD-Medium",
                        fontSize: 12,
                      }}
                    >
                      Coming Soon
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 4,
                      marginBottom: 8,
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: "RHD-Medium",
                        color: "#fff",
                      }}
                    >
                      {/* {Student.shared.getMasterStudentSchoolName()} */}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Feather name="alert-circle" color={"#fff"} size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      );
    } else {
      //render break/lunch or schoolOver status
     return(
      <View style={styles.container}>
      <ImageBackground
        style={{
          flex: 1,
          borderWidth: borderWidth,
          height: 180,
          borderColor: borderColor,
          borderRadius: 8,
        }}
        blurRadius={1}
        imageStyle={{ borderRadius: 8 }}
        source={{
          uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/classes/evening_bg.jpg",
        }}
      >
        {/* <View
          style={{
            flexDirection: "row",
            backgroundColor: "#00000070",
            borderRadius: 8,
            flex: 1,
          }}
        > */}
        <LinearGradient
              style={{flexDirection: "row",
              borderRadius: 8,
              flex: 1, }}
              colors={[ "#0000005a","#0000004a","#0000003a","#0000004a","#0000005a"  ]}
            >
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 12,
              justifyContent: "space-between",
              flex: 1,
              zIndex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: "RHD-Bold",
                    fontSize: 18,
                    lineHeight: 27,
                    color: "#fff",
                    zIndex: 1,
                  }}
                >
                  Good evening
                </Text>
                <Text
                  style={{
                    fontFamily: "RHD-Medium",
                    fontSize: 12,
                    lineHeight: 16,
                    color: "#fff",
                  }}
                >
                  No more classes for today
                </Text>
              </View>
              {/* <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  backgroundColor: primaryColor_300,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: primaryColor_800,
                    fontFamily: "RHD-Medium",
                    fontSize: 12,
                  }}
                >
                  {currentClass?.start_hour +
                    ":" +
                    currentClass?.start_minute +
                    " - " +
                    currentClass?.end_hour +
                    ":" +
                    currentClass?.end_minute}
                </Text>
              </View> */}
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  marginTop: 4,
                  marginBottom: 8,
                }}
              >

                <Text
                  style={{
                    fontFamily: "RHD-Medium",
                    color: "#fff",
                  }}
                >
                  View tomorrow's timetable
                </Text>
              </View>
              <TouchableOpacity>
                <Feather name="chevron-right" color={"#fff"} size={16} />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
     )
    }
  };

  return (
    <View>
      {renderCurrentClass()}
      {/* {!schoolOver ? (
        <View style={styles.container}>
          <ImageBackground
            style={{
              flex: 1,
              borderWidth: borderWidth,
              height: 160,
              borderColor: borderColor,
              borderRadius: 8,
            }}
            blurRadius={1}
            imageStyle={{ borderRadius: 8 }}
            source={{
              uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/classes/kannada_bg.jpg?t=2023-12-19T07%3A31%3A15.143Z",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "#00000070",
                borderRadius: 8,
                flex: 1,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  justifyContent: "space-between",
                  flex: 1,
                  zIndex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "RHD-Bold",
                        fontSize: 18,
                        lineHeight: 27,
                        color: "#fff",
                        zIndex: 1,
                      }}
                    >
                      {currentClass?.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: "RHD-Medium",
                        fontSize: 12,
                        lineHeight: 16,
                        color: "#fff",
                      }}
                    >
                      Current Period
                    </Text>
                  </View>
                  <View
                    style={{
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      backgroundColor: primaryColor_300,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: primaryColor_800,
                        fontFamily: "RHD-Medium",
                        fontSize: 12,
                      }}
                    >
                      {currentClass?.start_hour +
                        ":" +
                        currentClass?.start_minute +
                        " - " +
                        currentClass?.end_hour +
                        ":" +
                        currentClass?.end_minute}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 4,
                      marginBottom: 8,
                    }}
                  >
                    <View style={styles.avatar}></View>

                    <Text
                      style={{
                        marginStart: 8,
                        fontFamily: "RHD-Medium",
                        color: "#fff",
                      }}
                    >
                      {currentClass?.subject_info?.teacher_info?.name}
                    </Text>
                  </View>
                  <TouchableOpacity>
                    <Feather name="clipboard" color={"#fff"} size={16} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>
      ) : (
        <View style={styles.container}>
          <ImageBackground
            style={{
              flex: 1,
              borderWidth: borderWidth,
              height: 160,
              borderColor: borderColor,
              borderRadius: 8,
            }}
            blurRadius={5}
            imageStyle={{ borderRadius: 8 }}
            source={{
              uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/classes/music_bg.jpg",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                borderRadius: 8,
              }}
            >
              <View
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 12,
                  justifyContent: "space-between",
                  flex: 1,
                  zIndex: 1,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View>
                    <Text
                      style={{
                        fontFamily: "RHD-Bold",
                        fontSize: 18,
                        lineHeight: 27,
                        color: primaryColor,
                        zIndex: 1,
                      }}
                    >
                      Happy Sunday
                    </Text>
                    <Text
                      style={{
                        fontFamily: "RHD-Medium",
                        fontSize: 12,
                        lineHeight: 16,
                        color: primaryColor_800,
                      }}
                    >
                      No Classes today
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      marginTop: 4,
                      marginBottom: 8,
                    }}
                  >

                    <Text
                      style={{
                        fontFamily: "RHD-Medium",
                        color: primaryColor_800,
                      }}
                    >
                      {new Date().toDateString()}
                    </Text>
                  </View>
                </View>
              </View>
              <AnimatedLottieView
                style={{
                  width: 160,
                  height: 160,
                  backgroundColor: "transparent",
                  alignSelf: "center",
                }}
                source={{
                  uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/holiday/sunday.json?t=2023-12-17T07%3A43%3A42.526Z",
                }}
              />
            </View>
          </ImageBackground>
        </View>
      )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  subView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: "center",
    alignSelf: "center",
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 18,
    backgroundColor: defaultImageBgColor,
  },
});

{
  /* <ImageBackground
            style={{
              flex: 0.33,
              borderWidth: borderWidth,
              height: 140,
              borderColor: borderColor,
              borderRadius: 8,
            }}
            blurRadius={2}
            imageStyle={{ borderRadius: 8 }}
            source={{
              uri: "https://sjatpdkmjrgboolzcdxs.supabase.co/storage/v1/object/public/classes/kannada_bg.jpg?t=2023-12-19T07%3A31%3A15.143Z",
            }}
          >
            <View
              style={{
                flex: 1,
                flexShrink: 1,
                paddingHorizontal: 8,
                paddingVertical: 8,
                justifyContent: "space-between",
                backgroundColor: "#00000080",
                borderRadius: 8,
              }}
            >
              <View>
                <Text
                  style={{
                    fontFamily: "RHD-Medium",
                    fontSize: 18,
                    lineHeight: 27,
                    color: "#fff",
                  }}
                >
                  Science
                </Text>
                <Text
                  style={{
                    fontFamily: "RHD-Regular",
                    fontSize: 12,
                    lineHeight: 16,
                    color: "#ffffff",
                  }}
                >
                  Next Period
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexShrink: 1,
                  marginTop: 4,
                  marginBottom: 8,
                  marginEnd: 8,
                }}
              >
                <Text
                  style={{
                    marginStart: 8,
                    fontFamily: "RHD-Medium",
                    color: "#fff",
                  }}
                >
                  See All
                </Text>
                <TouchableOpacity>
                  <Feather name="chevron-right" color={"#fff"} size={16} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground> */
}
