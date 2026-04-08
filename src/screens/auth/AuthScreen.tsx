import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Button, Card, Input, Screen, Text } from "../../components/ui";
import { EnterAnimatedView } from "../../motion/EnterAnimatedView";
import { colors, radius, spacing } from "../../theme";
import { useAuthStore } from "../../stores/authStore";

export const AuthScreen = ({ navigation }: any) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, signIn, isLoading, error, clearError } = useAuthStore();

  const title = useMemo(
    () => (isLogin ? "Welcome back" : "Create account"),
    [isLogin]
  );

  const handleSubmit = async () => {
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        Alert.alert("Error", "Please fill in email and password.");
        return;
      }

      const result = await signIn(email.trim(), password);
      if (result.success) {
        const profile = useAuthStore.getState().profile;
        if (profile?.gender && profile?.nickname) {
          navigation.replace("Main");
        } else if (profile?.gender) {
          navigation.replace("Auth", {
            screen: "ProfileCreation",
            params: { characterId: profile.character_id || "ira" },
          });
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
        Alert.alert(
          "Registration Failed",
          result.error || "Could not create account."
        );
      }
    }
  };

  return (
    <Screen padded={false}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <EnterAnimatedView>
            <View style={styles.header}>
              <Text variant="hero" weight="bold">
                NusaVocal
              </Text>
              <Text
                variant="body"
                tone="muted"
                style={{ marginTop: spacing.sm }}
              >
                Level up your traditional voice.
              </Text>
            </View>

            <View style={styles.segment}>
              <Pressable
                onPress={() => {
                  setIsLogin(true);
                  clearError();
                }}
                style={[styles.segmentItem, isLogin && styles.segmentItemActive]}
              >
                <Text
                  variant="label"
                  weight="semibold"
                  tone={isLogin ? "default" : "muted"}
                >
                  Login
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  setIsLogin(false);
                  clearError();
                }}
                style={[styles.segmentItem, !isLogin && styles.segmentItemActive]}
              >
                <Text
                  variant="label"
                  weight="semibold"
                  tone={!isLogin ? "default" : "muted"}
                >
                  Register
                </Text>
              </Pressable>
            </View>

            <Card style={{ marginTop: spacing.lg }}>
              <Text variant="subtitle" weight="bold">
                {title}
              </Text>
              <Text
                variant="caption"
                tone="muted"
                style={{ marginTop: spacing.xs }}
              >
                {isLogin ? "Masuk untuk lanjut." : "Daftar untuk mulai."}
              </Text>

              <View style={{ marginTop: spacing.lg, gap: spacing.md }}>
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
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />

                {error ? (
                  <Text variant="caption" tone="danger">
                    {error}
                  </Text>
                ) : null}

                <Button
                  label={isLogin ? "Login" : "Create account"}
                  loading={isLoading}
                  onPress={handleSubmit}
                />
              </View>
            </Card>

            <Text
              variant="caption"
              tone="muted"
              style={{ marginTop: spacing.lg, textAlign: "center" }}
            >
              {isLogin
                ? "By continuing, you agree to our terms."
                : "Create an account to start practicing."}
            </Text>
          </EnterAnimatedView>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xxl,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: "flex-start",
  },
  segment: {
    flexDirection: "row",
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    padding: 4,
    marginTop: spacing.lg,
  },
  segmentItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.sm,
    borderRadius: radius.pill,
  },
  segmentItemActive: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
});
