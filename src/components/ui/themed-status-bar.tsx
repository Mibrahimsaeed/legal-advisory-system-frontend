import { StatusBar } from 'expo-status-bar';

import { useThemeContext } from '@/providers/theme-provider';

/**
 * Status bar that follows the resolved app theme. Brand-locked screens
 * (splash, onboarding, auth) render `<StatusBar style="light" />` directly
 * instead, since they are always navy.
 */
export function ThemedStatusBar() {
  const { scheme } = useThemeContext();
  return <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />;
}
