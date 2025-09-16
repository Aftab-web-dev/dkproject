import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import LoginFormContent from './LoginFormContent'; // Your existing component
import OTPVerification from './OTPVerification'; // The new OTP component

const LoginContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'login' | 'otp'>('login');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSendOTP = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentStep('otp');
    
    // Here you would typically make an API call to send OTP
    console.log('Sending OTP to:', phone);
    // Example API call:
    // await sendOTPAPI(phone);
  };

  const handleVerifyOTP = (otp: string) => {
    console.log('Verifying OTP:', otp, 'for phone:', phoneNumber);
    
    // Here you would typically verify the OTP with your backend
    // Example API call:
    // const isValid = await verifyOTPAPI(phoneNumber, otp);
    // if (isValid) {
    //   // Navigate to next screen or complete login
    // } else {
    //   // Show error message
    // }
  };

  const handleGoBack = () => {
    setCurrentStep('login');
    // Optionally clear the phone number if you want user to re-enter
    // setPhoneNumber('');
  };

  const handleResendOTP = () => {
    console.log('Resending OTP to:', phoneNumber);
    // Here you would make another API call to resend OTP
    // await sendOTPAPI(phoneNumber);
  };

  const handleFormComplete = () => {
    // This is called when the form is complete (for any additional UI handling)
    console.log('Form is complete');
  };

  return (
    <View style={styles.container}>
      {currentStep === 'login' ? (
        <LoginFormContent 
          onSendOTP={handleSendOTP}
          onFormComplete={handleFormComplete}
        />
      ) : (
        <OTPVerification
          phoneNumber={phoneNumber}
          onVerifyOTP={handleVerifyOTP}
          onGoBack={handleGoBack}
          onResendOTP={handleResendOTP}
        />
      )}
    </View>
  );
};

export default LoginContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});