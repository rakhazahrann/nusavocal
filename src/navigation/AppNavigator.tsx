import { ROUTES } from "@/constants/routes";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { SplashScreen } from "@/screens/SplashScreen";
import { AuthScreen } from "@/screens/AuthScreen";
import { ProfileCreationScreen } from "@/screens/ProfileCreationScreen";
import { MainScreen } from "@/screens/MainScreen";
import { LeaderboardScreen } from "@/screens/LeaderboardScreen";
import { ProfileScreen } from "@/screens/ProfileScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { VocabFarmingScreen } from "@/screens/FarmingScreen";
import { GameScreen } from "@/screens/GameScreen";
import { ResultScreen } from "@/screens/ResultScreen";












import { CustomTabBar } from "@/components/common/TabBar";
import { useAuthStore } from "@/store/authStore";

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainTab = createBottomTabNavigator();
const MapStack = createNativeStackNavigator();

// 1. Map Flow
const MapNavigator = () => (
  <MapStack.Navigator screenOptions={{ headerShown: false }}>
    <MapStack.Screen name={ROUTES.OVERWORLD} component={MainScreen} />
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
    <MainTab.Screen name={ROUTES.MAP} component={MapNavigator} />
    <MainTab.Screen name={ROUTES.LEADERBOARD} component={LeaderboardScreen} />
    <MainTab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    <MainTab.Screen name={ROUTES.SETTINGS} component={SettingsScreen} />
  </MainTab.Navigator>
);

// 3. Auth Flow
const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name={ROUTES.LOGIN} component={AuthScreen} />
    <AuthStack.Screen
      name={ROUTES.PROFILE_CREATION}
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
    if (!isInitialized) return ROUTES.SPLASH;
    if (!session) return ROUTES.AUTH;
    if (!profile?.nickname) return ROUTES.AUTH;
    return ROUTES.MAIN;
  };

  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute()}
    >
      <RootStack.Screen name={ROUTES.SPLASH} component={SplashScreen} />
      <RootStack.Screen name={ROUTES.AUTH} component={AuthNavigator} />
      <RootStack.Screen name={ROUTES.MAIN} component={MainNavigator} />
      {/* <RootStack.Screen name="Admin" component={AdminNavigator} /> */}
      <RootStack.Screen name={ROUTES.VOCAB_FARMING} component={VocabFarmingScreen} />
      <RootStack.Screen name={ROUTES.GAMEPLAY} component={GameScreen} />
      <RootStack.Screen name={ROUTES.RESULT} component={ResultScreen} />
    </RootStack.Navigator>
  );
};
