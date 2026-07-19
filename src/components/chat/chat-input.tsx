import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { ZoomIn, ZoomOut } from 'react-native-reanimated';

import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Durations } from '@/constants/motion';
import { Fonts, IconSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type ChatInputProps = {
  onSend: (text: string) => void;
  placeholder?: string;
};

/**
 * Growing multiline composer. The send button zooms in only when there is
 * something to send.
 */
export function ChatInput({ onSend, placeholder = 'Ask your legal question…' }: ChatInputProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState('');
  const canSend = draft.trim().length > 0;

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    onSend(text);
  };

  return (
    <View
      style={[
        styles.bar,
        {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          paddingBottom: Math.max(insets.bottom, Spacing.md),
        },
      ]}
    >
      <View
        style={[
          styles.inputWrapper,
          { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder },
        ]}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder={placeholder}
          placeholderTextColor={theme.placeholder}
          selectionColor={theme.accent}
          multiline
          accessibilityLabel="Message"
          style={[styles.input, { color: theme.text }]}
        />
      </View>

      {canSend ? (
        <Animated.View
          entering={ZoomIn.duration(Durations.fast)}
          exiting={ZoomOut.duration(Durations.fast)}
        >
          <PressableScale
            onPress={handleSend}
            haptic="medium"
            scaleTo={0.9}
            accessibilityLabel="Send message"
            style={[styles.sendButton, { backgroundColor: theme.primary }]}
          >
            <Icon name="send" size={IconSize.md} color={theme.onPrimary} weight="semibold" />
          </PressableScale>
        </Animated.View>
      ) : (
        <View style={[styles.sendButton, styles.sendPlaceholder, { borderColor: theme.border }]}>
          <Icon name="send" size={IconSize.md} color={theme.iconMuted} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: Spacing.sm + 2,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm + 2,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: Radius.xl,
    borderWidth: 1,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    maxHeight: 132,
  },
  input: {
    fontFamily: Fonts.sans,
    fontSize: 15,
    lineHeight: 20,
    maxHeight: 108,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendPlaceholder: {
    borderWidth: 1,
    opacity: 0.55,
  },
});
