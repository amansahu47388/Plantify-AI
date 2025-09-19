import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from "expo-router"

const reset_img = require("../../assets/images/login_img.jpg");

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const router = useRouter();

    const handleReset = () => {
        // Add reset password logic here
    }

    return (
        <View className="flex-1 bg-[#e8f3e8]">
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

                    {/* New Password Input */}
                    <Text className="mb-2 font-semibold text-gray-700">New Password</Text>
                    <View className="border border-gray-300 rounded mb-6">
                        <TextInput
                            placeholder="Enter new password"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            className="py-3 px-3 text-gray-700"
                            placeholderTextColor="#86B049"
                        />
                    </View>

                    {/* Confirm New Password Input */}
                    <Text className="mb-2 font-semibold text-gray-700">Confirm New Password</Text>
                    <View className="border border-gray-300 rounded mb-8">
                        <TextInput
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                            className="py-3 px-3 text-gray-700"
                            placeholderTextColor="#86B049"
                        />
                    </View>

                    {/* Reset Password Button */}
                    <TouchableOpacity
                        className="bg-[#86B049] py-3 rounded-full mb-6"
                        onPress={handleReset}
                    >
                        <Text className="text-white text-center font-semibold text-lg">Reset Password</Text>
                    </TouchableOpacity>

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

export default ResetPassword