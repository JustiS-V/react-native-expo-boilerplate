import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/features/auth/store/useAuth';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{user?.email}</Text>
      <View style={styles.spacing} />
      <Button title="Logout" onPress={handleLogout} />
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
  email: {
    fontSize: 18,
    color: colors.text,
    fontWeight: '500',
  },
  spacing: {
    height: spacing.xl,
  },
});
