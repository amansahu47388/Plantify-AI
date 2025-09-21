import { View, Text, SafeAreaView, TextInput, ScrollView, TouchableOpacity, Image , StatusBar} from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AuthService } from '../../src/services/authService'
import { useFocusEffect } from '@react-navigation/native'
import { useRouter } from 'expo-router'
// import { clearIPCache, updateAPIConfig } from '../../src/utils/ipDetector'

const categories = [
  { id: 1, name: 'Corn', icon: '🌾' },
  { id: 2, name: 'Soyabean', icon: '🌿' },
  { id: 3, name: 'Tomato', icon: '🍅' },
]

const commonProblems = [
  { id: 1, title: 'Corn Rust',Image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDys1fCM5R_YINuk-2wVDTuW7Bk7JOc6gXYQ&s' },
  { id: 2, title: 'Corn healthy',Image:'https://img.freepik.com/premium-photo/green-corn-green-maize-plants_667565-1690.jpg' },
  { id: 3, title: 'Soyabean Leaf Spot',Image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpZ1bV13__jL8TbrlPp0dNZCH4SmpNI06fZA&'},
  { id: 4, title: 'Soyabean Yellow Virus',Image:'https://us-central1-plantix-8e0ce.cloudfunctions.net/v1/image/w400/8861dfc6-8726-4d5f-8633-1286e098ffcf' },
  { id: 5, title: 'Tomato Leaf Spot',Image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8oylhFwmLFqCDAkmevZ-LRIL8dQqQLOsPjg&s' },
  { id: 6, title: 'Tomato healthy',Image:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7IdXm7B8JFL-ttRnCfsW-IPSpdniZmHmKpA&s' },
  { id: 7, title: 'Tomato Bacterial',Image:'https://www.shutterstock.com/image-photo/septoria-tomatoes-tomato-leaves-affected-600nw-1757382077.jpg'}
]


const Home = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUserProfile();
  }, []);

  // Refresh profile when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadUserProfile();
    }, [])
  );

  const loadUserProfile = async () => {
    setProfileLoading(true);
    try {
      // First try to get from API
      const profileResponse = await AuthService.getProfile();
      
      if (profileResponse.success && profileResponse.data) {
        const userData = profileResponse.data;
       
        // Set profile image if available
        if (userData.profile_image) {
          setProfileImage(userData.profile_image);
          await AsyncStorage.setItem('profileImage', userData.profile_image);
        }
      } else {
        // Fallback to stored data if API fails
        const storedImage = await AsyncStorage.getItem('profileImage');
        
        if (storedImage) {
          setProfileImage(storedImage);
        }
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      
      // Fallback to stored data on error
      try {
        const storedImage = await AsyncStorage.getItem('profileImage')
        
        if (storedImage) {
          setProfileImage(storedImage);
        }
      } catch (storageError) {
        console.error('Error loading stored profile data:', storageError);
      }
    } finally {
      setProfileLoading(false);
    }
  };

  // const refreshNetworkConfig = async () => {
  //   try {
  //     console.log('🔄 Refreshing network configuration...');
  //     await clearIPCache();
  //     await updateAPIConfig();
  //     console.log('✅ Network configuration refreshed');
  //   } catch (error) {
  //     console.error('Error refreshing network config:', error);
  //   }
  // };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="px-4 pt-12">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                Plantify-AI
              </Text>
              <Text className="text-lg text-gray-800">
                Find Crop Diseases
              </Text>
            </View>
            <View className="flex-row items-center space-x-2">
              <TouchableOpacity onPress={() => router.push('/(tabs)/my_profile')}>
                {profileLoading ? (
                  <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                    <Ionicons name="refresh" size={20} color="#6B7280" />
                  </View>
                ) : profileImage ? (
                  <Image 
                    source={{ uri: profileImage }} 
                    className="w-12 h-12 rounded-full"
                    style={{ width: 48, height: 48, borderRadius: 24 }} 
                  />
                ) : (
                  <View className="w-12 h-12 rounded-full bg-gray-200 items-center justify-center">
                    <Ionicons name="person" size={24} color="#6B7280" />
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Categories */}
          <Text className="text-xl font-semibold mb-4">Categories</Text>
          <View className="flex-row justify-between mb-6">
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id}
                className="items-center"
              >
                <View className="w-16 h-16 bg-[#e8f3e8] rounded-full items-center justify-center mb-2">
                  <Text className="text-2xl">{category.icon}</Text>
                </View>
                <Text className="text-sm text-gray-600">{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mission Card */}
          <View className="bg-[#e8f3e8] p-4 rounded-2xl mb-6">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              Health of your plants it's our mission
            </Text>
            <Text className="text-gray-600">
              Send us photos of the plant for detection and you will get an 
              information whether the plant is healthy or ill and it's available to 
              multiple plant diseases.
            </Text>
          </View>

          {/* Common Problems */}
          <Text className="text-xl font-semibold mb-4">Common Problems</Text>
<View className="flex-row flex-wrap justify-between">
  {commonProblems.map((problem) => (
    <TouchableOpacity 
      key={problem.id}
      className="w-[48%] mb-4"
    >
                <View className="w-full h-32 rounded-xl mb-2 bg-gray-200 overflow-hidden">
      <Image 
        source={{ uri: problem.Image }}
                    className="w-full h-full"
        resizeMode="cover"
                    onError={() => console.log('Image failed to load:', problem.title)}
      />
                </View>
                <Text className="text-gray-800 font-medium text-center">{problem.title}</Text>
    </TouchableOpacity>
  ))}
</View>
        </View>
        <StatusBar barStyle="loght-content" backgroundColor={"#86B049"} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home 