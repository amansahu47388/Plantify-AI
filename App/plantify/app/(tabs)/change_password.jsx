import { View, Text, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from "expo-router"
import { AuthService } from '../../src/services/authService';
import { Ionicons } from '@expo/vector-icons';

const change_img = require("../../assets/images/login_img.jpg");

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter();

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

    const handleChangePassword = async () => {
        // Validation
        if (!currentPassword.trim()) {
            setError("Current password is required");
            return;
        }

        if (!newPassword.trim()) {
            setError("New password is required");
            return;
        }

        if (!confirmPassword.trim()) {
            setError("Please confirm your new password");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match");
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
            const result = await AuthService.changePassword(currentPassword, newPassword);
            
            if (result.success) {
                Alert.alert(
                    'Success!',
                    'Your password has been changed successfully.',
                    [
                        {
                            text: 'OK',
                            onPress: () => router.back()
                        }
                    ]
                );
            } else {
                setError(result.error || 'Failed to change password');
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
      
            {/* Top Image */}
            <View className="w-full h-48 relative">
                <Image
                    source={change_img}
                    className="w-full h-full rounded-b-3xl"
                    style={{ resizeMode: 'cover' }}
                />
            </View>

            {/* White rounded container for form */}
            <View className="absolute top-36 left-0 right-0 px-6">
                <View className="bg-white rounded-2xl p-6 shadow-lg">
                    <Text className="text-3xl font-semibold mb-8 text-[#86B049] text-center">Change Your Password</Text>

                    {/* Current Password Input */}
                    <Text className="mb-2 font-semibold text-gray-700">Current Password</Text>
                    <View className="flex-row items-center border border-gray-300 rounded mb-6">
                        <TextInput
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry={!showCurrentPassword}
                            className="flex-1 py-3 px-3 text-gray-700"
                            placeholderTextColor="#86B049"
                        />
                        <TouchableOpacity
                            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="px-3"
                        >
                            <Ionicons 
                                name={showCurrentPassword ? "eye-off" : "eye"} 
                                size={22} 
                                color="#86B049" 
                            />
                        </TouchableOpacity>
                    </View>

                    {/* New Password Input */}
                    <Text className="mb-2 font-semibold text-gray-700">New Password</Text>
                    <View className="flex-row items-center border border-gray-300 rounded mb-6">
                        <TextInput
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry={!showNewPassword}
                            className="flex-1 py-3 px-3 text-gray-700"
                            placeholderTextColor="#86B049"
                        />
                        <TouchableOpacity
                            onPress={() => setShowNewPassword(!showNewPassword)}
                            className="px-3"
                        >
                            <Ionicons 
                                name={showNewPassword ? "eye-off" : "eye"} 
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

                    {/* Change Password Button */}
                    <TouchableOpacity
                        className={`py-3 rounded-full mb-6 shadow ${loading ? 'bg-gray-400' : 'bg-[#86B049]'}`}
                        onPress={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <View className="flex-row items-center justify-center">
                                <ActivityIndicator color="white" size="small" />
                                <Text className="text-white text-center font-semibold text-lg ml-2">Changing...</Text>
                            </View>
                        ) : (
                            <Text className="text-white text-center font-semibold text-lg">Change Password</Text>
                        )}
                    </TouchableOpacity>

                   
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

export default ChangePassword