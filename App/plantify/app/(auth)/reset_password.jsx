import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from "expo-router"
import { AuthService } from '../../src/services/authService';
import { Ionicons } from '@expo/vector-icons';

const reset_img = require("../../assets/images/login_img.jpg");

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [tokenValid, setTokenValid] = useState(false)
    const [token, setToken] = useState('')
    const router = useRouter();
    const params = useLocalSearchParams();

    useEffect(() => {
        // Get token from URL parameters
        const urlToken = params.token;
        if (urlToken) {
            setToken(urlToken);
            verifyToken(urlToken);
        } else {
            Alert.alert('Error', 'Invalid reset link. Please request a new password reset.', [
                { text: 'OK', onPress: () => router.replace('/forgot_password') }
            ]);
        }
    }, [params.token]);

    const verifyToken = async (tokenToVerify) => {
        try {
            console.log('Verifying reset token:', tokenToVerify);
            const result = await AuthService.verifyPasswordResetToken(tokenToVerify);
            console.log('Token verification result:', result);
            if (result.success) {
                setTokenValid(true);
            } else {
                Alert.alert('Error', 'Invalid or expired reset link. Please request a new password reset.', [
                    { text: 'OK', onPress: () => router.replace('/forgot_password') }
                ]);
            }
        } catch (error) {
            console.error('Token verification error:', error);
            Alert.alert('Error', 'Failed to verify reset link. Please try again.', [
                { text: 'OK', onPress: () => router.replace('/forgot_password') }
            ]);
        }
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumbers = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        const errors = [];
        if (password.length < minLength) {
            errors.push(`Password must be at least ${minLength} characters long`);
        }
        if (!hasUpperCase) {
            errors.push('Password must contain at least one uppercase letter');
        }
        if (!hasLowerCase) {
            errors.push('Password must contain at least one lowercase letter');
        }
        if (!hasNumbers) {
            errors.push('Password must contain at least one number');
        }
        if (!hasSpecialChar) {
            errors.push('Password must contain at least one special character');
        }

        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };

    const handleReset = async () => {
        // Validation
        if (!newPassword.trim()) {
            setError("New password is required");
            return;
        }

        if (!confirmPassword.trim()) {
            setError("Please confirm your password");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Password strength validation
        const passwordValidation = validatePassword(newPassword);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.errors.join('\n'));
            return;
        }

        setError('');
        setLoading(true);

        try {
            console.log('Confirming password reset with token:', token);
            const result = await AuthService.confirmPasswordReset(token, newPassword);
            console.log('Password reset confirmation result:', result);
            
            if (result.success) {
                Alert.alert(
                    'Success!',
                    'Your password has been reset successfully. You can now login with your new password.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.replace('/login')
                        }
                    ]
                );
            } else {
                setError(result.error || 'Failed to reset password');
            }
        } catch (error) {
            if (error.message.includes('Network connection failed')) {
                Alert.alert(
                    'Connection Error',
                    'Cannot connect to backend server. Please check your connection and try again.',
                    [{ text: 'OK' }]
                );
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <View className="flex-1 bg-[#e8f3e8]">
            {/* Header with back button */}
            <View style={styles.header}>
                <TouchableOpacity 
                    style={styles.backButton} 
                    onPress={() => router.back()}
                    activeOpacity={0.7}
                >
                    <Ionicons name="arrow-back" size={24} color="#86B049" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Reset Password</Text>
                <View style={styles.headerSpacer} />
            </View>
            
            {/* Top Image */}
            <View className="w-full h-48 relative">
                <Image
                    source={reset_img}
                    className="w-full h-full rounded-b-3xl"
                    style={{ resizeMode: 'cover' }}
                />
            </View>

            {/* White rounded container for form */}
            <View className="absolute top-36 left-0 right-0 px-6">
                <View className="bg-white rounded-2xl p-6 shadow-lg">
                    <Text className="text-3xl font-semibold mb-8 text-[#86B049] text-center">Reset Your Password</Text>

                    {!tokenValid ? (
                        <View className="py-8">
                            <Text className="text-center text-gray-600 mb-4">Verifying reset link...</Text>
                            <ActivityIndicator size="large" color="#86B049" />
                        </View>
                    ) : (
                        <>
                            {/* New Password Input */}
                            <Text className="mb-2 font-semibold text-gray-700">New Password</Text>
                            <View className="flex-row items-center border border-gray-300 rounded mb-6">
                                <TextInput
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChangeText={setNewPassword}
                                    secureTextEntry={!showPassword}
                                    className="flex-1 py-3 px-3 text-gray-700"
                                    placeholderTextColor="#86B049"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="px-3"
                                >
                                    <Ionicons 
                                        name={showPassword ? "eye-off" : "eye"} 
                                        size={22} 
                                        color="#86B049" 
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Confirm New Password Input */}
                            <Text className="mb-2 font-semibold text-gray-700">Confirm New Password</Text>
                            <View className="flex-row items-center border border-gray-300 rounded mb-6">
                                <TextInput
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry={!showConfirmPassword}
                                    className="flex-1 py-3 px-3 text-gray-700"
                                    placeholderTextColor="#86B049"
                                />
                                <TouchableOpacity
                                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="px-3"
                                >
                                    <Ionicons 
                                        name={showConfirmPassword ? "eye-off" : "eye"} 
                                        size={22} 
                                        color="#86B049" 
                                    />
                                </TouchableOpacity>
                            </View>

                            {/* Error Message */}
                            {error ? (
                                <Text className="text-red-600 text-center mb-4 text-sm">{error}</Text>
                            ) : null}

                            {/* Reset Password Button */}
                            <TouchableOpacity
                                className={`py-3 rounded-full mb-6 shadow ${loading ? 'bg-gray-400' : 'bg-[#86B049]'}`}
                                onPress={handleReset}
                                disabled={loading}
                            >
                                {loading ? (
                                    <View className="flex-row items-center justify-center">
                                        <ActivityIndicator color="white" size="small" />
                                        <Text className="text-white text-center font-semibold text-lg ml-2">Resetting...</Text>
                                    </View>
                                ) : (
                                    <Text className="text-white text-center font-semibold text-lg">Reset Password</Text>
                                )}
                            </TouchableOpacity>
                        </>
                    )}

                    {/* Return to Login Link */}
                    <View className="flex-row justify-center mt-2">
                        <TouchableOpacity onPress={() => router.push('/login')}>
                            <Text className="text-[#86B049] font-semibold">Return to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    headerSpacer: {
        width: 40,
    },
});

export default ResetPassword
