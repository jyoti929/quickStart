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

export default function Signup() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Form states
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Visibilities
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Errors and focus states
  const [error, setError] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);

  const handleSignup = () => {
    setError("");

    // Form Validations
    if (!name.trim() || !mobile.trim() || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (mobile.trim().length < 10) {
      setError("Please enter a valid mobile number.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Save signup details in authStore temporarily
    authStore.setTempSignup({
      name: name.trim(),
      mobile: mobile.trim(),
      password: password,
    });

    // Route to OTP verification page
    router.push({
      pathname: "/otp" as any,
      params: { mobile: mobile.trim() },
    });
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
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/")} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Theme.colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Brand Lotus Logo Header */}
        <View style={styles.brandHeader}>
          <Ionicons name="bag-handle" size={50} color={Theme.colors.textDark} style={styles.logoIcon} />
          <Text style={styles.subtitle}>Signup</Text>
        </View>

        {/* Error message */}
        {error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={18} color={Theme.colors.error} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Form Fields */}
        <View style={styles.form}>
          
          {/* Name Field */}
          <View
            style={[
              styles.inputContainer,
              activeField === "name" && styles.inputActive,
            ]}
          >
            <Ionicons name="person" size={18} color={Theme.colors.textMedium} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full name"
              placeholderTextColor={Theme.colors.textLight}
              value={name}
              onChangeText={setName}
              onFocus={() => setActiveField("name")}
              onBlur={() => setActiveField(null)}
            />
          </View>

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
              placeholder="Mobile number"
              placeholderTextColor={Theme.colors.textLight}
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
              onFocus={() => setActiveField("mobile")}
              onBlur={() => setActiveField(null)}
              maxLength={15}
            />
          </View>

          {/* Password Field */}
          <View
            style={[
              styles.inputContainer,
              activeField === "password" && styles.inputActive,
            ]}
          >
            <Ionicons name="lock-closed" size={18} color={Theme.colors.textMedium} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={Theme.colors.textLight}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setActiveField("password")}
              onBlur={() => setActiveField(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={18} color={Theme.colors.textMedium} />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Field */}
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

          {/* Sign Up Button */}
          <TouchableOpacity style={styles.signupButton} onPress={handleSignup} activeOpacity={0.9}>
            <Text style={styles.signupButtonText}>Sign up</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Icons matching screenshot */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialIconBtn} activeOpacity={0.7}>
              <Ionicons name="logo-facebook" size={26} color={Theme.colors.primaryDark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconBtn} activeOpacity={0.7}>
              <Ionicons name="logo-apple" size={26} color={Theme.colors.primaryDark} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialIconBtn} activeOpacity={0.7}>
              <Ionicons name="logo-google" size={26} color={Theme.colors.primaryDark} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign In Link */}
        <View style={styles.footerLinkContainer}>
          <Text style={styles.footerText}>Already have an account? </Text>
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
  logoIcon: {
     marginBottom: 10,
     alignSelf: "center",
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
    fontSize: 20,
    fontWeight:"800",
    color: Theme.colors.textMedium,
    textAlign: "left",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    borderRadius: 16,
    padding: 12,
    marginBottom: 20,
    gap: 8,
  },
  errorText: {
    color: Theme.colors.error,
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
  signupButton: {
    backgroundColor: Theme.colors.primary,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  signupButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E6E2",
  },
  dividerText: {
    color: Theme.colors.textMedium,
    fontSize: 13,
    paddingHorizontal: 16,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    marginBottom: 12,
  },
  socialIconBtn: {
    padding: 8,
  },
  footerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
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
