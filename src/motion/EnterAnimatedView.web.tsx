import React, { useEffect, useRef } from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { motionDurations } from "./tokens";
import { useSettingsStore } from "../stores/settingsStore";

type GsapModule = {
  gsap: {
    fromTo: (target: any, fromVars: any, toVars: any) => any;
  };
};

export interface EnterAnimatedViewProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const EnterAnimatedView: React.FC<EnterAnimatedViewProps> = ({ children, style }) => {
  const reduceMotion = useSettingsStore((s) => s.reduceMotion);
  const ref = useRef<any>(null);

  useEffect(() => {
    if (reduceMotion) return;
    if (!ref.current) return;

    let gsap: GsapModule["gsap"] | null = null;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = require("gsap") as GsapModule;
      gsap = mod.gsap;
    } catch {
      gsap = null;
    }
    if (!gsap) return;

    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: motionDurations.short / 1000,
        ease: "power2.out",
      }
    );
  }, [reduceMotion]);

  return (
    <View ref={ref} style={style as any}>
      {children}
    </View>
  );
};
