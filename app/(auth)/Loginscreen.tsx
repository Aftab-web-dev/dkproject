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
    if (Platform.OS === "android") {
      // Android needs 3 snap points: normal, keyboard shown, keyboard with content visible
      return ["55%", "60%", "82%"];
    } else {
      // iOS works well with 2 snap points
      return ["45%", "70%"];
    }
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
            keyboardBehavior='interactive'
            keyboardBlurBehavior='restore'
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
    width: wp("160%"),
    height: hp("70%"),
  },
});