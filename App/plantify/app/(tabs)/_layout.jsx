import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router';
import { Colors } from '../../assets/Color';
import Ionicons from '@expo/vector-icons/Ionicons';

const TabLayout = () => {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: "#86B049", 
      tabBarInactiveTintColor: "#9CA3AF",
      tabBarStyle: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        elevation: 4,
        borderRadius: 30,
        height: 65,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      tabBarItemStyle: {
        padding: 5,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 8,
      }
    }}>
      <Tabs.Screen name='home' options={{
        title: "Home",
        tabBarIcon: ({ color }) => (
          <Ionicons name="home-outline" size={24} color={color} />
        )
      }} />
      <Tabs.Screen name='camera' options={{
        title: "",
        tabBarStyle: { display: 'none' },
        tabBarIcon: ({ color }) => (
          <View style={{
            width: 56,
            height: 56,
            backgroundColor: '#86B049',
            borderRadius: 28,
            marginBottom: 30,
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#86B049',
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 5,
          }}>
            <Ionicons name="camera" size={24} color="white" />
          </View>
        )
      }} />
      <Tabs.Screen name='profile' options={{
        title: "Profile",
        tabBarIcon: ({ color }) => (
          <Ionicons name="person-outline" size={24} color={color} />
        )
      }} />
    </Tabs>
  )
}

export default TabLayout;