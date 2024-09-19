import { ActivityIndicator } from "react-native";
import { Container } from "../components/styledComponents";
import { primaryColor } from "../utils/Color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../backend/supabaseClient";
import ErrorLogger from "../utils/ErrorLogger";
import supabase_api from "../backend/supabase_api";
import React, { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import EmptyState from "../components/EmptyState";

export default function LoadingScreen() {
  const navigation = useNavigation();
  useEffect(() => {
    checkStatus();
    return () => {};
  }, []);

  checkStatus = async () => {
    let user_metadata = null;
    let user = await AsyncStorage.getItem("user_metadata");
    if (user !== null) {
      user_metadata = JSON.parse(user);
    } else {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        ErrorLogger.shared.ShowError("LoadingScreen: CheckStatus: ", error);
      } else {
        supabase_api.shared.setUid(data?.user);
        user_metadata = data?.user?.user_metadata;
      }
    }
    let newUser = null;
    if (Object.keys(user_metadata).length == 0) newUser = true;
    else newUser = user_metadata?.NewTeacher;
    let defaultScreen = newUser ? "CreateProfileScreen" : "HomeScreen";
    if (newUser === undefined) defaultScreen = "CreateProfileScreen";
    navigation.replace(defaultScreen);
  };

  return (
    <Container>
      <EmptyState
        title=""
        description=""
        animation={require("../assets/school_main.json")}
      />
    </Container>
  );
}
