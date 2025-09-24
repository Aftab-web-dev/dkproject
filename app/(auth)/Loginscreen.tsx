import { DXLogo1024 } from "@/assets/images";
import LoginContainer from "@/components/LoginContainer";
import CustomBottomSheet from "@/constants/Custombottomsheet";
import GradientBG from "@/constants/gradientbg";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { Image, StyleSheet, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const Loginscreen = () => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
   const snapPoints = useMemo(() => {
    const base1 = Platform.OS === "android" ? 0.6 : 0.45; // 60% or 45%
    const base2 = Platform.OS === "android" ? 0.75 : 0.78; // 75% or 78%
    // Return percentages; the sheet component should add safe-area by padding/margin
    // If CustomBottomSheet expects numbers/strings, keep strings:
    return [`${base1 * 100}%`, `${base2 * 100}%`];
  }, []);

  const handleSheetChange = (index: number) => {
    console.log("Sheet changed to index:", index);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <GradientBG>
        <View style={[
            styles.safeContent,
            { paddingTop: insets.top, paddingBottom: insets.bottom }
          ]}>
        {/* Main logo section */}
        <View style={styles.logoContainer}>
          <Image
            source={DXLogo1024}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        {/* Custom Bottom Sheet with Login Form */}
        <CustomBottomSheet
          snapPoints={snapPoints}
          onChange={handleSheetChange}
          borderRadius={25}
          backgroundGradient={["#FFFFFF", "#FFF9E5", "#FFE8A3"]}
          bottomSheetRef={bottomSheetRef}
        >
          <LoginContainer />
        </CustomBottomSheet>
        </View>
      </GradientBG>
    </GestureHandlerRootView>
  );
};

export default Loginscreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeContent: { flex: 1 },
  logoContainer: {
    position: "absolute",
    top: hp("15%"),
    left: 0,
    right: 0,
    height: hp("35%"),
    justifyContent: "center",
    alignItems: "center",
  
  },
  logo: {
    width: wp("60%"),
    height: hp("25%"),
  },
});