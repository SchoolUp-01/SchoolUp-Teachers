import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import "react-native-url-polyfill/auto";

const SUPABASE_URL = "https://sjatpdkmjrgboolzcdxs.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNqYXRwZGttanJnYm9vbHpjZHhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDIxOTU0NzIsImV4cCI6MjAxNzc3MTQ3Mn0.7ewGsbKa6parI0x01SAl63X36lihTS3BV9OMZ7LAwqE";

const ExpoSecureStoreAdapter = {
  getItem: (key) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key, value) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key) => {
    SecureStore.deleteItemAsync(key);
  },
};

// const url = new URLParse(SUPABASE_URL);
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  schema: "schoolup",
  persistSession: true,
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
