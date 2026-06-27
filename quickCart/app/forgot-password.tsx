import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../constants/theme";
import { authStore } from "../services/authStore";

export default function ForgotPassword() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form states
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibilities
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors, success, and focus states
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleResetPassword = () => {
    setError("");
    setSuccess("");

    // Field Validations
    if (!mobile.trim() || !otp.trim() || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (!authStore.hasUser(mobile.trim())) {
      setError("This mobile number is not registered.");
      return;
    }

    if (otp.trim() !== "123456") {
      setError("Invalid OTP. Use the default OTP: 123456");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Perform password reset in authStore
    const isSuccess = authStore.resetPassword(mobile.trim(), newPassword);

    if (isSuccess) {
      setSuccess("Password reset successfully!");
      setMobile("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.replace("/login" as any);
      }, 1500);
    } else {
      setError("Reset failed. Please try again.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Navigation Bar */}
        <View style={styles.navHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/login" as any)} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Theme.colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Ionicons name="bag-handle" size={48} color={Theme.colors.primaryDark} style={styles.lotusIcon} />
          <Text style={styles.title}>Forgot Password?</Text>
          <Text style={styles.subtitle}>Reset password using mobile and default OTP</Text>
        </View>

        {/* Messages */}
        {error ? (
          <View style={styles.messageContainer}>
            <Ionicons name="alert-circle" size={18} color={Theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {success ? (
          <View style={[styles.messageContainer, styles.successContainer]}>
            <Ionicons name="checkmark-circle" size={18} color={Theme.colors.success} />
            <Text style={styles.successText}>{success}</Text>
          </View>
        ) : null}

        {/* Form Fields */}
        <View style={styles.form}>
          
          {/* Mobile Field */}
          <View
            style={[
              styles.inputContainer,
              activeField === "mobile" && styles.inputActive,
            ]}
          >
            <Ionicons name="call" size={18} color={Theme.colors.textMedium} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Registered mobile number"
              placeholderTextColor={Theme.colors.textLight}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              onFocus={() => setActiveField("mobile")}
              onBlur={() => setActiveField(null)}
              maxLength={15}
            />
          </View>

          {/* OTP Field */}
          <View
            style={[
              styles.inputContainer,
              activeField === "otp" && styles.inputActive,
            ]}
          >
            <Ionicons name="shield-checkmark" size={18} color={Theme.colors.textMedium} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Default OTP (123456)"
              placeholderTextColor={Theme.colors.textLight}
              value={otp}
              onChangeText={setOtp}
              keyboardType="number-pad"
              onFocus={() => setActiveField("otp")}
              onBlur={() => setActiveField(null)}
              maxLength={6}
            />
          </View>

          {/* New Password Field */}
          <View
            style={[
              styles.inputContainer,
              activeField === "newPassword" && styles.inputActive,
            ]}
          >
            <Ionicons name="lock-closed" size={18} color={Theme.colors.textMedium} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="New password"
              placeholderTextColor={Theme.colors.textLight}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setActiveField("newPassword")}
              onBlur={() => setActiveField(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color={Theme.colors.textMedium} />
            </TouchableOpacity>
          </View>

          {/* Confirm New Password Field */}
          <View
            style={[
              styles.inputContainer,
              activeField === "confirmPassword" && styles.inputActive,
            ]}
          >
            <Ionicons name="lock-closed" size={18} color={Theme.colors.textMedium} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor={Theme.colors.textLight}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              onFocus={() => setActiveField("confirmPassword")}
              onBlur={() => setActiveField(null)}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={18} color={Theme.colors.textMedium} />
            </TouchableOpacity>
          </View>

          {/* Reset Button */}
          <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword} activeOpacity={0.9}>
            <Text style={styles.resetButtonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>

        {/* Back to Login Link */}
        <View style={styles.footerLinkContainer}>
          <Text style={styles.footerText}>Remembered your password? </Text>
          <TouchableOpacity onPress={() => router.replace("/login" as any)}>
            <Text style={styles.loginLinkText}>Sign In</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  navHeader: {
    height: 50,
    justifyContent: "center",
    marginTop: 8,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  brandHeader: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 32,
  },
  lotusIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: Theme.colors.primaryDark,
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Theme.colors.textMedium,
    textAlign: "center",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    gap: 8,
    width: "100%",
  },
  successContainer: {
    backgroundColor: "#ECFDF5",
  },
  errorText: {
    color: Theme.colors.error,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  successText: {
    color: Theme.colors.success,
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: Theme.colors.inputBg,
    marginBottom: 14,
  },
  inputActive: {
    borderWidth: 1,
    borderColor: Theme.colors.primaryLight,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    color: Theme.colors.primaryDark,
    fontSize: 15,
  },
  eyeIcon: {
    padding: 4,
  },
  resetButton: {
    backgroundColor: Theme.colors.primary,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  footerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  footerText: {
    color: Theme.colors.textMedium,
    fontSize: 14,
  },
  loginLinkText: {
    color: Theme.colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
