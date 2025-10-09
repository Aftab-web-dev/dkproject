import { StyleSheet, TextInput, View, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsivefontsize } from "@/constants/responsivefontsize";

type Props = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: 'default' | 'email-address';
  shouldShake?: boolean;
}

const Inputfield = ({ placeholder, value, onChangeText, keyboardType = 'default', shouldShake = false }: Props) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shouldShake) {
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }
  }, [shouldShake]);

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX: shakeAnimation }] }]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        textAlign="left"
      />
    </Animated.View>
  )
}

export default Inputfield

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp("2.5%"),
    paddingHorizontal: wp("3%"),
    paddingVertical: wp("2%"),
    fontSize: responsivefontsize(15),
    fontWeight: '400',
    color: '#000000',
    borderWidth: 1,
    borderColor: "black",
  },
})