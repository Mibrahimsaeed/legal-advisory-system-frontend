import { Modal, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { PressableScale } from '@/components/ui/pressable-scale';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useConversations } from '@/providers/conversations-provider';
import { haptics } from '@/utils/haptics';

export function PaywallModal() {
  const theme = useTheme();
  const { paywallModalVisible, setPaywallModalVisible, setIsPro } = useConversations();

  if (!paywallModalVisible) return null;

  const handleUpgrade = () => {
    setIsPro(true);
    setPaywallModalVisible(false);
    haptics.success();
  };

  return (
    <Modal
      transparent
      animationType="fade"
      visible={paywallModalVisible}
      onRequestClose={() => setPaywallModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          {/* Close button */}
          <PressableScale
            onPress={() => setPaywallModalVisible(false)}
            hitSlop={10}
            style={[styles.closeButton, { backgroundColor: theme.surface, borderColor: theme.border }]}
          >
            <Icon name="close" size={16} color={theme.text} />
          </PressableScale>

          {/* Pro Icon Badge */}
          <View style={[styles.badge, { backgroundColor: theme.gold }]}>
            <Icon name="sparkles" size={24} color={theme.onPrimary} />
          </View>

          {/* Title & Price */}
          <ThemedText style={[styles.title, { color: theme.text }]}>
            Upgrade to LexAura Pro
          </ThemedText>

          <View style={[styles.pricePill, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <ThemedText style={[styles.priceText, { color: theme.gold }]}>
              $9.99 / month
            </ThemedText>
          </View>

          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            You've reached your free usage limit of 20 messages. Upgrade to Pro for unlimited guidance.
          </ThemedText>

          {/* Benefits List */}
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <Icon name="check" size={16} color={theme.gold} />
              <ThemedText style={[styles.benefitText, { color: theme.text }]}>
                Unlimited AI legal questions
              </ThemedText>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="check" size={16} color={theme.gold} />
              <ThemedText style={[styles.benefitText, { color: theme.text }]}>
                Priority 24/7 response time
              </ThemedText>
            </View>
            <View style={styles.benefitItem}>
              <Icon name="check" size={16} color={theme.gold} />
              <ThemedText style={[styles.benefitText, { color: theme.text }]}>
                Contract & document analysis
              </ThemedText>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button title="Unlock Unlimited Access" onPress={handleUpgrade} fullWidth />
            <PressableScale onPress={() => setPaywallModalVisible(false)} hitSlop={10}>
              <ThemedText style={[styles.maybeLater, { color: theme.textSecondary }]}>
                Maybe later
              </ThemedText>
            </PressableScale>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: Radius.xl,
    borderWidth: 1,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  badge: {
    width: 52,
    height: 52,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: Spacing.md,
  },
  title: {
    fontFamily: 'Georgia',
    fontSize: 24,
    fontWeight: '400',
    textAlign: 'center',
  },
  pricePill: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: Radius.full,
    borderWidth: 1,
    marginTop: Spacing.xs,
    marginBottom: Spacing.sm,
  },
  priceText: {
    fontSize: 13,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: Spacing.lg,
  },
  benefitsList: {
    width: '100%',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: 13.5,
  },
  actions: {
    width: '100%',
    alignItems: 'center',
    gap: Spacing.md,
  },
  maybeLater: {
    fontSize: 13,
  },
});
