import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import type { ColorValue, StyleProp, ViewStyle } from 'react-native';

import { IconSize } from '@/constants/theme';

type PlatformSymbol = Extract<SymbolViewProps['name'], { ios?: unknown }>;
type SymbolSpec = {
  ios: NonNullable<PlatformSymbol['ios']>;
  android: NonNullable<PlatformSymbol['android']>;
};

/**
 * Semantic icon registry — one name per concept, mapped to SF Symbols on
 * iOS and Material Symbols on Android/web so each platform feels native.
 */
const ICONS = {
  home: { ios: 'house', android: 'home' },
  homeFilled: { ios: 'house.fill', android: 'home' },
  history: { ios: 'clock.arrow.circlepath', android: 'history' },
  profile: { ios: 'person', android: 'person' },
  profileFilled: { ios: 'person.fill', android: 'person' },
  search: { ios: 'magnifyingglass', android: 'search' },
  send: { ios: 'arrow.up', android: 'arrow_upward' },
  plus: { ios: 'plus', android: 'add' },
  close: { ios: 'xmark', android: 'close' },
  back: { ios: 'chevron.left', android: 'arrow_back' },
  forward: { ios: 'arrow.right', android: 'arrow_forward' },
  chevronRight: { ios: 'chevron.right', android: 'chevron_right' },
  check: { ios: 'checkmark', android: 'check' },
  trash: { ios: 'trash', android: 'delete' },
  signOut: { ios: 'rectangle.portrait.and.arrow.right', android: 'logout' },
  bell: { ios: 'bell', android: 'notifications' },
  moon: { ios: 'moon', android: 'dark_mode' },
  sun: { ios: 'sun.max', android: 'light_mode' },
  themeAuto: { ios: 'circle.lefthalf.filled', android: 'contrast' },
  document: { ios: 'doc.text', android: 'description' },
  lock: { ios: 'lock', android: 'lock' },
  mail: { ios: 'envelope', android: 'mail' },
  eye: { ios: 'eye', android: 'visibility' },
  eyeOff: { ios: 'eye.slash', android: 'visibility_off' },
  sparkles: { ios: 'sparkles', android: 'auto_awesome' },
  briefcase: { ios: 'briefcase', android: 'work' },
  building: { ios: 'building.2', android: 'apartment' },
  family: { ios: 'person.2', android: 'group' },
  cart: { ios: 'cart', android: 'shopping_cart' },
  globe: { ios: 'globe', android: 'public' },
  gavel: { ios: 'hammer', android: 'gavel' },
  key: { ios: 'key', android: 'key' },
  shield: { ios: 'checkmark.shield', android: 'verified_user' },
  info: { ios: 'info.circle', android: 'info' },
  idea: { ios: 'lightbulb', android: 'lightbulb' },
  mic: { ios: 'mic', android: 'mic' },
  copy: { ios: 'square.on.square', android: 'content_copy' },
  chat: { ios: 'bubble.left.and.bubble.right', android: 'forum' },
  book: { ios: 'book.closed', android: 'menu_book' },
  settings: { ios: 'gearshape', android: 'settings' },
  edit: { ios: 'pencil', android: 'edit' },
  clock: { ios: 'clock', android: 'schedule' },
} satisfies Record<string, SymbolSpec>;

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  /** Defaults to `IconSize.md` (20). */
  size?: number;
  color: ColorValue;
  weight?: SymbolViewProps['weight'];
  style?: StyleProp<ViewStyle>;
};

export function Icon({ name, size = IconSize.md, color, weight, style }: IconProps) {
  const spec = ICONS[name];
  return (
    <SymbolView
      name={{ ios: spec.ios, android: spec.android, web: spec.android }}
      size={size}
      tintColor={color}
      weight={weight}
      style={style}
    />
  );
}
