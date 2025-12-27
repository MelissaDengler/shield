import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Modal,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Shield,
  Users,
  Bell,
  Lock,
  Trash2,
  ChevronRight,
  Plus,
  X,
  AlertTriangle,
} from 'lucide-react-native';
import { StorageService } from '@/services/storageService';
import { PanicService } from '@/services/panicService';
import { CryptoService } from '@/services/cryptoService';
import { EmergencyContact, SafetyCheckIn } from '@/types';
import { DISCLAIMER_TEXT } from '@/constants/defaultData';

export default function SettingsScreen() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [checkIn, setCheckIn] = useState<SafetyCheckIn | null>(null);
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [checkInModalVisible, setCheckInModalVisible] = useState(false);
  const [disclaimerVisible, setDisclaimerVisible] = useState(false);

  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [newContactPrimary, setNewContactPrimary] = useState(false);
  const [newContactSMS, setNewContactSMS] = useState(true);
  const [newContactCall, setNewContactCall] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const savedContacts = await StorageService.getContacts();
    setContacts(savedContacts);

    const savedCheckIn = await StorageService.getCheckIn();
    if (!savedCheckIn) {
      const defaultCheckIn: SafetyCheckIn = {
        id: CryptoService.generateId(),
        scheduledTime: '20:00',
        enabled: false,
        gracePeriodMinutes: 60,
      };
      await StorageService.saveCheckIn(defaultCheckIn);
      setCheckIn(defaultCheckIn);
    } else {
      setCheckIn(savedCheckIn);
    }
  };

  const handleAddContact = async () => {
    if (!newContactName.trim() || !newContactPhone.trim()) {
      Alert.alert('Error', 'Please enter name and phone number');
      return;
    }

    const newContact: EmergencyContact = {
      id: CryptoService.generateId(),
      name: newContactName.trim(),
      phone: newContactPhone.trim(),
      isPrimary: newContactPrimary,
      sendSMS: newContactSMS,
      callOnPanic: newContactCall,
    };

    const updatedContacts = [...contacts, newContact];
    await StorageService.saveContacts(updatedContacts);
    setContacts(updatedContacts);

    setContactModalVisible(false);
    resetContactForm();

    Alert.alert(
      'Contact Added',
      'Would you like to send them a test message?',
      [
        { text: 'Not Now', style: 'cancel' },
        {
          text: 'Send Test',
          onPress: () => PanicService.sendTestAlert(newContact),
        },
      ]
    );
  };

  const resetContactForm = () => {
    setNewContactName('');
    setNewContactPhone('');
    setNewContactPrimary(false);
    setNewContactSMS(true);
    setNewContactCall(false);
  };

  const handleDeleteContact = (id: string) => {
    Alert.alert(
      'Delete Contact',
      'Are you sure you want to remove this emergency contact?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedContacts = contacts.filter(
              (contact) => contact.id !== id
            );
            await StorageService.saveContacts(updatedContacts);
            setContacts(updatedContacts);
          },
        },
      ]
    );
  };

  const toggleCheckIn = async () => {
    if (checkIn) {
      const updated = { ...checkIn, enabled: !checkIn.enabled };
      await StorageService.saveCheckIn(updated);
      setCheckIn(updated);
    }
  };

  const handleWipeData = () => {
    Alert.alert(
      'Wipe All Data',
      'This will permanently delete ALL data including contacts, evidence, and settings. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Wipe Everything',
          style: 'destructive',
          onPress: async () => {
            await StorageService.wipeAllData();
            Alert.alert(
              'Data Wiped',
              'All data has been permanently deleted.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          <Text style={styles.sectionSubtitle}>
            These people will be alerted when you trigger panic
          </Text>

          {contacts.map((contact) => (
            <View key={contact.id} style={styles.contactCard}>
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactPhone}>{contact.phone}</Text>
                <View style={styles.contactBadges}>
                  {contact.isPrimary && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Primary</Text>
                    </View>
                  )}
                  {contact.sendSMS && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>SMS</Text>
                    </View>
                  )}
                  {contact.callOnPanic && (
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>Call</Text>
                    </View>
                  )}
                </View>
              </View>
              <TouchableOpacity
                onPress={() => handleDeleteContact(contact.id)}
                style={styles.deleteButton}>
                <Trash2 size={20} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setContactModalVisible(true)}>
            <Plus size={20} color="#ff9500" />
            <Text style={styles.addButtonText}>Add Contact</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Check-in</Text>
          <Text style={styles.sectionSubtitle}>
            Get reminders to check in regularly
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Bell size={20} color="#ff9500" />
              <Text style={styles.settingText}>Enable Check-ins</Text>
            </View>
            <Switch
              value={checkIn?.enabled || false}
              onValueChange={toggleCheckIn}
              trackColor={{ false: '#333', true: '#ff9500' }}
              thumbColor="#fff"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={() => setDisclaimerVisible(true)}>
            <View style={styles.settingInfo}>
              <Shield size={20} color="#ff9500" />
              <Text style={styles.settingText}>Safety Information</Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingRow}
            onPress={handleWipeData}>
            <View style={styles.settingInfo}>
              <Trash2 size={20} color="#ff3b30" />
              <Text style={[styles.settingText, { color: '#ff3b30' }]}>
                Wipe All Data
              </Text>
            </View>
            <ChevronRight size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Shield v1.0</Text>
          <Text style={styles.footerSubtext}>
            Your safety and privacy matter
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={contactModalVisible}
        animationType="slide"
        onRequestClose={() => setContactModalVisible(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => {
                setContactModalVisible(false);
                resetContactForm();
              }}>
              <X size={24} color="#999" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            <TouchableOpacity onPress={handleAddContact}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Contact name"
              placeholderTextColor="#666"
              value={newContactName}
              onChangeText={setNewContactName}
              autoCapitalize="words"
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <TextInput
              style={styles.textInput}
              placeholder="+1 (555) 000-0000"
              placeholderTextColor="#666"
              value={newContactPhone}
              onChangeText={setNewContactPhone}
              keyboardType="phone-pad"
            />

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Primary Contact</Text>
              <Switch
                value={newContactPrimary}
                onValueChange={setNewContactPrimary}
                trackColor={{ false: '#333', true: '#ff9500' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Send SMS on Panic</Text>
              <Switch
                value={newContactSMS}
                onValueChange={setNewContactSMS}
                trackColor={{ false: '#333', true: '#ff9500' }}
                thumbColor="#fff"
              />
            </View>

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Call on Panic</Text>
              <Switch
                value={newContactCall}
                onValueChange={setNewContactCall}
                trackColor={{ false: '#333', true: '#ff9500' }}
                thumbColor="#fff"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>

      <Modal
        visible={disclaimerVisible}
        animationType="slide"
        onRequestClose={() => setDisclaimerVisible(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <View style={{ width: 24 }} />
            <Text style={styles.modalTitle}>Safety Information</Text>
            <TouchableOpacity onPress={() => setDisclaimerVisible(false)}>
              <X size={24} color="#999" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.disclaimerIcon}>
              <AlertTriangle size={48} color="#ff9500" />
            </View>
            <Text style={styles.disclaimerText}>{DISCLAIMER_TEXT}</Text>
          </ScrollView>
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
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  contactCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
  },
  contactPhone: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
  },
  contactBadges: {
    flexDirection: 'row',
    gap: 6,
  },
  badge: {
    backgroundColor: '#ff950020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    color: '#ff9500',
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ff9500',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff9500',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#fff',
  },
  footer: {
    alignItems: 'center',
    padding: 40,
    paddingBottom: 100,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  footerSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  modal: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#1c1c1e',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  modalSave: {
    fontSize: 16,
    color: '#ff9500',
    fontWeight: '600',
  },
  modalContent: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: '#fff',
  },
  disclaimerIcon: {
    alignItems: 'center',
    marginVertical: 20,
  },
  disclaimerText: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
  },
});
