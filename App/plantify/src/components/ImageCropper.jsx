import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CROP_SIZE = 224;

export default function ImageCropper({ imageUri, onCrop, onCancel }) {
  const handleResize = async () => {
    try {
      onCrop(imageUri);
    } catch (error) {
      console.error("Error resizing image:", error);
      Alert.alert("Error", "Failed to resize image. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onCancel} style={styles.cancelButton}>
          <Ionicons name="close" size={24} color="#86B049" />
        </TouchableOpacity>
        <Text style={styles.title}>Resize Image (224x224)</Text>
        <TouchableOpacity onPress={handleResize} style={styles.doneButton}>
          <Text style={styles.doneButtonText}>Resize</Text>
        </TouchableOpacity>
      </View>

      {/* Show Original Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

     
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  cancelButton: { padding: 5 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#86B049' },
  doneButton: {
    backgroundColor: '#86B049',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  doneButtonText: { color: 'white', fontWeight: '600' },
  imageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: width - 40, height: width - 40 },
  instructions: { padding: 20, backgroundColor: 'white' },
  instructionText: { textAlign: 'center', color: '#6b7280', fontSize: 14 },
});
