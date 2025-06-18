import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function YoutubeViewer() {
  const router = useRouter();
  const { url } = useLocalSearchParams(); // assuming you pass `url` as a param

  return (
    <View style={{ flex: 1 }}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>YouTube Viewer</Text>
      </View>

      {/* WebView to show the YouTube page */}
      <WebView
        source={{ uri: String(url) }}
        style={{ flex: 1 }}
        startInLoadingState
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: "#1c1c1e",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  backButton: {
    padding: 8,
    paddingTop:30,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "500",
    paddingTop: 20,
  },
});
