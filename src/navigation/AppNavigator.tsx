import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  SplashScreen,
  LoginScreen,
  OverworldMapScreen,
  StageBriefingScreen,
  VocabFarmingScreen,
  GameplayScreen,
  ResultScreen,
  ProfileScreen,
  LeaderboardScreen,
  SettingsScreen,
} from "../screens";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();
const MapStack = createNativeStackNavigator();

// 1. Map Flow
const MapNavigator = () => (
  <MapStack.Navigator screenOptions={{ headerShown: false }}>
    <MapStack.Screen name="Overworld" component={OverworldMapScreen} />
    <MapStack.Screen name="StageBriefing" component={StageBriefingScreen} />
    <MapStack.Screen name="VocabFarming" component={VocabFarmingScreen} />
    <MapStack.Screen name="Gameplay" component={GameplayScreen} />
    <MapStack.Screen name="Result" component={ResultScreen} />
  </MapStack.Navigator>
);

// 2. Main Tab
const MainNavigator = () => (
  <MainTab.Navigator
    screenOptions={{
      headerShown: false,
      tabBarStyle: { backgroundColor: "#16213e", borderTopWidth: 0 },
      tabBarActiveTintColor: "#ffc947",
      tabBarInactiveTintColor: "#a0a0b0",
    }}
  >
    <MainTab.Screen
      name="Map"
      component={MapNavigator}
      options={{ tabBarLabel: "Petualangan" }}
    />
    <MainTab.Screen
      name="Leaderboard"
      component={LeaderboardScreen}
      options={{ tabBarLabel: "Papan Skor" }}
    />
    <MainTab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarLabel: "Profil" }}
    />
    <MainTab.Screen
      name="Settings"
      component={SettingsScreen}
      options={{ tabBarLabel: "Pengaturan" }}
    />
  </MainTab.Navigator>
);

// 3. Auth Flow
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={LoginScreen} />
  </AuthStack.Navigator>
);

// 4. Root App Navigation
export const AppNavigator = () => (
  <RootStack.Navigator screenOptions={{ headerShown: false }}>
    <RootStack.Screen name="Splash" component={SplashScreen} />
    <RootStack.Screen name="Auth" component={AuthNavigator} />
    <RootStack.Screen name="Main" component={MainNavigator} />
  </RootStack.Navigator>
);
