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
import { useAuthStore } from "./src/stores/authStore";
import { TamaguiProvider } from "tamagui";
import { tamaguiConfig } from "./tamagui.config";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { initialize } = useAuthStore();
  const [fontTimeoutReached, setFontTimeoutReached] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
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
    // Initialize auth state (check for existing session)
    initialize();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setFontTimeoutReached(true), 3500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded || fontError || fontTimeoutReached) {
        if (fontError) {
          console.warn("[fonts] failed to load, continuing without them", fontError);
        }
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [fontsLoaded, fontError, fontTimeoutReached]);

  if (!fontsLoaded && !fontError && !fontTimeoutReached) {
    return null;
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
      </NavigationContainer>
    </TamaguiProvider>
  );
}
