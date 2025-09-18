import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
  Platform
} from "react-native";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { RobotoBoldText } from "./StyledText";
import { Ionicons } from '@expo/vector-icons'; 
import axios from "axios";
import { API_ENDPOINTS } from "@/constants/Baseurl";
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

  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(15);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<Array<any>>([]);

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
    <View style={styles.container}>
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
            />
          ))}
        </View>

        {/* Auto verification text */}
        <Text style={styles.autoVerifyText}>
          1234 (Auto from msg and Auto Verify)
        </Text>
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
            <Ionicons name="logo-whatsapp" size={24} color="black" />
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
    fontSize: 18,
    color: '#000',
    fontWeight: '500',
  },
  phoneNumber: {
    fontSize: 16,
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
    fontSize: 24,
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
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  resendSection: {
    alignItems: 'center',
    marginTop: hp('3%'),
  },
  resendText: {
    fontSize: 16,
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
  },
  helpButton: {
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    color: '#000',
    marginBottom: 8,
    fontWeight: '500',
  },
  whatsappIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#25D366',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  whatsappEmoji: {
    fontSize: 24,
    color: '#fff',
  },
});