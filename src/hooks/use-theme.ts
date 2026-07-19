import type { ColorPalette } from '@/constants/theme';
import { useThemeContext } from '@/providers/theme-provider';

/**
 * The active color palette, resolved from the user's theme preference
 * (Settings → Appearance) falling back to the system scheme.
 */
export function useTheme(): ColorPalette {
  return useThemeContext().colors;
}
