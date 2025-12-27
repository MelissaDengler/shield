import { Platform, Linking } from 'react-native';
import { EmergencyContact } from '@/types';
import { LocationService } from './locationService';
import { StorageService } from './storageService';

export class PanicService {
  static async triggerPanic(): Promise<void> {
    const contacts = await StorageService.getContacts();
    const settings = await StorageService.getSettings();

    if (contacts.length === 0) {
      console.warn('No emergency contacts configured');
      return;
    }

    const locationString = await LocationService.getLocationString();
    const message =
      settings?.emergencyMessage || 'I need help. This is my location:';
    const fullMessage = `${message} ${locationString}`;

    const primaryContact = contacts.find((c) => c.isPrimary);

    if (primaryContact?.callOnPanic && Platform.OS !== 'web') {
      await this.makeCall(primaryContact.phone);
    }

    for (const contact of contacts) {
      if (contact.sendSMS) {
        await this.sendSMS(contact.phone, fullMessage);
      }
    }
  }

  static async sendSMS(phone: string, message: string): Promise<void> {
    if (Platform.OS === 'web') {
      console.log(`[MOCK SMS] To: ${phone}, Message: ${message}`);
      return;
    }

    const url = `sms:${phone}${Platform.OS === 'ios' ? '&' : '?'}body=${encodeURIComponent(message)}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  }

  static async makeCall(phone: string): Promise<void> {
    if (Platform.OS === 'web') {
      console.log(`[MOCK CALL] To: ${phone}`);
      return;
    }

    const url = `tel:${phone}`;

    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
      await Linking.openURL(url);
    }
  }

  static async sendTestAlert(contact: EmergencyContact): Promise<void> {
    const message = `This is a test alert from Shield app. You have been added as an emergency contact.`;
    await this.sendSMS(contact.phone, message);
  }
}
