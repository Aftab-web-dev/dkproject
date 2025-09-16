import { DXLogo512 } from "@/assets/images";
import LoginContainer from "@/components/LoginContainer";
import CustomBottomSheet from "@/constants/Custombottomsheet";
import GradientBG from "@/constants/gradientbg";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useMemo, useRef } from "react";
import { Image, StyleSheet, View, Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
const Loginscreen = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => {
    if (Platform.OS === 'android') {
      return [hp("45%"), "82%"];
    }
    return [hp("45%"), hp("78%")];
  }, []);

  const handleSheetChange = (index: number) => {
    console.log("Sheet changed to index:", index);
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      <GradientBG>
        {/* Main logo section */}
        <View style={styles.logoContainer}>
          <Image
            source={DXLogo512}
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
      </GradientBG>
    </GestureHandlerRootView>
  );
};

export default Loginscreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: wp("150%"),
    height: hp("100%"),
  },
});
