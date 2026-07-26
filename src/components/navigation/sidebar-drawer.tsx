import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn, SlideInLeft } from 'react-native-reanimated';

import AppLogo from '@/components/app-logo';
import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { TextField } from '@/components/ui/text-field';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useConversations } from '@/providers/conversations-provider';
import { haptics } from '@/utils/haptics';

type SidebarDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

export function SidebarDrawer({ visible, onClose }: SidebarDrawerProps) {
  const router = useRouter();
  const theme = useTheme();
  const {
    conversations,
    deleteConversation,
    totalUserMessages,
    isLoggedIn,
    isPro,
    setLoginModalVisible,
    setPaywallModalVisible,
  } = useConversations();

  const [query, setQuery] = useState('');

  const filteredConversations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.messages.some((m) => m.text.toLowerCase().includes(q)),
    );
  }, [conversations, query]);

  if (!visible) return null;

  const handleNewChat = () => {
    onClose();
    router.push({ pathname: '/chat/[id]', params: { id: 'new' } });
  };

  const handleOpenConversation = (id: string) => {
    onClose();
    router.push({ pathname: '/chat/[id]', params: { id } });
  };

  const handleDelete = (id: string) => {
    haptics.selection();
    deleteConversation(id);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        {/* Backdrop tap to close */}
        <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />

        {/* Sliding Sidebar Panel */}
        <Animated.View
          entering={SlideInLeft.duration(280)}
          style={[styles.sidebar, { backgroundColor: theme.card, borderColor: theme.border }]}
        >
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <AppLogo size={36} showText={false} />
            <ThemedText style={[styles.brandName, { color: theme.text }]}>
              LexAura
            </ThemedText>
            <PressableScale onPress={onClose} hitSlop={10} style={styles.closeBtn}>
              <Icon name="close" size={18} color={theme.iconMuted} />
            </PressableScale>
          </View>

          {/* New Chat Button */}
          <Button
            title="New Question"
            icon="plus"
            onPress={handleNewChat}
            fullWidth
            style={styles.newChatBtn}
          />

          {/* Message Usage Meter */}
          <View style={[styles.usageBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <View style={styles.usageRow}>
              <ThemedText style={[styles.usageLabel, { color: theme.textSecondary }]}>
                {isPro ? 'Pro Plan ⭐' : !isLoggedIn ? 'Guest Trial' : 'Free Tier'}
              </ThemedText>
              <ThemedText style={[styles.usageCount, { color: theme.gold }]}>
                {isPro ? 'Unlimited' : `${totalUserMessages} / ${!isLoggedIn ? 10 : 20} msgs`}
              </ThemedText>
            </View>

            {!isPro && (
              <View style={[styles.meterTrack, { backgroundColor: theme.border }]}>
                <View
                  style={[
                    styles.meterFill,
                    {
                      width: `${Math.min((totalUserMessages / (!isLoggedIn ? 10 : 20)) * 100, 100)}%`,
                      backgroundColor: theme.gold,
                    },
                  ]}
                />
              </View>
            )}

            {!isPro && (
              <PressableScale
                onPress={() => {
                  onClose();
                  if (!isLoggedIn) setLoginModalVisible(true);
                  else setPaywallModalVisible(true);
                }}
                style={styles.upgradeLink}
              >
                <ThemedText style={[styles.upgradeText, { color: theme.gold }]}>
                  {!isLoggedIn ? 'Log In / Sign Up →' : 'Upgrade to Pro →'}
                </ThemedText>
              </PressableScale>
            )}
          </View>

          {/* Search Field */}
          <View style={styles.searchWrapper}>
            <TextField
              icon="search"
              placeholder="Search history…"
              value={query}
              onChangeText={setQuery}
            />
          </View>

          {/* History List */}
          <ThemedText style={[styles.sectionTitle, { color: theme.textMuted }]}>
            History
          </ThemedText>

          <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
            {filteredConversations.length > 0 ? (
              filteredConversations.map((item) => (
                <View
                  key={item.id}
                  style={[styles.historyRow, { borderBottomColor: theme.border }]}
                >
                  <TouchableOpacity
                    style={styles.historyTextItem}
                    activeOpacity={0.7}
                    onPress={() => handleOpenConversation(item.id)}
                  >
                    <Icon name="chat" size={16} color={theme.gold} />
                    <ThemedText
                      numberOfLines={1}
                      style={[styles.historyTitle, { color: theme.text }]}
                    >
                      {item.title}
                    </ThemedText>
                  </TouchableOpacity>

                  <PressableScale
                    onPress={() => handleDelete(item.id)}
                    hitSlop={8}
                    style={styles.deleteBtn}
                  >
                    <Icon name="trash" size={15} color={theme.textMuted} />
                  </PressableScale>
                </View>
              ))
            ) : (
              <View style={styles.emptyBox}>
                <ThemedText style={[styles.emptyText, { color: theme.textMuted }]}>
                  {query ? 'No matching conversations' : 'No history yet'}
                </ThemedText>
              </View>
            )}
          </ScrollView>

          {/* Bottom Settings Link */}
          <TouchableOpacity
            style={[styles.bottomProfile, { borderTopColor: theme.border }]}
            activeOpacity={0.7}
            onPress={() => {
              onClose();
              router.push('/profile');
            }}
          >
            <Icon name="settings" size={18} color={theme.textSecondary} />
            <ThemedText style={[styles.profileText, { color: theme.text }]}>
              Settings & Account
            </ThemedText>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
  },
  sidebar: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    borderRightWidth: 1,
    paddingTop: Spacing.xl + 10,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg,
    zIndex: 10,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  brandName: {
    fontFamily: 'Georgia',
    fontSize: 20,
    fontWeight: '400',
    flex: 1,
  },
  closeBtn: {
    padding: 4,
  },
  newChatBtn: {
    marginBottom: Spacing.md,
  },
  usageBox: {
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    marginBottom: Spacing.md,
    gap: 6,
  },
  usageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  usageLabel: {
    fontSize: 12.5,
    fontWeight: '600',
  },
  usageCount: {
    fontSize: 12,
    fontWeight: '600',
  },
  meterTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 2,
  },
  upgradeLink: {
    marginTop: 2,
  },
  upgradeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  searchWrapper: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: Spacing.xs,
  },
  historyList: {
    flex: 1,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md - 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  historyTextItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: Spacing.sm,
    marginRight: Spacing.sm,
  },
  historyTitle: {
    fontSize: 13.5,
  },
  deleteBtn: {
    padding: 4,
  },
  emptyBox: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 13,
  },
  bottomProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingTop: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: Spacing.sm,
  },
  profileText: {
    fontSize: 13.5,
    fontWeight: '500',
  },
});
