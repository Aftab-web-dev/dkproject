import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Keyboard, Platform, BackHandler } from 'react-native'
import React, { useState, useEffect } from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsivefontsize } from "@/constants/responsivefontsize";
import ReusableButton from '@/components/ReusableButton';
import colors from '@/components/colors';
import GradientBG from '@/constants/gradientbg';
import { DXLogo512 } from '@/assets/images';
import Inputfield from '@/components/Inputfield';
import axios from 'axios';
import { API_ENDPOINTS } from '@/constants/Baseurl';
import * as SecureStore from "expo-secure-store";
import { useRouter } from 'expo-router';

const Profilescreen = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other' | null>(null);
  const [emailError, setEmailError] = useState('');
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [genderError, setGenderError] = useState('');
  const [shouldVibrate, setShouldVibrate] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Prevent back navigation
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      // Return true to prevent default back behavior
      return true;
    });

    return () => backHandler.remove();
  }, []);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
  };
  
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Get token securely
      const token = await SecureStore.getItemAsync("authToken");

      if (!token) {
        Alert.alert("Error", "Authentication token not found. Please login again.");
        return;
      }

      // Make API call
      const response = await axios.put(
        API_ENDPOINTS.Profile.update_profile(),
        {
          name: `${firstName} ${lastName}`,
          email: email,
          gender: gender,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile updated:", response.data);

      // Navigate to home or next screen
      // router.push('/(tabs)/home'); // Uncomment and adjust path as needed

    } catch (error: any) {
      console.error("Error updating profile:", error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || "Failed to update profile. Please try again.";
      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleFirstNameChange = (text: string) => {
    // Only allow alphabetic characters (letters and spaces)
    const alphabeticOnly = text.replace(/[^a-zA-Z\s]/g, '');
    setFirstName(alphabeticOnly);
    if (firstNameError) setFirstNameError('');
  };

  const handleLastNameChange = (text: string) => {
    // Only allow alphabetic characters (letters and spaces)
    const alphabeticOnly = text.replace(/[^a-zA-Z\s]/g, '');
    setLastName(alphabeticOnly);
    if (lastNameError) setLastNameError('');
  };

  const handleGenderChange = (selectedGender: 'Male' | 'Female' | 'Other') => {
    setGender(selectedGender);
    if (genderError) setGenderError('');
  };

  const isFormValid = () => {
    return firstName.trim() !== '' &&
           lastName.trim() !== '' &&
           email.trim() !== '' &&
           validateEmail(email) &&
           gender !== null;
  };

  const handleNext = async () => {
    // Dismiss keyboard immediately
    Keyboard.dismiss();

    // Clear previous errors
    setFirstNameError('');
    setLastNameError('');
    setGenderError('');
    setEmailError('');

    let hasError = false;

    // Validate first name
    if (firstName.trim() === '') {
      setFirstNameError('First Name is required');
      hasError = true;
    }

    // Validate last name
    if (lastName.trim() === '') {
      setLastNameError('Last Name is required');
      hasError = true;
    }

    // Validate gender
    if (gender === null) {
      setGenderError('Gender selection is required');
      hasError = true;
    }

    // Validate email
    if (email.trim() === '') {
      setEmailError('Email is required');
      hasError = true;
    } else if (!validateEmail(email)) {
      setEmailError('Invalid Email');
      hasError = true;
    }

    if (hasError) {
      setShouldVibrate(true);
      setTimeout(() => setShouldVibrate(false), 200);
    } else {
      // Submit profile
      await handleSubmit();
    }
  };

  return (
    <GradientBG >
      {isSubmitting ? (
        <View style={styles.fullScreenLoader}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Updating profile...</Text>
        </View>
      ) : (
        <>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <Image
                source={DXLogo512}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            {/* Name Label and Fields */}
            <View style={[styles.nameContainer, (firstNameError || lastNameError) && styles.nameContainerWithError]}>
            <Text style={styles.label}>Name:</Text>
              <View style={styles.nameInputWrapper}>
                <Inputfield
                  placeholder="First Name"
                  value={firstName}
                  onChangeText={handleFirstNameChange}
                />
              </View>
              <View style={styles.nameInputWrapper}>
                <Inputfield
                  placeholder="Last Name"
                  value={lastName}
                  onChangeText={handleLastNameChange}
                  />
              </View>
            </View>
            {(firstNameError || lastNameError) ? (
              <Text style={styles.nameErrorText}>
                {firstNameError || lastNameError}
              </Text>
            ) : null}
   

            {/* Gender Selection */}
            <View style={[styles.genderContainer, genderError && styles.genderContainerWithError]}>
            <Text style={styles.label}>Gender:</Text>
              <TouchableOpacity
                style={[styles.genderButton, gender === 'Male' && styles.genderButtonSelected]}
                onPress={() => handleGenderChange('Male')}
              >
                <Text style={[styles.genderText, gender === 'Male' && styles.genderTextSelected]}>
                  Male
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderButton, gender === 'Female' && styles.genderButtonSelected]}
                onPress={() => handleGenderChange('Female')}
              >
                <Text style={[styles.genderText, gender === 'Female' && styles.genderTextSelected]}>
                  Female
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.genderButton, gender === 'Other' && styles.genderButtonSelected]}
                onPress={() => handleGenderChange('Other')}
              >
                <Text style={[styles.genderText, gender === 'Other' && styles.genderTextSelected]}>
                  Other
                </Text>
              </TouchableOpacity>
            </View>
            {genderError ? <Text style={styles.genderErrorText}>{genderError}</Text> : null}

            {/* Email Field */}
            <View style={[styles.emailContainer, emailError && styles.emailContainerWithError]}>
            <Text style={styles.label}>Email Id:</Text>
            <Inputfield
              placeholder="Enter Your Email Id"
              value={email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
            />
            </View>
            {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          </ScrollView>

          {/* Next Button - Fixed at bottom */}
          <View style={styles.buttonContainer}>
            <ReusableButton
              text="Next"
              action={handleNext}
              shouldVibrate={shouldVibrate}
            />
          </View>
        </>
      )}
    </GradientBG>
  )
}


