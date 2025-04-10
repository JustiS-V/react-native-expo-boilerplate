import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '../../src/features/auth/store/useAuth';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function DashboardScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hello, {user?.name || 'Developer'}!</Text>
      <Text style={styles.body}>Welcome to your premium React Native template.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.xl,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  body: {
    fontSize: 16,
    color: colors.textMuted,
    textAlign: 'center',
  },
});
