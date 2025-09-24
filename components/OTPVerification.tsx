import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Platform,
  Image
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RobotoBoldText } from "./StyledText";
import { Ionicons } from '@expo/vector-icons';
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/Baseurl";
import { responsivefontsize } from "@/constants/responsivefontsize";
import { whatsappicon } from "@/assets/icons";
interface OTPVerificationProps {
  phoneNumber: string;
  onVerifyOTP?: (otp: string) => void;
  onGoBack?: () => void;
  onResendOTP?: () => void;
}
interface OTPVerificationParams {
  phoneNumber: string;
  otp: string;
}
const OTPVerification: React.FC<OTPVerificationProps> = ({
  phoneNumber,
  onVerifyOTP,
  onGoBack,
  onResendOTP
}) => {
  const insets = useSafeAreaInsets();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<any>>([]);

  // Auto-focus first input when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Timer for resend OTP
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  async function OTPVerification({ phoneNumber, otp }: OTPVerificationParams) {
    try {
      const response = await axios.post(
        API_ENDPOINTS.Authentication.verify_otp(),
        {
          phone: phoneNumber,
          otp: otp,
        }
      );

      console.log("OTP verification response:", response.data);
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error("API Error:", error.response?.data || error.message);
      } else {
        console.error("Unexpected Error:", error);
      }
      throw error;
    }
  }

  // Handle OTP input change
  const handleOTPChange = (value: string, index: number) => {
    // Handle full OTP paste (SMS autocomplete)
    if (value.length > 1 && index === 0) {
      const digits = value.replace(/\D/g, '').slice(0, 4).split('');
      const newOtp = ['', '', '', ''];
      digits.forEach((digit, i) => {
        if (i < 4) newOtp[i] = digit;
      });
      setOtp(newOtp);

      // Focus last filled input or first empty input
      const lastFilledIndex = digits.length - 1;
      if (lastFilledIndex < 3) {
        inputRefs.current[lastFilledIndex + 1]?.focus();
      } else {
        Keyboard.dismiss();
        // Auto-submit if all 4 digits are filled
        if (digits.length === 4) {
          const otpString = newOtp.join("");
          OTPVerification({ phoneNumber, otp: otpString })
            .then((res) => {
              console.log("OTP verified successfully:", res);
              onVerifyOTP?.(otpString);
            })
            .catch((err) => {
              console.error("OTP verification failed:", err);
            });
        }
      }
      return;
    }

    if (!/^\d*$/.test(value)) return; // only digits allowed

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-move to next input
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits filled
    if (newOtp.every((digit) => digit !== "")) {
      Keyboard.dismiss();
      const otpString = newOtp.join("");
      OTPVerification({ phoneNumber, otp: otpString })
        .then((res) => {
          console.log("OTP verified successfully:", res);
          onVerifyOTP?.(otpString);
        })
        .catch((err) => {
          console.error("OTP verification failed:", err);
        });
    }
  };


  // Handle backspace
  const handleKeyPress = (event: any, index: number) => {
    if (event.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle resend OTP
  const handleResendOTP = () => {
    if (canResend) {
      setResendTimer(15);
      setCanResend(false);
      setOtp(['', '', '', '']);
      onResendOTP?.();
      inputRefs.current[0]?.focus();
    }
  };

  // Format phone number for display
  const formatPhoneNumber = (phone: string) => {
    return phone.startsWith("+91") ? phone : `+91 ${phone}`;
  };


  return (
    <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 16) }]}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Verify OTP sent to</Text>
          <Text style={styles.phoneNumber}>{formatPhoneNumber(phoneNumber)}</Text>
        </View>
      </View>

      {/* OTP Input Section */}
      <View style={styles.otpSection}>
        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <BottomSheetTextInput
              key={index}
              ref={(ref) => { inputRefs.current[index] = ref; }}
              style={[
                styles.otpInput,
                digit ? styles.otpInputFilled : styles.otpInputEmpty
              ]}
              value={digit}
              onChangeText={(value) => handleOTPChange(value, index)}
              onKeyPress={(event) => handleKeyPress(event, index)}
              keyboardType="numeric"
              maxLength={1}
              textAlign="center"
              selectTextOnFocus
              autoFocus={index === 0}
              textContentType={index === 0 ? "oneTimeCode" : "none"}
              autoComplete={index === 0 ? "sms-otp" : "off"}
            />
          ))}
        </View>
      </View>

      {/* Resend OTP Section */}
      <View style={styles.resendSection}>
        <TouchableOpacity
          onPress={handleResendOTP}
          disabled={!canResend}
          activeOpacity={0.7}
        >
          <RobotoBoldText style={[
            styles.resendText,
            canResend ? styles.resendTextEnabled : styles.resendTextDisabled
          ]}>
            Resend OTP in {canResend ? '' : `${resendTimer}s`}
          </RobotoBoldText>
        </TouchableOpacity>
      </View>

      {/* Help Section */}
      <View style={styles.helpSection}>
        <TouchableOpacity style={styles.helpButton} activeOpacity={0.7}>
          <Text style={styles.helpText}>Help</Text>
          <View style={styles.whatsappIcon}>
            {/* <Ionicons name="logo-whatsapp" size={24} color="black" /> */}
            <Image source={whatsappicon} style={styles.whatsappEmoji} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OTPVerification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    paddingTop: 24,
    paddingBottom: hp("3%"),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: hp('2%'),
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: responsivefontsize(18),
    color: '#000',
    fontWeight: '500',
  },
  phoneNumber: {
    fontSize: responsivefontsize(14),
    color: '#000',
    fontWeight: '600',
    marginTop: 4,
  },
  otpSection: {
    alignItems: 'center',
    marginTop: hp('4%'),
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('60%'),
    marginBottom: hp('3%'),
  },
  otpInput: {
    width: wp('12%'),
    height: wp('12%'),
    borderRadius: 8,
    fontSize: responsivefontsize(20),
    fontWeight: 'bold',
    color: '#000',
  },
  otpInputEmpty: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  otpInputFilled: {
    backgroundColor: '#000',
    color: '#fff',
    borderWidth: 2,
    borderColor: '#000',
  },
  autoVerifyText: {
    fontSize: responsivefontsize(14),
    color: '#6B7280',
    textAlign: 'center',
  },
  resendSection: {
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  resendText: {
    fontSize: responsivefontsize(14),
    fontWeight: '600',
  },
  resendTextEnabled: {
    color: '#3B82F6',
  },
  resendTextDisabled: {
    color: '#6B7280',
  },
  helpSection: {
    alignItems: 'flex-end',
    marginTop: hp('1%'),
    marginBottom: hp('1.5%'),
  },
  helpButton: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: responsivefontsize(10),
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  whatsappIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',

  },
  whatsappEmoji: {
    width: 24,
    height: 24, 
  },
});