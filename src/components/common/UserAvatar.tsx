import React, { useMemo } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Text } from "@/components/ui/Text";

interface UserAvatarProps {
  name?: string | null;
  avatarUrl?: string | null;
  size?: number;
}

const getInitials = (name?: string | null) => {
  const safeName = (name || "").trim();
  if (!safeName) return "?";

  const parts = safeName.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name,
  avatarUrl,
  size = 40,
}) => {
  const initials = useMemo(() => getInitials(name), [name]);
  const radius = size / 2;

  if (avatarUrl) {
    return (
      <Image
        source={{ uri: avatarUrl }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: radius },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: radius },
      ]}
    >
      <Text
        variant={size >= 56 ? "subtitle" : "caption"}
        weight="bold"
        style={{ color: "#FFFFFF", letterSpacing: 0.4 }}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: "cover",
    backgroundColor: "#E2E8F0",
  },
  fallback: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1F2937",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
});
