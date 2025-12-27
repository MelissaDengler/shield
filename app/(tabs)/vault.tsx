import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Camera,
  Mic,
  FileText,
  Plus,
  Lock,
  Download,
  Trash2,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { StorageService } from '@/services/storageService';
import { CryptoService } from '@/services/cryptoService';
import { LocationService } from '@/services/locationService';
import { EvidenceItem } from '@/types';
import PINEntry from '@/components/PINEntry';

export default function VaultScreen() {
  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [isLocked, setIsLocked] = useState(true);
  const [showPINEntry, setShowPINEntry] = useState(false);
  const [vaultPIN, setVaultPIN] = useState<string>('');
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [noteModalVisible, setNoteModalVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  useEffect(() => {
    checkVaultSetup();
  }, []);

  const checkVaultSetup = async () => {
    const hasVaultPIN = await StorageService.getSecure('shield_vault_pin');
    if (!hasVaultPIN) {
      setShowPINEntry(true);
    }
  };

  const handlePINSuccess = async (isDecoy: boolean) => {
    setShowPINEntry(false);
    setIsLocked(false);
    loadEvidence();
  };

  const loadEvidence = async () => {
    const savedEvidence = await StorageService.getEvidence();
    setEvidence(savedEvidence.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleAddPhoto = async () => {
    setAddModalVisible(false);

    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        'Permission Required',
        'Please grant permission to access photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      await saveEvidence('photo', result.assets[0].base64);
    }
  };

  const handleAddNote = () => {
    setAddModalVisible(false);
    setNoteModalVisible(true);
  };

  const handleSaveNote = async () => {
    if (!noteContent.trim()) {
      Alert.alert('Error', 'Please enter note content');
      return;
    }

    await saveEvidence('note', noteContent, noteTitle);
    setNoteModalVisible(false);
    setNoteTitle('');
    setNoteContent('');
  };

  const saveEvidence = async (
    type: 'photo' | 'audio' | 'note',
    content: string,
    title?: string
  ) => {
    const location = await LocationService.getCurrentLocation();

    const newItem: EvidenceItem = {
      id: CryptoService.generateId(),
      type,
      timestamp: Date.now(),
      title,
      content: type === 'note' ? content : undefined,
      filePath: type !== 'note' ? content : undefined,
      encrypted: true,
      metadata: location
        ? {
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          }
        : undefined,
    };

    const updatedEvidence = [newItem, ...evidence];
    await StorageService.saveEvidence(updatedEvidence);
    setEvidence(updatedEvidence);

    Alert.alert('Success', 'Evidence saved securely');
  };

  const handleDeleteItem = (id: string) => {
    Alert.alert('Delete Evidence', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedEvidence = evidence.filter((item) => item.id !== id);
          await StorageService.saveEvidence(updatedEvidence);
          setEvidence(updatedEvidence);
        },
      },
    ]);
  };

  const handleExport = () => {
    Alert.alert(
      'Export Evidence',
      'This will create a backup of all evidence. Keep this file secure.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Export',
          onPress: () => {
            Alert.alert(
              'Export Ready',
              'Evidence export feature will be available in a future update. All data is currently stored securely on your device.'
            );
          },
        },
      ]
    );
  };

  if (showPINEntry || isLocked) {
    return (
      <View style={styles.container}>
        <PINEntry
          mode="setup"
          title="Set Vault PIN"
          onSuccess={handlePINSuccess}
          onCancel={() => setShowPINEntry(false)}
        />
      </View>
    );
  }

  const renderItem = ({ item }: { item: EvidenceItem }) => {
    const date = new Date(item.timestamp).toLocaleDateString();
    const time = new Date(item.timestamp).toLocaleTimeString();

    const getIcon = () => {
      switch (item.type) {
        case 'photo':
          return <Camera size={24} color="#ff9500" />;
        case 'audio':
          return <Mic size={24} color="#ff9500" />;
        case 'note':
          return <FileText size={24} color="#ff9500" />;
      }
    };

    return (
      <View style={styles.evidenceItem}>
        <View style={styles.evidenceIcon}>{getIcon()}</View>
        <View style={styles.evidenceInfo}>
          <Text style={styles.evidenceTitle}>
            {item.title || `${item.type.charAt(0).toUpperCase()}${item.type.slice(1)}`}
          </Text>
          <Text style={styles.evidenceDate}>
            {date} at {time}
          </Text>
          {item.metadata?.location && (
            <Text style={styles.evidenceLocation}>Location recorded</Text>
          )}
        </View>
        <TouchableOpacity
          onPress={() => handleDeleteItem(item.id)}
          style={styles.deleteButton}>
          <Trash2 size={20} color="#ff3b30" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Evidence Vault</Text>
          <Text style={styles.subtitle}>{evidence.length} items secured</Text>
        </View>
        <TouchableOpacity onPress={handleExport}>
          <Download size={24} color="#ff9500" />
        </TouchableOpacity>
      </View>

      {evidence.length === 0 ? (
        <View style={styles.emptyState}>
          <Lock size={64} color="#333" />
          <Text style={styles.emptyTitle}>Vault is Empty</Text>
          <Text style={styles.emptyText}>
            Securely store photos, audio, and notes as evidence
          </Text>
        </View>
      ) : (
        <FlatList
          data={evidence}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={addModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAddModalVisible(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setAddModalVisible(false)}>
          <View style={styles.addModal}>
            <Text style={styles.addModalTitle}>Add Evidence</Text>

            <TouchableOpacity
              style={styles.addOption}
              onPress={handleAddPhoto}>
              <Camera size={24} color="#ff9500" />
              <Text style={styles.addOptionText}>Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.addOption} onPress={handleAddNote}>
              <FileText size={24} color="#ff9500" />
              <Text style={styles.addOptionText}>Note</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.addOption, { opacity: 0.5 }]}
              disabled>
              <Mic size={24} color="#999" />
              <Text style={[styles.addOptionText, { color: '#999' }]}>
                Audio (Coming Soon)
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={noteModalVisible}
        animationType="slide"
        onRequestClose={() => setNoteModalVisible(false)}>
        <SafeAreaView style={styles.noteModal}>
          <View style={styles.noteHeader}>
            <TouchableOpacity onPress={() => setNoteModalVisible(false)}>
              <Text style={styles.noteCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.noteTitle}>New Note</Text>
            <TouchableOpacity onPress={handleSaveNote}>
              <Text style={styles.noteSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.noteTitleInput}
            placeholder="Title (optional)"
            placeholderTextColor="#666"
            value={noteTitle}
            onChangeText={setNoteTitle}
          />

          <TextInput
            style={styles.noteContentInput}
            placeholder="Enter your note here..."
            placeholderTextColor="#666"
            value={noteContent}
            onChangeText={setNoteContent}
            multiline
            autoFocus
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  list: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  evidenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  evidenceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2c2c2e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  evidenceInfo: {
    flex: 1,
    marginLeft: 12,
  },
  evidenceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  evidenceDate: {
    fontSize: 14,
    color: '#999',
    marginTop: 2,
  },
  evidenceLocation: {
    fontSize: 12,
    color: '#ff9500',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginTop: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff9500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  addModal: {
    backgroundColor: '#1c1c1e',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  addModalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 20,
  },
  addOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2c2c2e',
    borderRadius: 12,
    marginBottom: 12,
  },
  addOptionText: {
    fontSize: 16,
    color: '#fff',
    marginLeft: 12,
    fontWeight: '500',
  },
  noteModal: {
    flex: 1,
    backgroundColor: '#000',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  noteCancel: {
    fontSize: 16,
    color: '#999',
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  noteSave: {
    fontSize: 16,
    color: '#ff9500',
    fontWeight: '600',
  },
  noteTitleInput: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  noteContentInput: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    padding: 20,
    textAlignVertical: 'top',
  },
});
