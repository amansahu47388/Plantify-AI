import React, { useEffect } from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const AuthGuard = ({ children, requireAuth = true }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // User needs to be authenticated but isn't
        router.replace('/login');
      } else if (!requireAuth && isAuthenticated) {
        // User is authenticated but shouldn't be (e.g., on login/signup pages)
        router.replace('/(tabs)/home');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={{ 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center',
        backgroundColor: '#e8f3e8'
      }}>
        <ActivityIndicator size="large" color="#86B049" />
        <Text style={{ 
          marginTop: 16, 
          color: '#86B049', 
          fontSize: 16 
        }}>
          Loading...
        </Text>
      </View>
    );
  }

  // If authentication check passes, render children
  if ((requireAuth && isAuthenticated) || (!requireAuth && !isAuthenticated)) {
    return children;
  }

  // If authentication check fails, don't render anything (redirect will happen)
  return null;
};

export default AuthGuard;
