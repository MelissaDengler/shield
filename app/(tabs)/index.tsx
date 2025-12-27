import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertCircle, MapPin, Users, CheckCircle } from 'lucide-react-native';
import { PanicService } from '@/services/panicService';
import { StorageService } from '@/services/storageService';
import { LocationService } from '@/services/locationService';
import { EmergencyContact, SafetyCheckIn } from '@/types';

export default function HomeScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [checkIn, setCheckIn] = useState<SafetyCheckIn | null>(null);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [location, setLocation] = useState<string>('');

  useEffect(() => {
    loadData();
    updateLocation();
  }, []);

  const loadData = async () => {
    const savedContacts = await StorageService.getContacts();
    setContacts(savedContacts);

    const savedCheckIn = await StorageService.getCheckIn();
    setCheckIn(savedCheckIn);
  };

  const updateLocation = async () => {
    const loc = await LocationService.getLocationString();
    setLocation(loc);
  };

  const handlePanic = () => {
    Alert.alert(
      'Trigger Panic Alert?',
      'This will send emergency messages to your contacts and share your location.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: async () => {
            setIsPanicActive(true);
            try {
              await PanicService.triggerPanic();
              Alert.alert(
                'Alert Sent',
                'Emergency messages have been sent to your contacts.'
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to send alert. Please try again.');
            } finally {
              setIsPanicActive(false);
            }
          },
        },
      ]
    );
  };

  const handleCheckIn = async () => {
    if (checkIn) {
      const updatedCheckIn = {
        ...checkIn,
        lastCheckIn: Date.now(),
      };
      await StorageService.saveCheckIn(updatedCheckIn);
      setCheckIn(updatedCheckIn);
      Alert.alert('Check-in Recorded', 'Your safety check-in has been logged.');
    }
  };

  const getCheckInStatus = () => {
    if (!checkIn || !checkIn.enabled) return null;

    const now = Date.now();
    const lastCheck = checkIn.lastCheckIn || 0;
    const hoursAgo = Math.floor((now - lastCheck) / (1000 * 60 * 60));

    if (hoursAgo < 24) {
      return {
        status: 'safe',
        text: `Last check-in: ${hoursAgo}h ago`,
      };
    }

    return {
      status: 'overdue',
      text: 'Check-in overdue',
    };
  };

  const checkInStatus = getCheckInStatus();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Shield</Text>
          <Text style={styles.subtitle}>Your Safety Hub</Text>
        </View>

        <TouchableOpacity
          style={[styles.panicButton, isPanicActive && styles.panicButtonActive]}
          onPress={handlePanic}
          disabled={isPanicActive}>
          <AlertCircle size={48} color="#fff" />
          <Text style={styles.panicButtonText}>
            {isPanicActive ? 'Sending Alert...' : 'PANIC'}
          </Text>
          <Text style={styles.panicButtonSubtext}>
            Hold to trigger emergency alert
          </Text>
        </TouchableOpacity>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color="#ff9500" />
            <Text style={styles.statValue}>{contacts.length}</Text>
            <Text style={styles.statLabel}>Emergency Contacts</Text>
          </View>

          <View style={styles.statCard}>
            <MapPin size={24} color="#ff9500" />
            <Text style={styles.statValue}>
              {location ? 'Active' : 'Off'}
            </Text>
            <Text style={styles.statLabel}>Location</Text>
          </View>
        </View>

        {checkIn && checkIn.enabled && (
          <View style={styles.checkInCard}>
            <View style={styles.checkInHeader}>
              <CheckCircle
                size={24}
                color={checkInStatus?.status === 'safe' ? '#34c759' : '#ff3b30'}
              />
              <View style={styles.checkInInfo}>
                <Text style={styles.checkInTitle}>Safety Check-in</Text>
                <Text style={styles.checkInStatus}>
                  {checkInStatus?.text || 'Not yet checked in'}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.checkInButton}
              onPress={handleCheckIn}>
              <Text style={styles.checkInButtonText}>Check In Now</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Quick Tips</Text>
          <Text style={styles.infoText}>
            • Use the Panic button only in real emergencies{'\n'}
            • Keep your emergency contacts updated{'\n'}
            • Document evidence regularly in the Vault{'\n'}
            • Review your Escape Plan frequently{'\n'}
            • Call 10111 (SAPS) or 112 if in immediate danger
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 4,
  },
  panicButton: {
    backgroundColor: '#ff3b30',
    margin: 20,
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#ff3b30',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  panicButtonActive: {
    backgroundColor: '#cc2e25',
  },
  panicButtonText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginTop: 12,
  },
  panicButtonSubtext: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    textAlign: 'center',
  },
  checkInCard: {
    backgroundColor: '#1c1c1e',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  checkInHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkInInfo: {
    marginLeft: 12,
    flex: 1,
  },
  checkInTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  checkInStatus: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  checkInButton: {
    backgroundColor: '#34c759',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkInButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  infoCard: {
    backgroundColor: '#1c1c1e',
    margin: 20,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    marginBottom: 100,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 22,
  },
});
