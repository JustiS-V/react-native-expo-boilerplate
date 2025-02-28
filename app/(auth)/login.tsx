import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../src/features/auth/store/useAuth';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const { login, isLoading } = useAuth();
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    await login(email);
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to your account</Text>

        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="your.email@example.com"
          error={error}
        />

        <Button title="Login" onPress={handleLogin} loading={isLoading} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: colors.surface,
    padding: spacing.xl,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.xl,
  },
});
