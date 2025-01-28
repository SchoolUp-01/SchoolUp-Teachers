import { useState } from "react";
import { StyleSheet, View, Image, Text, Platform } from "react-native";
import { defaultImageBgColor } from "../utils/Color";

export default function Avatar({ user, width = 40, height = 40 }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <View style={[styles.avatar, { width, height, borderRadius: width / 2 }]}>
      <Image
        style={styles.avatarImage}
        source={{ uri: user?.avatar }}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageLoaded(false)}
      />
      {(!imageLoaded || user?.avatar == null) && (
        <View
          style={[
            styles.avatarFallbackContainer,
            { width, height, borderRadius: width / 2 },
          ]}
        >
          <Text style={styles.avatarFallback}>
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    overflow: "hidden",
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    backgroundColor: defaultImageBgColor || "#f5f5f5",
  },
  avatarFallbackContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e0e0e0",
  },
  avatarFallback: {
    color: "#6E6B97",
    fontSize: 16,
    textAlign: "center",
  },
});
