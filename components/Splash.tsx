import { View, Text, Image, StyleSheet, Platform } from "react-native";
import { useState, useEffect } from "react";
import GradientBG from "../constants/gradientbg";
import { DXLogo192, India } from "@/assets/images";
import { RobotoBoldText } from "./StyledText";
import * as NavigationBar from "expo-navigation-bar";
import { responsivefontsize } from "@/constants/responsivefontsize";
export default function Splash() {
  const [hasNavigationBar, setHasNavigationBar] = useState(true);

  useEffect(() => {
    const checkNavigationBar = async () => {
      if (Platform.OS === "android") {
        try {
          const visibility = await NavigationBar.getVisibilityAsync();
          setHasNavigationBar(visibility === "visible");
        } catch (error) {
          setHasNavigationBar(true);
        }
      }
    };

    checkNavigationBar();
  }, []);

  return (
    <GradientBG>
      {/* Logo slightly above center */}
      <View style={styles.logoContainer}>
        <Image
          source={DXLogo192}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Bottom "Made in India" */}
      <View  style={[
        styles.footer,
        { marginBottom: hasNavigationBar ? 60 : 40 },
      ]}>
        <RobotoBoldText style={styles.footerText}>Made in</RobotoBoldText>
        <Image source={India} style={styles.indiaFlag} resizeMode="contain" />
      </View>
    </GradientBG>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -48, 
  },
  logo: {
    width: 160, 
    height: 160, 
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#000",
    fontSize: responsivefontsize(15),
    fontWeight: "800", 
    marginRight: 4, 
  },
  indiaFlag: {
    width: 40, 
    height: 40, 
  },
});
