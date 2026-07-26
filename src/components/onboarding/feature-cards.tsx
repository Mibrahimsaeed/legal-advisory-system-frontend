import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Icon, type IconName } from '@/components/ui/icon';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FeatureItem = {
  icon: IconName;
  title: string;
  description: string;
};

const FEATURES: FeatureItem[] = [
  {
    icon: 'sparkles',
    title: 'AI-Powered Answers',
    description: 'Get accurate, up-to-date legal insights.',
  },
  {
    icon: 'document',
    title: 'Plain Language',
    description: 'Understand complex laws in simple terms.',
  },
  {
    icon: 'lock',
    title: 'Reliable & Private',
    description: 'Your data is secure and always confidential.',
  },
];

export function FeatureCardsVisual() {
  const theme = useTheme();

  return (
    <View style={styles.container}>
      {FEATURES.map((item) => (
        <View
          key={item.title}
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={[styles.iconBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Icon name={item.icon} size={20} color={theme.gold} />
          </View>
          <View style={styles.textContainer}>
            <ThemedText style={[styles.title, { color: theme.text }]}>
              {item.title}
            </ThemedText>
            <ThemedText style={[styles.description, { color: theme.textSecondary }]}>
              {item.description}
            </ThemedText>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 4,
    gap: Spacing.md,
    marginTop: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: Spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
