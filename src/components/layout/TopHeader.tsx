import React from "react";
import { View, StyleSheet } from "react-native";
import { GameIcon } from "../ui/GameIcon";
import { PixelText } from "../ui/PixelText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FULL_HEART = require("../../../assets/ui/full-heart.png");
const EMPTY_HEART = require("../../../assets/ui/empty-heart.png");
const HALF_HEART = require("../../../assets/ui/half-heart.png");
const FIRE_ICON = require("../../../assets/ui/fire-icon.png");
const COIN_ICON = require("../../../assets/ui/button.png"); // Using button.png as placeholder for coin until a specific coin asset is provided
const BORDER_BADGE = require("../../../assets/ui/border-badge.png");

interface TopHeaderProps {
  hearts?: number;
  maxHearts?: number;
  fireCount?: number;
  coinCount?: number;
  level?: number;
  currentXp?: number;
  maxXp?: number;
  showBadge?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  hearts = 4,
  maxHearts = 5,
  fireCount = 12,
  coinCount = 450,
  level = 5,
  currentXp = 650,
  maxXp = 1000,
  showBadge = true,
}) => {
  const insets = useSafeAreaInsets();

  const renderHearts = () => {
    const heartElements = [];
    for (let i = 1; i <= maxHearts; i++) {
      let source = EMPTY_HEART;
      if (hearts >= i) {
        source = FULL_HEART;
      } else if (hearts >= i - 0.5) {
        source = HALF_HEART;
      }
      heartElements.push(
        <GameIcon
          key={i}
          source={source}
          size={28}
          style={{ marginHorizontal: -2 }}
        />,
      );
    }
    return heartElements;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Top Main Status Bar */}
      <View style={styles.statusBar}>
        <View style={styles.heartsContainer}>{renderHearts()}</View>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <GameIcon source={FIRE_ICON} size={24} />
            <PixelText size={16} color="#ffffff" shadow style={styles.statText}>
              {fireCount}
            </PixelText>
          </View>
          <View style={styles.statItem}>
            <GameIcon source={COIN_ICON} size={24} />
            <PixelText size={16} color="#ffffff" shadow style={styles.statText}>
              {coinCount}
            </PixelText>
          </View>
        </View>
      </View>

      {/* Sub Header for Level and Badge */}
      <View style={styles.subHeader}>
        {/* Level Progress */}
        <View style={styles.levelContainer}>
          <PixelText size={16} color="#ffffff" shadow>
            LVL {level}
          </PixelText>
          <View style={styles.progressWrapper}>
            <PixelText size={8} color="#ffffff" shadow style={styles.xpText}>
              {currentXp}/{maxXp} XP
            </PixelText>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: `${(currentXp / maxXp) * 100}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Badge */}
        {showBadge && (
          <View style={styles.badgeContainer}>
            <GameIcon source={BORDER_BADGE} size={48} />
            <PixelText
              size={10}
              color="#ffffff"
              shadow
              style={styles.badgeText}
            >
              NEW BADGE!
            </PixelText>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 10,
    position: "absolute",
    top: 0,
  },
  statusBar: {
    backgroundColor: "#8b5a2b",
    borderWidth: 4,
    borderColor: "#3e2723",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginHorizontal: 8,
    marginTop: 8,
    borderRadius: 8,
  },
  heartsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  statText: {
    marginLeft: 6,
    marginTop: 4,
  },
  subHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 8,
  },
  levelContainer: {
    flexDirection: "row",
    backgroundColor: "#8b5a2b",
    borderWidth: 4,
    borderColor: "#3e2723",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  progressWrapper: {
    marginLeft: 12,
    alignItems: "flex-end",
  },
  xpText: {
    marginBottom: 4,
  },
  progressBarBg: {
    width: 100,
    height: 12,
    backgroundColor: "#3e2723",
    borderWidth: 2,
    borderColor: "#5d3a1a",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#4a90e2",
  },
  badgeContainer: {
    backgroundColor: "#d89b6c", // Slightly lighter wood for the badge background
    borderWidth: 4,
    borderColor: "#3e2723",
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 80,
  },
  badgeText: {
    marginTop: 4,
  },
});
