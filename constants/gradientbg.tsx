import React, { ReactNode } from "react";
import { LinearGradient } from "expo-linear-gradient";
interface GradientBGProps {
  children?: ReactNode;
}

const GradientBG = ({ children }: GradientBGProps) => {
  return (
    <LinearGradient
      colors={["#FFFFFF", "#FFF9E5", "#FFE8A3"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBG;
