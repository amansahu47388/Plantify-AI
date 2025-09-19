import React, { useMemo, useState } from 'react'
import { SafeAreaView, ScrollView, View, Text, StyleSheet, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'

const MyProfile = () => {
  const router = useRouter()

  // In a real app, hydrate from your user store/service
  const initialUser = useMemo(() => ({
    firstName: 'Aisha',
    lastName: 'Koritum',
    email: 'aishakoritum008@gmail.com',
    phone: '+1 212 555 41',
    address: '123 Green Ave, Springfield, USA',
    dob: '1996-08-12',
    bio: 'Nature lover and urban gardener.',
    avatar: require('../../assets/images/logo_app.png'),
  }), [])

  const [firstName, setFirstName] = useState(initialUser.firstName)
  const [lastName, setLastName] = useState(initialUser.lastName)
  const [phone, setPhone] = useState(initialUser.phone)
  const [email, setEmail] = useState(initialUser.email)
  const [address, setAddress] = useState(initialUser.address)
  const [dob, setDob] = useState(initialUser.dob)
  const [bio, setBio] = useState(initialUser.bio)
  const [saving, setSaving] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const onSave = async () => {
    if (!firstName?.trim() || !lastName?.trim()) return
    setSaving(true)
    try {
      // TODO: persist to backend
      await new Promise((r) => setTimeout(r, 600))
      setIsEditing(false)
    } finally {
      setSaving(false)
    }
  }

  const onEdit = () => {
    setIsEditing(true)
  }

  const onCancel = () => {
    setIsEditing(false)
    // Reset to initial values
    setFirstName(initialUser.firstName)
    setLastName(initialUser.lastName)
    setPhone(initialUser.phone)
    setAddress(initialUser.address)
    setDob(initialUser.dob)
    setBio(initialUser.bio)
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
              <Image source={initialUser.avatar} style={styles.avatar} />
              <TouchableOpacity style={styles.avatarEdit} activeOpacity={0.8}>
                <Ionicons name="camera" size={16} color="#fff" />
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
  headerEdit: { position: 'absolute', top: 10, right: 12, zIndex: 2, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center' },
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


