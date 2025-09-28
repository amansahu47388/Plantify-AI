import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { initializeAPIConfig, updateAPIBaseURL } from '../config/api';
import { updateAPIEndpoints } from '../utils/api';

const APIInitializer = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeAPI();
  }, []);

  const initializeAPI = async () => {
    try {
      console.log('🚀 Starting API initialization...');
      
      // Initialize API configuration
      const detectedIP = await initializeAPIConfig();
      
      // Update API endpoints with the detected IP
      updateAPIEndpoints();
      
      console.log('✅ API initialization completed with IP:', detectedIP);
      setIsInitialized(true);
    } catch (error) {
      console.error('❌ API initialization failed:', error);
      setError(error.message);
      setIsInitialized(true); // Still show the app, but with error
    }
  };

  // Show loading screen while initializing
  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#86B049" />
        <Text style={styles.loadingText}>Detecting network configuration...</Text>
        <Text style={styles.subText}>This may take a few seconds</Text>
      </View>
    );
  }

  // Show error if initialization failed
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>⚠️ Network Configuration Error</Text>
        <Text style={styles.errorSubText}>
          Failed to detect API server. Please check:
        </Text>
        <Text style={styles.errorSubText}>• Backend server is running</Text>
        <Text style={styles.errorSubText}>• Both devices are on same network</Text>
        <Text style={styles.errorSubText}>• Firewall settings allow connections</Text>
      </View>
    );
  }

  // Render the app once initialized
  return children;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorSubText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    textAlign: 'center',
  },
});

export default APIInitializer;
