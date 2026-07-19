import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

let enabled = true;

/** Toggled from Settings → Preferences. */
export function setHapticsEnabled(value: boolean) {
  enabled = value;
}

export function isHapticsEnabled() {
  return enabled;
}

function guard(trigger: () => Promise<void>) {
  if (!enabled || Platform.OS === 'web') return;
  trigger().catch(() => {
    // Haptics are best-effort; never surface a failure.
  });
}

export const haptics = {
  /** Picker ticks, tab switches, chip selection. */
  selection: () => guard(() => Haptics.selectionAsync()),
  /** Standard button presses. */
  light: () => guard(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  /** Prominent actions: send, primary CTAs. */
  medium: () => guard(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)),
  success: () => guard(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warning: () => guard(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
} as const;
