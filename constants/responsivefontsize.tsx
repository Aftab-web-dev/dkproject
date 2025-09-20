import { Dimensions, PixelRatio } from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Base scale (you can adjust based on your design width, e.g. iPhone 14 = 390)
const scale = SCREEN_WIDTH / 390;

export function responsivefontsize(size:number) {
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
}