export default Profilescreen

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: wp("5%"),
    paddingTop: hp("3%"),
    paddingBottom: wp("5%"),
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: hp("6%"),
    marginTop: hp("2%"),
  },
   logo: {
    width: wp("25%"),
    height: hp("10%"),
  },
  label: {
    fontSize: responsivefontsize(15),
    fontWeight: '400',
    color: 'black',
    width: wp("18%"),
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: wp("8%"),
    alignItems:"center",
    gap: wp("2%"),
  },
  nameContainerWithError: {
    marginBottom: wp("3%"),
  },
  nameInputWrapper: {
    flex: 1,
  },
  emailContainer:{
    flexDirection: 'row',
    alignItems:"center",
    gap: wp("2%"),
    marginBottom: wp("8%"),
  },
  emailContainerWithError: {
    marginBottom: wp("3%"),
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: wp("2%"),
    marginBottom: wp("8%"),
  },
  genderContainerWithError: {
    marginBottom: wp("3%"),
  },
  genderButton: {
   paddingHorizontal: Platform.OS === "ios" ? wp("5.5%") :  wp("5.6%"),
    paddingVertical: wp("2%"),
    backgroundColor: '#FFFFFF',
    borderRadius: wp("2.5%"),
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
  },
  genderButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: 'black',
    borderWidth: 1,
  },
  genderText: {
    fontSize: responsivefontsize(15),
    color: 'black',
    fontWeight: '400',
  },
  genderTextSelected: {
    color: '#000000',
    fontWeight: '400',
  },
  errorText: {
    color: '#EF4444',
    fontSize: responsivefontsize(12),
    marginTop: wp("1%"),
    marginBottom: wp("4%"),
    marginLeft: wp("20%"),
  },
  nameErrorText: {
    color: '#EF4444',
    fontSize: responsivefontsize(12),
    marginTop: wp("1%"),
    marginBottom: wp("4%"),
    marginLeft: wp("20%"),
  },
  genderErrorText: {
    color: '#EF4444',
    fontSize: responsivefontsize(12),
    marginTop: wp("1%"),
    marginBottom: wp("4%"),
    marginLeft: wp("20%"),
  },
  buttonContainer: {
    paddingHorizontal: wp("5%"),
    paddingBottom: wp("5%"),
    backgroundColor: '#FEF3C7',
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: wp("4%"),
    fontSize: responsivefontsize(16),
    color: '#000',
    fontWeight: '600',
  },
})