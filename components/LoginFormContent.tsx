import { DXLogo512 } from "@/assets/images";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Platform,
  TextInput,
  KeyboardAvoidingView,
  ScrollView
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RobotoBoldText } from "./StyledText";
import axios from 'axios'
import { API_ENDPOINTS } from "@/constants/Baseurl";
import { responsivefontsize } from "@/constants/responsivefontsize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
interface LoginFormContentProps {
  onSendOTP?: (phoneNumber: string) => void;
  onFormComplete?: () => void;
}

const LoginFormContent: React.FC<LoginFormContentProps> = ({ onSendOTP, onFormComplete }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const insets = useSafeAreaInsets();
  // Check if form is complete (10 digits + terms accepted)
  const isFormComplete = phoneNumber.length === 10 && acceptedTerms;

  useEffect(() => {
    if (isFormComplete) {
      // Dismiss keyboard and notify parent to reset bottom sheet position
      Keyboard.dismiss();
      onFormComplete?.();
    }
  }, [isFormComplete, onFormComplete]);

  async function login(phoneNumber: string) {
    try {
      const response = await axios.post(
        API_ENDPOINTS.Authentication.login(),
        {
          phone: phoneNumber, // ✅ now matches the argument
        }
      );

      console.log(response.data);
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        // handle server error message
        console.error("API Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
    }
  }

  
  const handleSendOTP = async () => {
  if (phoneNumber && acceptedTerms) {
    try {
      onSendOTP?.(phoneNumber);

      const response = await login(phoneNumber); 
      console.log("OTP sent successfully:", response);
    } catch (error) {
      console.error("Failed to send OTP:", error);
    }
  } else {
    console.warn("Phone number missing or terms not accepted");
  }
};


  if (Platform.OS === 'android') {
    return (
      <KeyboardAvoidingView
        behavior="padding"
        style={{ flex: 1 }}
        keyboardVerticalOffset={20}
      >
        <ScrollView
          contentContainerStyle={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Small logo at top of bottom sheet */}
          <View style={styles.logoWrapper}>
            <Image
              source={DXLogo512}
              resizeMode="contain"
              style={styles.logo}
            />
          </View>

          {/* Title */}
          <Text style={styles.title}>Get Report on Time</Text>

          {/* Phone input */}
          <View style={styles.inputWrapper}>
            <View style={styles.phoneInputContainer}>
              <RobotoBoldText style={styles.countryCode}>+91</RobotoBoldText>
              <BottomSheetTextInput
                style={styles.phoneInput}
                placeholder="Enter your mobile number"
                placeholderTextColor="#9CA3AF"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={10}
              />
            </View>
          </View>

          {/* Terms and conditions */}
          <View style={styles.termsWrapper}>
            <TouchableOpacity
              style={styles.termsRow}
              activeOpacity={0.8}
              onPress={() => setAcceptedTerms(!acceptedTerms)}
            >
              <View
                style={[
                  styles.checkbox,
                  acceptedTerms && styles.checkboxChecked,
                ]}
              >
                {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <RobotoBoldText style={styles.termsText}>
                I accept the{" "}
                <RobotoBoldText style={styles.linkText}>Terms of Service</RobotoBoldText> &{" "}
                <RobotoBoldText style={styles.linkText}>Privacy Policy</RobotoBoldText>.
              </RobotoBoldText>
            </TouchableOpacity>
          </View>

          {/* Send OTP Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.button,
              phoneNumber && acceptedTerms
                ? styles.buttonEnabled
                : styles.buttonDisabled,
            ]}
            onPress={handleSendOTP}
            disabled={!phoneNumber || !acceptedTerms}
          >
            <Text
              style={[
                styles.buttonText,
                phoneNumber && acceptedTerms
                  ? styles.buttonTextEnabled
                  : styles.buttonTextDisabled,
              ]}
            >
              Send OTP
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // iOS version (original)
  return (
    <View style={[styles.container , { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {/* Small logo at top of bottom sheet */}
      <View style={styles.logoWrapper}>
        <Image
          source={DXLogo512}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>

      {/* Title */}
      <Text style={styles.title}>Get Report on Time</Text>

      {/* Phone input */}
      <View style={styles.inputWrapper}>
        <View style={styles.phoneInputContainer}>
          <RobotoBoldText style={styles.countryCode}>+91</RobotoBoldText>
          <BottomSheetTextInput
            style={styles.phoneInput}
            placeholder="Enter your mobile number"
            placeholderTextColor="#9CA3AF"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>
      </View>

      {/* Terms and conditions */}
      <View style={styles.termsWrapper}>
        <TouchableOpacity
          style={styles.termsRow}
          activeOpacity={0.8}
          onPress={() => setAcceptedTerms(!acceptedTerms)}
        >
          <View
            style={[
              styles.checkbox,
              acceptedTerms && styles.checkboxChecked,
            ]}
          >
            {acceptedTerms && <Text style={styles.checkmark}>✓</Text>}
          </View>
          <RobotoBoldText style={styles.termsText}>
            I accept the{" "}
            <RobotoBoldText style={styles.linkText}>Terms of Service</RobotoBoldText> &{" "}
            <RobotoBoldText style={styles.linkText}>Privacy Policy</RobotoBoldText>.
          </RobotoBoldText>
        </TouchableOpacity>
      </View>

      {/* Send OTP Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={[
          styles.button,
          phoneNumber && acceptedTerms
            ? styles.buttonEnabled
            : styles.buttonDisabled,
        ]}
        onPress={handleSendOTP}
        disabled={!phoneNumber || !acceptedTerms}
      >
        <Text
          style={[
            styles.buttonText,
            phoneNumber && acceptedTerms
              ? styles.buttonTextEnabled
              : styles.buttonTextDisabled,
          ]}
        >
          Send OTP
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginFormContent;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
    justifyContent: "space-between",
  },
  logoWrapper: {
    marginBottom: wp("1%"),
  },
  logo: {
    width: wp("25%"),
    height: hp("10%"),
  },
  title: {
    fontSize: responsivefontsize(25),
    fontWeight: "bold",
    color: "#000",
    marginBottom: hp("1%"),
  },
  inputWrapper: {
    width: "100%",
    marginBottom: hp("3%"),
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#000",
    borderRadius: wp("3%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: Platform.OS === "ios" ? hp("1.5%") : hp("0.5%"),
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  countryCode: {
    color: "#000",
    marginRight: 12,
    fontWeight: "500",
    fontSize: responsivefontsize(18),
  },
  phoneInput: {
    flex: 1,
    color: "#000",
    fontSize: responsivefontsize(18),
    fontWeight: "500",
  },
  termsWrapper: {
    width: "100%",
    marginBottom: hp("3%"),
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 17,
    height: 17,
    borderWidth: 2,
    borderColor: "#D1D5DB", // gray-300
    borderRadius: 4,
    marginRight: 12,
    marginTop: 2,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  checkboxChecked: {
    backgroundColor: "#000", // blue-500
    borderColor: "#000",
  },
  checkmark: {
    color: "#fff",
    fontSize:responsivefontsize(9),
    fontWeight: "bold",
  },
  termsText: {
    fontSize: responsivefontsize(15),
    color: "#000", // gray-600
    lineHeight: 20,
    flex: 1,
  },
  linkText: {
    color: "#3B82F6",
    fontWeight: "800",
    fontSize: responsivefontsize(15),
    fontStyle: "italic",
    textDecorationLine: "underline",
  },
  button: {
    width: wp("90%"),
    paddingVertical: wp("4%"),
    borderRadius: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: wp("6%"),
  },
  buttonEnabled: {
    backgroundColor: "#FACC15", // yellow-400
    shadowColor: "#FDE68A", // yellow-200
  },
  buttonDisabled: {
    backgroundColor: "#D1D5DB", // gray-300
    shadowColor: "#E5E7EB", // gray-200
  },
  buttonText: {
    fontSize: responsivefontsize(18),
    fontWeight: "600",
  },
  buttonTextEnabled: {
    color: "#1F2937", // gray-800
  },
  buttonTextDisabled: {
    color: "#6B7280", // gray-500
  },
});