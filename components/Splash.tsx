import { View, Text, Image, StyleSheet } from "react-native";
import GradientBG from "../constants/gradientbg";
import { DXLogo192, India } from "@/assets/images";
import { RobotoBoldText } from "./StyledText";

export default function Splash() {

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
      <View style={styles.footer}>
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
    marginBottom: 40, 
  },
  footerText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "800", 
    marginRight: 4, 
  },
  indiaFlag: {
    width: 40, 
    height: 40, 
  },
});
