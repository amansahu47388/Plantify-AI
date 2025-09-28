import React, { useMemo, useState, useEffect } from 'react'
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ImageBackground, Alert } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useAuth } from '../../src/contexts/AuthContext'
import * as ImagePicker from 'expo-image-picker'

const MyProfile = () => {
  const router = useRouter()
  const { user, updateProfile, refreshProfile, isLoading } = useAuth()

  // Initialize form data from user context
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [dob, setDob] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Update form data when user data changes
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setPhone(user.phone || '')
      setEmail(user.email || '')
      setAddress(user.address || '')
      setDob(user.dob || '')
      setBio(user.bio || '')
    }
  }, [user])

  // Get avatar source
  const avatarSource = useMemo(() => {
    if (user?.profile_image) {
      return { uri: user.profile_image }
    }
    return require('../../assets/images/logo_app.png')
  }, [user?.profile_image])

  // Request permissions for image picker
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to upload profile images!');
      }
    })();
  }, []);

  const handleImagePicker = () => {
    Alert.alert(
      'Select Profile Image',
      'Choose how you want to select your profile image',
      [
        { text: 'Camera', onPress: () => openImagePicker('camera') },
        { text: 'Photo Library', onPress: () => openImagePicker('library') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const openImagePicker = async (source) => {
    try {
      setUploadingImage(true);
      
      let result;
      if (source === 'camera') {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission Required', 'Camera permission is required to take photos!');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('profile_image', {
          uri: imageUri,
          type: 'image/jpeg',
          name: 'profile_image.jpg',
        });

        // Update profile with new image
        const updateResult = await updateProfile(formData);
        
        if (updateResult.success) {
          Alert.alert('Success', 'Profile image updated successfully!');
        } else {
          Alert.alert('Error', updateResult.error || 'Failed to update profile image');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const onSave = async () => {
    if (!firstName?.trim() || !lastName?.trim()) {
      Alert.alert('Error', 'First name and last name are required')
      return
    }
    
    // Validate phone number if provided
    if (phone.trim() && phone.trim().length !== 10) {
      Alert.alert('Error', 'Phone number must be exactly 10 digits')
      return
    }
    
    setSaving(true)
    try {
      // Build profile data, only including non-empty values
      const profileData = {
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      }
      
      // Only add optional fields if they have values
      if (phone.trim()) {
        profileData.phone = phone.trim()
      }
      if (address.trim()) {
        profileData.address = address.trim()
      }
      if (dob.trim()) {
        profileData.dob = dob.trim()
      }
      if (bio.trim()) {
        profileData.bio = bio.trim()
      }

      console.log('📝 Sending profile data:', profileData)
      const result = await updateProfile(profileData)
      console.log(' Profile update result:', result)
      
      if (result.success) {
        Alert.alert('Success', 'Profile updated successfully!')
        setIsEditing(false)
      } else {
        Alert.alert('Error', result.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const onEdit = () => {
    setIsEditing(true)
  }

  const onCancel = () => {
    setIsEditing(false)
    // Reset to current user values
    if (user) {
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setPhone(user.phone || '')
      setAddress(user.address || '')
      setDob(user.dob || '')
      setBio(user.bio || '')
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1}}>
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.headerWrapper}>
            <ImageBackground source={require('../../assets/images/nature-green-leaf-garden-summer-260nw-2478663217.webp')} resizeMode="cover" style={styles.headerBackground}>
              <View style={styles.headerOverlay} />
            </ImageBackground>
            <View style={styles.avatarWrapper}>
              <Image source={avatarSource} style={styles.avatar} />
              <TouchableOpacity 
                style={[styles.avatarEdit, uploadingImage && styles.avatarEditDisabled]} 
                activeOpacity={0.8}
                onPress={handleImagePicker}
                disabled={uploadingImage}
              >
                {uploadingImage ? (
                  <Ionicons name="hourglass" size={16} color="#fff" />
                ) : (
                  <Ionicons name="camera" size={16} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.headerEdit} onPress={isEditing ? onCancel : onEdit} activeOpacity={0.8}>
              <Ionicons name={isEditing ? "close-outline" : "create-outline"} size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Field label="First Name" iconRight="person-circle-outline">
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First name"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              returnKeyType="next"
              editable={isEditing}
            />
          </Field>

          <Field label="Last Name" iconRight="person-circle-outline">
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last name"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              returnKeyType="next"
              editable={isEditing}
            />
          </Field>

          <Field label="Phone Number" iconRight="call-outline">
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 212 555 4"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              keyboardType="phone-pad"
              returnKeyType="next"
              editable={isEditing}
            />
          </Field>

          <Field label="Address" iconRight="location-outline">
            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Address"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              autoCapitalize="sentences"
              returnKeyType="next"
              editable={isEditing}
            />
          </Field>

          <Field label="Email Address" iconRight="mail-open-outline">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="email@example.com"
              style={[styles.input, !isEditing && styles.disabledInput]}
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              editable={false}
            />
          </Field>

          <Field label="Date of Birth" iconRight="calendar-outline">
            <TextInput
              value={dob}
              onChangeText={setDob}
              placeholder="YYYY-MM-DD"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              keyboardType="numbers-and-punctuation"
              returnKeyType="next"
              editable={isEditing}
            />
          </Field>

          <Field label="Bio" iconRight="reader-outline">
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself"
              style={styles.input}
              placeholderTextColor="#9CA3AF"
              multiline
              editable={isEditing}
            />
          </Field>

          {isEditing && (
            <TouchableOpacity onPress={onSave} activeOpacity={0.9} style={[styles.saveBtn, saving && { opacity: 0.7 }]} disabled={saving || !firstName.trim() || !lastName.trim()}>
              <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const Field = ({ label, children, iconRight }) => {
  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrapper}>
        {children}
        {iconRight ? <Ionicons name={iconRight} size={18} color="#9CA3AF" /> : null}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6' },
  container: { paddingBottom: 24 },
  headerWrapper: { width: '100%', height: 180, marginBottom: 56, position: 'relative' },
  headerBackground: { flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end' },
  headerOverlay: { height: '35%', backgroundColor: 'rgba(255,255,255,0.9)', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  headerEdit: { position: 'absolute', top: 50, right: 12, zIndex: 2, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
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
  avatarEdit: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#86B049',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEditDisabled: {
    backgroundColor: '#ccc',
  },
  fieldWrapper: { marginBottom: 12, paddingHorizontal: 16 },
  fieldLabel: { fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: '600' },
  inputWrapper: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  input: { flex: 1, color: '#111827', fontSize: 14, paddingRight: 8 },
  disabledInput: { backgroundColor: '#F9FAFB', color: '#9CA3AF' },
  saveBtn: { marginTop: 12, backgroundColor: '#86B049', height: 50, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginHorizontal: 16 },
  saveText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
})

export default MyProfile
