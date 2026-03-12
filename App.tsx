import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "./src/navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  SpaceGrotesk_300Light,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from "@expo-google-fonts/space-grotesk";
import { PressStart2P_400Regular } from "@expo-google-fonts/press-start-2p";
import {
  PixelifySans_400Regular,
  PixelifySans_500Medium,
  PixelifySans_600SemiBold,
  PixelifySans_700Bold,
} from "@expo-google-fonts/pixelify-sans";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    "SpaceGrotesk-Light": SpaceGrotesk_300Light,
    "SpaceGrotesk-Regular": SpaceGrotesk_400Regular,
    "SpaceGrotesk-Medium": SpaceGrotesk_500Medium,
    "SpaceGrotesk-SemiBold": SpaceGrotesk_600SemiBold,
    "SpaceGrotesk-Bold": SpaceGrotesk_700Bold,
    "PressStart2P-Regular": PressStart2P_400Regular,
    "PixelifySans-Regular": PixelifySans_400Regular,
    "PixelifySans-Medium": PixelifySans_500Medium,
    "PixelifySans-SemiBold": PixelifySans_600SemiBold,
    "PixelifySans-Bold": PixelifySans_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
