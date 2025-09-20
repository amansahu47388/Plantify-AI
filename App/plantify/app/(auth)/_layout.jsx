import React from 'react';
import { Stack } from 'expo-router';
import AuthGuard from '../../src/components/AuthGuard';

export default function AuthLayout() {
  return (
    <AuthGuard requireAuth={false}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="email_verify" />
        <Stack.Screen name="forgot_password" />
        <Stack.Screen name="reset_password" />
        <Stack.Screen name="my_profile" />
      </Stack>
    </AuthGuard>
  );
}
