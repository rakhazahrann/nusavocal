import "./src/global.css";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AppNavigator } from "@/navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import { Poppins_300Light } from "@expo-google-fonts/poppins/300Light";
import { Poppins_400Regular } from "@expo-google-fonts/poppins/400Regular";
import { Poppins_500Medium } from "@expo-google-fonts/poppins/500Medium";
import { Poppins_600SemiBold } from "@expo-google-fonts/poppins/600SemiBold";
import { Poppins_700Bold } from "@expo-google-fonts/poppins/700Bold";
import { useAuthStore } from "@/store/authStore";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { PortalHost } from "@rn-primitives/portal";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function App() {
  const { initialize } = useAuthStore();
  const [fontTimeoutReached, setFontTimeoutReached] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Light": Poppins_300Light,
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
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
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <AppNavigator />
        <PortalHost />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
