import { createContext, useContext, useMemo, useState, type PropsWithChildren } from 'react';

import { Colors, type ColorPalette } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedScheme = 'light' | 'dark';

type ThemeContextValue = {
  /** The user's choice in Settings. */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** The scheme actually in effect after resolving `system`. */
  scheme: ResolvedScheme;
  colors: ColorPalette;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function AppThemeProvider({ children }: PropsWithChildren) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const scheme: ResolvedScheme =
    preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, setPreference, scheme, colors: Colors[scheme] }),
    [preference, scheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used inside AppThemeProvider');
  }
  return context;
}
