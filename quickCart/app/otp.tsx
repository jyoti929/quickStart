import React, { useState, useRef, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Theme } from "../constants/theme";
import { authStore } from "../services/authStore";

export default function Otp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mobile } = useLocalSearchParams<{ mobile?: string }>();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [timer, setTimer] = useState(30);

  // Refs for each input box
  const inputRefs = useRef<Array<TextInput | null>>([]);

  // Auto-focus first field
  useEffect(() => {
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  }, []);

  // Timer countdown hook
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleChangeText = (text: string, index: number) => {
    const cleanedText = text.replace(/[^0-9]/g, "");
    if (!cleanedText) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    const newOtp = [...otp];
    const digit = cleanedText.charAt(cleanedText.length - 1);
    newOtp[index] = digit;
    setOtp(newOtp);

    // Auto focus next input
    if (index < 5 && digit !== "") {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace") {
      if (otp[index] === "" && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = "";
        setOtp(newOtp);
        inputRefs.current[index - 1]?.focus();
      } else {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      }
    }
  };

  const handleVerify = () => {
    setError("");
    setSuccess("");
    
    const enteredOtp = otp.join("");
    
    if (enteredOtp.length < 6) {
      setError("Please fill all 6 digits.");
      return;
    }

    if (enteredOtp === "123456") {
      const registered = authStore.registerUser();
      if (registered) {
        setSuccess("Mobile number verified successfully!");
        setOtp(["", "", "", "", "", ""]);
        
        setTimeout(() => {
          router.replace("/login" as any);
        }, 1500);
      } else {
        setError("Error finalizing registration. Try signing up again.");
      }
    } else {
      setError("Invalid OTP. Try again using: 123456");
    }
  };

  const handleResend = () => {
    setError("");
    setSuccess("A new OTP has been sent (Default is 123456).");
    setTimer(30);
  };

  const formatMobileNumber = (num?: string) => {
    if (!num) return "";
    if (num.length <= 4) return num;
    return `+91 ${num.slice(0, 5)} ${num.slice(5)}`;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Theme.colors.background} />
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        
        {/* Navigation Bar */}
        <View style={styles.navHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/signup" as any)} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={22} color={Theme.colors.primaryDark} />
          </TouchableOpacity>
        </View>

        {/* Brand Header */}
        <View style={styles.brandHeader}>
          <Ionicons name="flower" size={48} color={Theme.colors.primaryDark} style={styles.lotusIcon} />
          <Text style={styles.title}>Verification Code</Text>
          <Text style={styles.subtitle}>
            Enter the code sent to {" "}
            <Text style={styles.boldText}>{formatMobileNumber(mobile)}</Text>
          </Text>
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

        {/* OTP Input Fields */}
        <View style={styles.form}>
          <View style={styles.otpRow}>
            {otp.map((digit, idx) => (
              <TextInput
                key={idx}
                ref={(ref) => { inputRefs.current[idx] = ref; }}
                style={[
                  styles.otpInput,
                  digit !== "" && styles.otpInputFilled,
                  error !== "" && styles.otpInputError,
                ]}
                maxLength={1}
                keyboardType="number-pad"
                value={digit}
                onChangeText={(text) => handleChangeText(text, idx)}
                onKeyPress={(e) => handleKeyPress(e, idx)}
                selectTextOnFocus
              />
            ))}
          </View>

          <Text style={styles.hintText}>Use default OTP code: 123456</Text>

          {/* Verify Button */}
          <TouchableOpacity style={styles.verifyButton} onPress={handleVerify} activeOpacity={0.9}>
            <Text style={styles.verifyButtonText}>Verify OTP</Text>
          </TouchableOpacity>
        </View>

        {/* Timer countdown */}
        <View style={styles.resendContainer}>
          {timer > 0 ? (
            <Text style={styles.resendTimerText}>Resend code in <Text style={styles.boldTimer}>{timer}s</Text></Text>
          ) : (
            <View style={styles.resendActiveRow}>
              <Text style={styles.resendText}>{"Didn't receive the OTP? "}</Text>
              <TouchableOpacity onPress={handleResend}>
                <Text style={styles.resendLinkText}>Resend Code</Text>
              </TouchableOpacity>
            </View>
          )}
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
  boldText: {
    fontWeight: "700",
    color: Theme.colors.primaryDark,
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
    alignItems: "center",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: 16,
    backgroundColor: Theme.colors.inputBg,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "700",
    color: Theme.colors.primaryDark,
  },
  otpInputFilled: {
    borderWidth: 1,
    borderColor: Theme.colors.primaryLight,
  },
  otpInputError: {
    borderWidth: 1,
    borderColor: Theme.colors.error,
  },
  hintText: {
    fontSize: 13,
    color: Theme.colors.textMedium,
    marginBottom: 24,
    fontStyle: "italic",
  },
  verifyButton: {
    backgroundColor: Theme.colors.primary,
    height: 52,
    width: "100%",
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  verifyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  resendContainer: {
    alignItems: "center",
    marginTop: 28,
  },
  resendTimerText: {
    color: Theme.colors.textMedium,
    fontSize: 13,
    fontWeight: "500",
  },
  boldTimer: {
    color: Theme.colors.primary,
    fontWeight: "700",
  },
  resendActiveRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resendText: {
    color: Theme.colors.textMedium,
    fontSize: 13,
  },
  resendLinkText: {
    color: Theme.colors.primary,
    fontSize: 13,
    fontWeight: "700",
  },
});
