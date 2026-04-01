import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import {
  SplashScreen,
  AuthScreen,
  CharacterSelectScreen,
  ProfileCreationScreen,
  MainScreen,
  LeaderboardScreen,
  ProfileScreen,
  SettingsScreen,
  StageBriefingScreen,
  VocabFarmingScreen,
  GameScreen,
  ResultScreen,
} from "../screens";

import { CustomTabBar } from "../components/common/TabBar";
import { useAuthStore } from "../stores/authStore";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();
const MapStack = createNativeStackNavigator();

// 1. Map Flow
const MapNavigator = () => (
  <MapStack.Navigator screenOptions={{ headerShown: false }}>
    <MapStack.Screen name="Overworld" component={MainScreen} />
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
    <MainTab.Screen name="Leaderboard" component={LeaderboardScreen} />
    <MainTab.Screen name="Profile" component={ProfileScreen} />
    <MainTab.Screen name="Settings" component={SettingsScreen} />
  </MainTab.Navigator>
);

// 3. Auth Flow
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="Login" component={AuthScreen} />
    <AuthStack.Screen
      name="CharacterSelect"
      component={CharacterSelectScreen}
    />
    <AuthStack.Screen
      name="ProfileCreation"
      component={ProfileCreationScreen}
    />
  </AuthStack.Navigator>
);

// 4. Admin Flow (Legacy - to be removed)
// const AdminNavigator = () => (
//   <AdminStack.Navigator screenOptions={{ headerShown: false }}>
//     <AdminStack.Screen name="AdminHome" component={AdminDashboard} />
//     <AdminStack.Screen name="AdminStages" component={AdminStagesScreen} />
//     <AdminStack.Screen name="AdminVocab" component={AdminVocabScreen} />
//     <AdminStack.Screen name="AdminScenarios" component={AdminScenariosScreen} />
//   </AdminStack.Navigator>
// );

// 5. Root App Navigation
export const AppNavigator = () => {
  const { session, profile, isInitialized } = useAuthStore();

  // Determine initial route based on auth state
  const getInitialRoute = () => {
    if (!isInitialized) return "Splash";
    if (!session) return "Auth";
    // Admins now use the Main Map flow with integrated tools
    // We only check for gender/nickname for regular users (or for everyone to ensure profile setup)
    if (!profile?.gender) return "Auth";
    if (!profile?.nickname) return "Auth";
    return "Main";
  };

  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute()}
    >
      <RootStack.Screen name="Splash" component={SplashScreen} />
      <RootStack.Screen name="Auth" component={AuthNavigator} />
      <RootStack.Screen name="Main" component={MainNavigator} />
      {/* <RootStack.Screen name="Admin" component={AdminNavigator} /> */}
      <RootStack.Screen name="StageBriefing" component={StageBriefingScreen} />
      <RootStack.Screen name="VocabFarming" component={VocabFarmingScreen} />
      <RootStack.Screen name="Gameplay" component={GameScreen} />
      <RootStack.Screen name="Result" component={ResultScreen} />
    </RootStack.Navigator>
  );
};
