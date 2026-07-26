import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Durations } from '@/constants/motion';
import { Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useThemeContext } from '@/providers/theme-provider';
import { useConversations } from '@/providers/conversations-provider';

type ChatInputProps = {
  onSend: (text: string) => void;
  placeholder?: string;
};

/**
 * Modern integrated ChatGPT-style pill input bar with dynamic 10 (guest) & 20 (free) limits.
 */
export function ChatInput({ onSend, placeholder = 'Ask your legal question…' }: ChatInputProps) {
  const theme = useTheme();
  const { scheme } = useThemeContext();
  const insets = useSafeAreaInsets();
  const {
    totalUserMessages,
    isLoggedIn,
    isPro,
    setLoginModalVisible,
    setPaywallModalVisible,
  } = useConversations();

  const [draft, setDraft] = useState('');
  const isDark = scheme === 'dark';

  const isLoginLimitReached = !isLoggedIn && totalUserMessages >= 10;
  const isPaywallLimitReached = isLoggedIn && !isPro && totalUserMessages >= 20;
  const isLimitReached = isLoginLimitReached || isPaywallLimitReached;
  const canSend = draft.trim().length > 0 && !isLimitReached;

  const handleSend = () => {
    if (isLoginLimitReached) {
      setLoginModalVisible(true);
      return;
    }
    if (isPaywallLimitReached) {
      setPaywallModalVisible(true);
      return;
    }
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    onSend(text);
  };

  const handleTriggerModal = () => {
    if (isLoginLimitReached) setLoginModalVisible(true);
    else if (isPaywallLimitReached) setPaywallModalVisible(true);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.background,
          paddingBottom: Math.max(insets.bottom, 12) + (isLoggedIn ? 68 : 0),
        },
      ]}
    >
      {/* Dynamic Usage Limit Banner */}
      {isLimitReached && (
        <View style={[styles.banner, { backgroundColor: theme.surface, borderColor: theme.gold }]}>
          <Icon name="sparkles" size={15} color={theme.gold} />
          <ThemedText style={[styles.bannerText, { color: theme.textSecondary }]}>
            {isLoginLimitReached
              ? 'Guest limit reached (10/10 msgs). Sign in to continue.'
              : 'Free limit reached (20/20 msgs). Upgrade to LexAura Pro.'}
          </ThemedText>
          <PressableScale
            onPress={handleTriggerModal}
            haptic="medium"
            style={[styles.upgradeBadge, { backgroundColor: theme.gold }]}
          >
            <ThemedText style={[styles.upgradeBadgeText, { color: theme.onPrimary }]}>
              {isLoginLimitReached ? 'Sign In' : 'Upgrade'}
            </ThemedText>
          </PressableScale>
        </View>
      )}

      {/* Integrated Capsule Input Bar */}
      <View
        style={[
          styles.pillBar,
          {
            backgroundColor: isDark ? '#161B22' : '#FFFFFF',
            borderColor: theme.border,
          },
          isLimitReached && styles.disabledInput,
        ]}
      >
        <View style={styles.leftSparkleIcon}>
          <Icon name="sparkles" size={16} color={theme.gold} />
        </View>

        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={
            isLoginLimitReached
              ? 'Sign in to send more questions...'
              : isPaywallLimitReached
              ? 'Upgrade to Pro to continue conversation...'
              : placeholder
          }
          placeholderTextColor={theme.placeholder}
          selectionColor={theme.gold}
          editable={!isLimitReached}
          multiline
          accessibilityLabel="Ask your question"
          style={[styles.input, { color: theme.text }]}
        />

        {/* Embedded Send Button */}
        {canSend || isLimitReached ? (
          <Animated.View
            entering={ZoomIn.duration(Durations.fast)}
            exiting={ZoomOut.duration(Durations.fast)}
          >
            <PressableScale
              onPress={handleSend}
              haptic="medium"
              scaleTo={0.92}
              accessibilityLabel="Send message"
              style={[styles.sendButton, { backgroundColor: theme.gold }]}
            >
              <Icon
                name={isLimitReached ? 'sparkles' : 'send'}
                size={15}
                color={theme.onPrimary}
                weight="semibold"
              />
            </PressableScale>
          </Animated.View>
        ) : (
          <View
            style={[
              styles.sendButton,
              styles.sendDisabled,
              { backgroundColor: isDark ? '#2A313D' : '#E8E3DB' },
            ]}
          >
            <Icon name="send" size={15} color={theme.textSecondary} />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xs,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs + 2,
    marginBottom: Spacing.xs,
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: Spacing.xs,
  },
  bannerText: {
    fontSize: 12,
    flex: 1,
  },
  upgradeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  upgradeBadgeText: {
    fontSize: 11.5,
    fontWeight: '700',
  },
  pillBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 24,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 6,
    minHeight: 48,
    gap: 8,
  },
  leftSparkleIcon: {
    paddingLeft: 2,
  },
  disabledInput: {
    opacity: 0.7,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.sans,
    fontSize: 14.5,
    lineHeight: 19,
    maxHeight: 96,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendDisabled: {
    opacity: 0.5,
  },
});
