import { View, Text, ActivityIndicator, Alert } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter, useLocalSearchParams } from "expo-router"
import { AuthService } from '../src/services/authService';

const ResetPasswordHandler = () => {
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        // Get token from URL parameters
        const urlToken = params.token;
        if (urlToken) {
            // Navigate to the reset password screen with the token
            router.replace(`/(auth)/reset_password?token=${urlToken}`);
        } else {
            Alert.alert('Error', 'Invalid reset link. Please request a new password reset.', [
                { text: 'OK', onPress: () => router.replace('/(auth)/forgot_password') }
            ]);
        }
    }, [params.token]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#e8f3e8' }}>
            <ActivityIndicator size="large" color="#86B049" />
            <Text style={{ color: '#86B049', fontSize: 18, marginTop: 16 }}>Redirecting...</Text>
        </View>
    );
};

export default ResetPasswordHandler;
