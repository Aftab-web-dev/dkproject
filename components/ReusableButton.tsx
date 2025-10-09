import { Text , TouchableOpacity , StyleSheet, Animated } from 'react-native'
import React, { useRef, useEffect } from 'react'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { responsivefontsize } from "@/constants/responsivefontsize";
type Props = {
    text: string,
    action: () => void,
    disabled?: boolean,
    shouldVibrate?: boolean
}
const ReusableButton = ({text , action, disabled = false, shouldVibrate = true}: Props) => {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (shouldVibrate) {
      Animated.sequence([
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: -10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 10, duration: 50, useNativeDriver: true }),
        Animated.timing(shakeAnimation, { toValue: 0, duration: 50, useNativeDriver: true })
      ]).start();
    }
  }, [shouldVibrate]);

  return (
    <Animated.View style={{ transform: [{ translateX: shakeAnimation }] }}>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={action}
        disabled={disabled}
        style={[styles.button, styles.buttonEnabled]}
      >
        <Text style={[styles.buttonText , styles.buttonTextEnabled]}>
          {text}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  )
}



export default ReusableButton

const styles = StyleSheet.create({
    button: {
       width: wp("90%"),
       paddingVertical: wp("3.5%"),
       borderRadius: wp("3%"),
       alignItems: "center",
       shadowOffset: { width: 0, height: 2 },
       shadowOpacity: 0.2,
       shadowRadius: 4,
       elevation: 3,
       marginBottom: wp("13%"),
     },
     buttonEnabled: {
       backgroundColor: "#FACC15", // yellow-400
       shadowColor: "#FDE68A", // yellow-200
     },
     buttonText: {
       fontSize: responsivefontsize(18),
       fontWeight: "600",
      color: "black", 
     },
     buttonTextEnabled: {
       color: "#1F2937", // gray-800
     },
     buttonTextDisabled: {
       color: "#6B7280", // gray-500
     },
})