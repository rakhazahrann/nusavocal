import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  SplashScreen,
  LoginScreen,
  MainScreen,
  StageBriefingScreen,
  VocabFarmingScreen,
  GameScreen,
  ResultScreen,
  Leaderboard,
  Construction,
} from "../screens";

import { CustomTabBar } from "../components/common/TabBar";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();
const MapStack = createNativeStackNavigator();

// 1. Map Flow
const MapNavigator = () => (
  <MapStack.Navigator screenOptions={{ headerShown: false }}>
    <MapStack.Screen name="Overworld" component={MainScreen} />
    {/* <MapStack.Screen name="StageBriefing" component={StageBriefingScreen} />
    <MapStack.Screen name="VocabFarming" component={VocabFarmingScreen} />
    <MapStack.Screen name="Gameplay" component={GameScreen} />
    <MapStack.Screen name="Result" component={ResultScreen} /> */}
  </MapStack.Navigator>
);

// 2. Main Tab
const MainNavigator = () => (
  <MainTab.Navigator
    tabBar={(props) => <CustomTabBar {...props} />}
    screenOptions={{
      headerShown: false,
    }}
  >
    <MainTab.Screen name="Map" component={MapNavigator} />
    <MainTab.Screen name="Settings" component={Construction} />
    <MainTab.Screen name="Leaderboard" component={Construction} />
    <MainTab.Screen name="Profile" component={Construction} />
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
