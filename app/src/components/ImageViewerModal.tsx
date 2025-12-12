import React, { useEffect, useState } from 'react';
import { Modal, View, Image, StyleSheet, TouchableOpacity, SafeAreaView, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { getDisplayUri } from '../../imageStorage';

interface ImageViewerModalProps {
  visible: boolean;
  images: string[];
  onClose: () => void;
}

export const ImageViewerModal: React.FC<ImageViewerModalProps> = ({ visible, images, onClose }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [displayImages, setDisplayImages] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const resolveAll = async () => {
      try {
        const resolved = await Promise.all(images.map(async (img) => {
          try {
            return await getDisplayUri(img);
          } catch (e) {
            return '';
          }
        }));
        if (mounted) setDisplayImages(resolved.filter(Boolean));
      } catch (e) {
        if (mounted) setDisplayImages([]);
      }
    };
    resolveAll();
    return () => { mounted = false; };
  }, [images]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        {/* Close Button */}
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialCommunityIcons name="close" size={32} color="white" />
        </TouchableOpacity>

        {/* Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: displayImages[currentIndex] || images[currentIndex] }} style={styles.image} resizeMode="contain" />
        </View>

        {/* Navigation and Counter */}
        <View style={styles.footer}>
            {images.length > 1 && (
                <TouchableOpacity style={styles.navButton} onPress={handlePrev}>
                    <MaterialCommunityIcons name="chevron-left" size={36} color="white" />
                </TouchableOpacity>
            )}

            <Text style={styles.counterText}>{currentIndex + 1} / {images.length}</Text>
            
            {images.length > 1 && (
                <TouchableOpacity style={styles.navButton} onPress={handleNext}>
                    <MaterialCommunityIcons name="chevron-right" size={36} color="white" />
                </TouchableOpacity>
            )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '80%',
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  navButton: {
    padding: 10,
  },
  counterText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 40,
  },
});
