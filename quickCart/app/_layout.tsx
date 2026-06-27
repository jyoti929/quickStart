import { Stack } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { Theme } from "../constants/theme";

export default function RootLayout() {
  const content = (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="home" />
    </Stack>
  );

  if (Platform.OS === "web") {
    return (
      <View style={styles.webOuterContainer}>
        <View style={styles.webAppContainer}>
          {content}
        </View>
      </View>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  webOuterContainer: {
    flex: 1,
    backgroundColor: "#E2EAF4", // Soft light gray-blue background for the desktop web view
    justifyContent: "center",
    alignItems: "center",
  },
  webAppContainer: {
    width: "100%",
    maxWidth: 450,
    height: "100%",
    backgroundColor: Theme.colors.background,
    // Add mobile simulator shadows & borders for web browser view
    shadowColor: "#1a3a30",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
  },
});
