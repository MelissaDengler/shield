import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react-native';
import { HelpResource } from '@/types';
import { DEFAULT_HELP_RESOURCES } from '@/constants/defaultData';
import { LocationService } from '@/services/locationService';

export default function HelpScreen() {
  const [resources, setResources] = useState<HelpResource[]>([]);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  useEffect(() => {
    loadResources();
    loadLocation();
  }, []);

  const loadResources = () => {
    setResources(DEFAULT_HELP_RESOURCES);
  };

  const loadLocation = async () => {
    const location = await LocationService.getCurrentLocation();
    if (location) {
      setUserLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
    }
  };

  const handleCall = (phone: string) => {
    Alert.alert('Call ' + phone + '?', 'This will open your phone app.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          Linking.openURL(`tel:${phone}`);
        },
      },
    ]);
  };

  const handleText = (phone: string) => {
    Linking.openURL(`sms:${phone}`);
  };

  const handleDirections = (resource: HelpResource) => {
    if (resource.location) {
      const url = `https://maps.google.com/?q=${resource.location.latitude},${resource.location.longitude}`;
      Linking.openURL(url);
    }
  };

  const getDistance = (resource: HelpResource): string | null => {
    if (!userLocation || !resource.location) return null;

    const distance = LocationService.calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      resource.location.latitude,
      resource.location.longitude
    );

    if (distance < 1) {
      return `${Math.round(distance * 1000)}m away`;
    }
    return `${distance.toFixed(1)}km away`;
  };

  const getTypeColor = (type: HelpResource['type']): string => {
    const colors: Record<HelpResource['type'], string> = {
      hotline: '#ff9500',
      shelter: '#34c759',
      legal: '#007aff',
      counseling: '#af52de',
      police: '#ff3b30',
    };
    return colors[type];
  };

  const getTypeLabel = (type: HelpResource['type']): string => {
    const labels: Record<HelpResource['type'], string> = {
      hotline: 'Hotline',
      shelter: 'Shelter',
      legal: 'Legal Aid',
      counseling: 'Counseling',
      police: 'Emergency',
    };
    return labels[type];
  };

  const renderItem = ({ item }: { item: HelpResource }) => {
    const distance = getDistance(item);

    return (
      <View style={styles.resourceCard}>
        <View style={styles.resourceHeader}>
          <View style={styles.resourceTitleContainer}>
            <Text style={styles.resourceName}>{item.name}</Text>
            <View
              style={[
                styles.typeBadge,
                { backgroundColor: getTypeColor(item.type) + '20' },
              ]}>
              <Text
                style={[styles.typeText, { color: getTypeColor(item.type) }]}>
                {getTypeLabel(item.type)}
              </Text>
            </View>
          </View>
          {item.available24h && (
            <View style={styles.availableBadge}>
              <Clock size={14} color="#34c759" />
              <Text style={styles.availableText}>24/7</Text>
            </View>
          )}
        </View>

        {item.description && (
          <Text style={styles.resourceDescription}>{item.description}</Text>
        )}

        {distance && <Text style={styles.distanceText}>{distance}</Text>}

        <View style={styles.actions}>
          {item.phone && (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => handleCall(item.phone!)}>
              <Phone size={20} color="#fff" />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>
          )}

          {item.phone && item.type === 'hotline' && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => handleText(item.phone!)}>
              <MessageCircle size={20} color="#ff9500" />
              <Text style={[styles.actionText, styles.actionTextSecondary]}>
                Text
              </Text>
            </TouchableOpacity>
          )}

          {item.location && (
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => handleDirections(item)}>
              <MapPin size={20} color="#ff9500" />
              <Text style={[styles.actionText, styles.actionTextSecondary]}>
                Directions
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Help Resources</Text>
        <Text style={styles.subtitle}>Available support services</Text>
      </View>

      <View style={styles.emergencyBanner}>
        <Text style={styles.emergencyText}>
          ⚠️ If you're in immediate danger, call 10111 (SAPS) or 112 from mobile
        </Text>
      </View>

      <FlatList
        data={resources}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  emergencyBanner: {
    backgroundColor: '#ff3b3020',
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  emergencyText: {
    fontSize: 14,
    color: '#ff3b30',
    fontWeight: '600',
    textAlign: 'center',
  },
  list: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  resourceCard: {
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  resourceTitleContainer: {
    flex: 1,
  },
  resourceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  typeBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#34c75920',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availableText: {
    fontSize: 12,
    color: '#34c759',
    fontWeight: '600',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#999',
    lineHeight: 20,
    marginTop: 8,
  },
  distanceText: {
    fontSize: 14,
    color: '#ff9500',
    marginTop: 8,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#ff9500',
    padding: 12,
    borderRadius: 10,
  },
  actionButtonSecondary: {
    backgroundColor: '#2c2c2e',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  actionTextSecondary: {
    color: '#ff9500',
  },
});
