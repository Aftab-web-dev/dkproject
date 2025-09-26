import React, { useRef, useCallback, useEffect } from "react";
import { View, Keyboard, Platform, Dimensions } from "react-native";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, { BottomSheetView, BottomSheetBackgroundProps, BottomSheetModal } from '@gorhom/bottom-sheet';
import { LinearGradient } from "expo-linear-gradient";

export interface CustomBottomSheetProps {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  initialIndex?: number;
  onChange?: (index: number) => void;
  enablePanDownToClose?: boolean;
  backgroundGradient?: string[];
  borderRadius?: number;
  keyboardBehavior?: "extend" | "fillParent" | "interactive";
  keyboardBlurBehavior?: "none" | "restore";
  enableKeyboardHandling?: boolean;
  bottomSheetRef?: React.RefObject<BottomSheetModal | null>;

}

const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  children,
  snapPoints = [],
  onChange,
  enablePanDownToClose = false,
  backgroundGradient = ["#FFFFFF", "#FFF9E5", "#FFE8A3"],
  borderRadius = 25,
  keyboardBehavior = "extend",
  keyboardBlurBehavior = "restore",
  enableKeyboardHandling = true,
  bottomSheetRef: externalRef
}) => {
  const internalRef = useRef<BottomSheetModal>(null);
  const bottomSheetRef = externalRef || internalRef;

  useEffect(() => {
    if (Platform.OS === 'android') {
      const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (event) => {
        // On Android, ensure we're at the highest snap point when keyboard shows
        const keyboardHeight = event.endCoordinates.height;
        const screenHeight = Dimensions.get('window').height;

        // More aggressive keyboard handling - if keyboard is visible, use highest snap point
        if (keyboardHeight > screenHeight * 0.2) {
          // Use the highest available snap point index
          const maxIndex = snapPoints.length - 1;
          bottomSheetRef.current?.snapToIndex(maxIndex);
        }
      });

      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        // Android: return to index 0 when keyboard hides
        setTimeout(() => {
          bottomSheetRef.current?.snapToIndex(0);
        }, 100);
      });

      return () => {
        keyboardDidHideListener?.remove();
        keyboardDidShowListener?.remove();
      };
    } else {
      // iOS: Only handle keyboard hide to return to index 0
      const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
        bottomSheetRef.current?.snapToIndex(0);
      });

      return () => {
        keyboardDidHideListener?.remove();
      };
    }
  }, [snapPoints]);
  
  const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({ style }) => (
    <LinearGradient
      colors={["#FFFFFF", "#FFF9E5", "#FFE8A3"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={[
        style,
        {
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }
      ]}
    />
  );
  
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      Keyboard.dismiss();
    }
    onChange?.(index);
  }, [onChange]);
  
  return (
    <BottomSheet
      ref={bottomSheetRef ?? internalRef}
      onChange={handleSheetChanges}
      keyboardBehavior="extend"
      keyboardBlurBehavior="restore"
      handleComponent={null}
      enablePanDownToClose={false}
      index={0}
      snapPoints={snapPoints}
      backgroundComponent={CustomBackground}
      enableHandlePanningGesture={true}
      enableContentPanningGesture={false}
      animateOnMount={true}
      style={{
        borderTopLeftRadius: borderRadius,
        borderTopRightRadius: borderRadius,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
      }}
    >
      <BottomSheetView
        style={{
          flex: 1,
          borderTopLeftRadius: borderRadius,
          borderTopRightRadius: borderRadius,
        }}
        enableFooterMarginAdjustment={true}
      >
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;