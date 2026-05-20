import React, { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { EnterAnimatedView } from "@/components/motion/EnterAnimatedView";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/authStore";

export const AuthScreen = ({ navigation }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, signIn, isLoading, error, clearError } = useAuthStore();

  const title = useMemo(() => (isLogin ? "Welcome back" : "Create account"), [isLogin]);

  const handleSubmit = async () => {
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Please fill in email and password.");
        return;
      }

      const result = await signIn(email.trim(), password);
      if (result.success) {
        const profile = useAuthStore.getState().profile;
        if (profile?.nickname) {
          navigation.replace("Main");
        } else {
          navigation.navigate("ProfileCreation");
        }
      } else {
        Alert.alert("Login Failed", result.error || "Invalid credentials.");
      }
    } else {
      if (!username.trim() || !email.trim() || !password.trim()) {
        Alert.alert("Error", "Please fill in all fields.");
        return;
      }

      if (password.length < 6) {
        Alert.alert("Error", "Password must be at least 6 characters.");
        return;
      }

      const result = await signUp(email.trim(), password, username.trim());
      if (result.success) {
        navigation.navigate("ProfileCreation");
      } else {
        Alert.alert("Registration Failed", result.error || "Could not create account.");
      }
    }
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView className="bg-background" contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <EnterAnimatedView>
            <View className="px-lg pb-xxl pt-xxl">
              <View className="items-start">
                <Text variant="hero" weight="bold">
                  NusaVocal
                </Text>
                <Text variant="body" tone="muted" className="mt-sm">
                  Level up your traditional voice.
                </Text>
              </View>

              <View className="mt-lg flex-row rounded-pill border border-border bg-surface p-1">
                <Pressable
                  onPress={() => {
                    setIsLogin(true);
                    clearError();
                  }}
                  className={cn(
                    "flex-1 items-center justify-center rounded-pill py-sm",
                    isLogin && "border border-border bg-background"
                  )}
                >
                  <Text variant="label" weight="semibold" tone={isLogin ? "default" : "muted"}>
                    Login
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setIsLogin(false);
                    clearError();
                  }}
                  className={cn(
                    "flex-1 items-center justify-center rounded-pill py-sm",
                    !isLogin && "border border-border bg-background"
                  )}
                >
                  <Text variant="label" weight="semibold" tone={!isLogin ? "default" : "muted"}>
                    Register
                  </Text>
                </Pressable>
              </View>

              <Card className="mt-lg">
                <Text variant="subtitle" weight="bold">
                  {title}
                </Text>
                <Text variant="caption" tone="muted" className="mt-xs">
                  {isLogin ? "Masuk untuk lanjut." : "Daftar untuk mulai."}
                </Text>

                <View className="mt-lg gap-md">
                  {!isLogin ? (
                    <Input
                      label="Username"
                      placeholder="budi_vocalist"
                      value={username}
                      onChangeText={setUsername}
                      autoCapitalize="none"
                      autoCorrect={false}
                    />
                  ) : null}

                  <Input
                    label="Email"
                    placeholder="you@example.com"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                  />
                  <Input
                    label="Password"
                    placeholder="********"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />

                  {error ? (
                    <Text variant="caption" tone="danger">
                      {error}
                    </Text>
                  ) : null}

                  <Button label={isLogin ? "Login" : "Create account"} loading={isLoading} onPress={handleSubmit} />
                </View>
              </Card>

              <Text variant="caption" tone="muted" className="mt-lg text-center">
                {isLogin ? "By continuing, you agree to our terms." : "Create an account to start practicing."}
              </Text>
            </View>
          </EnterAnimatedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};
