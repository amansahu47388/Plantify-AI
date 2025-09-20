import React, { useMemo } from 'react'
import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useAuth } from '../../src/contexts/AuthContext'

const Profile = () => {
  const router = useRouter()
  const { user, logout, isLoading } = useAuth()

  // Fallback user data if user is not loaded yet
  const userData = useMemo(() => ({
    fullName: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User' : 'User',
    email: user?.email || 'user@example.com',
    avatar: user?.profile_image ? { uri: user.profile_image } : require('../../assets/images/logo_app.png'),
    headerImage: require('../../assets/images/login_img.jpg'),
  }), [user])

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              const result = await logout();
              if (result.success) {
                router.replace('/');
              } else {
                Alert.alert('Error', result.error || 'Failed to logout');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to logout');
            }
          },
        },
      ]
    );
  };

  const onPressRow = (key) => {
    switch (key) {
      case 'my-profile':
        router.push('/(tabs)/my_profile')
        break
      case 'Change Password':
        router.push('/(tabs)/change_password')
        break
     
      case 'help':
        router.push('/help')
        break
      case 'logout':
        handleLogout()
        break
      default:
        break
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerWrapper}>
          <ImageBackground source={userData.headerImage} resizeMode="cover" style={styles.headerBackground}>
            <View style={styles.headerOverlay} />
          </ImageBackground>
          <View style={styles.avatarWrapper}>
            <Image source={userData.avatar} style={styles.avatar} />
          </View>
        </View>

        <View style={styles.identityWrapper}>
          <Text style={styles.nameText}>{userData.fullName}</Text>
          <Text style={styles.emailText}>{userData.email}</Text>
        </View>

        <View style={styles.cardList}>
          <ActionRow icon="person-circle-outline" label="My Profile" onPress={() => onPressRow('my-profile')} />
          <ActionRow icon="Password-outline" label="Change Password" onPress={() => onPressRow('Change Password')} />
          <ActionRow icon="help-circle-outline" label="Help Center" onPress={() => onPressRow('help')} />
          <ActionRow icon="log-out-outline" label="Log Out" onPress={() => onPressRow('logout')} danger />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const ActionRow = ({ icon, label, onPress, danger }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.rowTouchable}>
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <Ionicons name={icon} size={22} color={danger ? '#B00020' : '#4B5563'} />
          <Text style={[styles.rowLabel, danger && { color: '#B00020' }]}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { paddingBottom: 24 },
  headerWrapper: { width: '100%', height: 180, marginBottom: 56 },
  headerBackground: { flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end' },
  headerOverlay: { height: '35%', backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  avatarWrapper: {
    position: 'absolute',
    bottom: -36,
    alignSelf: 'center',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  identityWrapper: { alignItems: 'center', marginTop: -16, marginBottom: 12 },
  nameText: { fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 4 },
  emailText: { fontSize: 12, color: '#6B7280' },
  cardList: { paddingHorizontal: 16, gap: 12 },
  rowTouchable: { borderRadius: 14, overflow: 'hidden' },
  row: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 15, color: '#111827', fontWeight: '600' },
})

export default Profile