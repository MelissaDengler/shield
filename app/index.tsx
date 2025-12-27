import { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Alert } from 'react-native';
import { router } from 'expo-router';
import Calculator from '@/components/Calculator';
import PINEntry from '@/components/PINEntry';
import { StorageService } from '@/services/storageService';
import { DEFAULT_SETTINGS } from '@/constants/defaultData';

export default function Index() {
  const [showUnlock, setShowUnlock] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const [isSetupMode, setIsSetupMode] = useState(false);

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    const settings = await StorageService.getSettings();
    const hasPIN = await StorageService.getSecure('shield_real_pin');

    if (!hasPIN) {
      // Set default PIN to 252525
      await StorageService.setPIN('252525');
    }

    if (!settings) {
      // Initialize settings without showing PIN setup
      const defaultSettings = {
        ...DEFAULT_SETTINGS,
        firstLaunch: false,
      };
      await StorageService.saveSettings(defaultSettings);
      setIsFirstLaunch(false);
    } else {
      setIsFirstLaunch(false);
    }
  };

  const handleUnlockTrigger = () => {
    setShowUnlock(true);
  };

  const handlePINSuccess = async (pin: string, isDecoy: boolean) => {
    if (isSetupMode && isFirstLaunch) {
      // Save the PIN
      await StorageService.setPIN(pin);
      
      const settings = {
        ...DEFAULT_SETTINGS,
        firstLaunch: false,
      };
      await StorageService.saveSettings(settings);
      await StorageService.setUnlocked(true);

      Alert.alert(
        'Welcome to Shield',
        'Your safety app is now set up. Long-press "0" on the calculator to access the app.',
        [
          {
            text: 'Continue',
            onPress: () => {
              setShowUnlock(false);
              setIsSetupMode(false);
              setIsFirstLaunch(false);
              router.replace('/(tabs)');
            },
          },
        ]
      );
    } else if (isDecoy) {
      Alert.alert('Calculator', 'This is the decoy mode.');
      setShowUnlock(false);
    } else {
      // Verify the PIN
      const isValid = await StorageService.verifyPIN(pin);
      if (!isValid) {
        Alert.alert('Incorrect PIN', 'Please try again.');
        setShowUnlock(false);
        return;
      }
      
      await StorageService.setUnlocked(true);
      setShowUnlock(false);
      router.replace('/(tabs)');
    }
  };

  const handlePINCancel = () => {
    if (!isFirstLaunch) {
      setShowUnlock(false);
    }
  };

  return (
    <View style={styles.container}>
      <Calculator onUnlockTrigger={handleUnlockTrigger} />

      <Modal
        visible={showUnlock}
        animationType="slide"
        onRequestClose={() => {
          if (!isFirstLaunch) {
            setShowUnlock(false);
          }
        }}>
        <PINEntry
          mode={isSetupMode ? 'setup' : 'unlock'}
          title={
            isSetupMode
              ? 'Set Your PIN'
              : 'Enter PIN to Access'
          }
          onSuccess={handlePINSuccess}
          onCancel={handlePINCancel}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
