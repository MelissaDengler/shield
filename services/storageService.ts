import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import {
  AppSettings,
  EmergencyContact,
  EvidenceItem,
  EscapePlanItem,
  SafetyCheckIn,
} from '@/types';
import { CryptoService } from './cryptoService';

const STORAGE_KEYS = {
  SETTINGS: 'shield_settings',
  REAL_PIN_HASH: 'shield_real_pin',
  DECOY_PIN_HASH: 'shield_decoy_pin',
  WIPE_PIN_HASH: 'shield_wipe_pin',
  VAULT_PIN_HASH: 'shield_vault_pin',
  CONTACTS: 'shield_contacts',
  EVIDENCE: 'shield_evidence',
  ESCAPE_PLAN: 'shield_escape_plan',
  CHECK_IN: 'shield_check_in',
  UNLOCKED: 'shield_unlocked',
};

// Helper to check if SecureStore is available
const isSecureStoreAvailable = (): boolean => {
  return Platform.OS !== 'web' && 
         SecureStore && 
         typeof SecureStore.setItemAsync === 'function' &&
         typeof SecureStore.getItemAsync === 'function';
};

export class StorageService {
  static async setSecure(key: string, value: string): Promise<void> {
    if (isSecureStoreAvailable()) {
      try {
        await SecureStore.setItemAsync(key, value);
        return;
      } catch (error) {
        console.warn('SecureStore failed, falling back to AsyncStorage:', error);
      }
    }
    // Fallback to AsyncStorage for web or if SecureStore fails
    await AsyncStorage.setItem(key, value);
  }

  static async getSecure(key: string): Promise<string | null> {
    if (isSecureStoreAvailable()) {
      try {
        return await SecureStore.getItemAsync(key);
      } catch (error) {
        console.warn('SecureStore failed, falling back to AsyncStorage:', error);
      }
    }
    // Fallback to AsyncStorage for web or if SecureStore fails
    return await AsyncStorage.getItem(key);
  }

  static async set(key: string, value: any): Promise<void> {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }

  static async get<T>(key: string): Promise<T | null> {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  static async remove(key: string): Promise<void> {
    await AsyncStorage.removeItem(key);
  }

  static async setPIN(pin: string): Promise<void> {
    const hash = await CryptoService.hashPIN(pin);
    await this.setSecure(STORAGE_KEYS.REAL_PIN_HASH, hash);
  }

  static async verifyPIN(pin: string): Promise<boolean> {
    const storedHash = await this.getSecure(STORAGE_KEYS.REAL_PIN_HASH);
    if (!storedHash) return false;

    const hash = await CryptoService.hashPIN(pin);
    return hash === storedHash;
  }

  static async setDecoyPIN(pin: string): Promise<void> {
    const hash = await CryptoService.hashPIN(pin);
    await this.setSecure(STORAGE_KEYS.DECOY_PIN_HASH, hash);
  }

  static async verifyDecoyPIN(pin: string): Promise<boolean> {
    const storedHash = await this.getSecure(STORAGE_KEYS.DECOY_PIN_HASH);
    if (!storedHash) return false;

    const hash = await CryptoService.hashPIN(pin);
    return hash === storedHash;
  }

  static async setWipePIN(pin: string): Promise<void> {
    const hash = await CryptoService.hashPIN(pin);
    await this.setSecure(STORAGE_KEYS.WIPE_PIN_HASH, hash);
  }

  static async verifyWipePIN(pin: string): Promise<boolean> {
    const storedHash = await this.getSecure(STORAGE_KEYS.WIPE_PIN_HASH);
    if (!storedHash) return false;

    const hash = await CryptoService.hashPIN(pin);
    return hash === storedHash;
  }

  static async setVaultPIN(pin: string): Promise<void> {
    const hash = await CryptoService.hashPIN(pin);
    await this.setSecure(STORAGE_KEYS.VAULT_PIN_HASH, hash);
  }

  static async verifyVaultPIN(pin: string): Promise<boolean> {
    const storedHash = await this.getSecure(STORAGE_KEYS.VAULT_PIN_HASH);
    if (!storedHash) return false;

    const hash = await CryptoService.hashPIN(pin);
    return hash === storedHash;
  }

  static async getSettings(): Promise<AppSettings | null> {
    return await this.get<AppSettings>(STORAGE_KEYS.SETTINGS);
  }

  static async saveSettings(settings: AppSettings): Promise<void> {
    await this.set(STORAGE_KEYS.SETTINGS, settings);
  }

  static async getContacts(): Promise<EmergencyContact[]> {
    const contacts = await this.get<EmergencyContact[]>(STORAGE_KEYS.CONTACTS);
    return contacts || [];
  }

  static async saveContacts(contacts: EmergencyContact[]): Promise<void> {
    await this.set(STORAGE_KEYS.CONTACTS, contacts);
  }

  static async getEvidence(): Promise<EvidenceItem[]> {
    const evidence = await this.get<EvidenceItem[]>(STORAGE_KEYS.EVIDENCE);
    return evidence || [];
  }

  static async saveEvidence(evidence: EvidenceItem[]): Promise<void> {
    await this.set(STORAGE_KEYS.EVIDENCE, evidence);
  }

  static async getEscapePlan(): Promise<EscapePlanItem[]> {
    const plan = await this.get<EscapePlanItem[]>(STORAGE_KEYS.ESCAPE_PLAN);
    return plan || [];
  }

  static async saveEscapePlan(plan: EscapePlanItem[]): Promise<void> {
    await this.set(STORAGE_KEYS.ESCAPE_PLAN, plan);
  }

  static async getCheckIn(): Promise<SafetyCheckIn | null> {
    return await this.get<SafetyCheckIn>(STORAGE_KEYS.CHECK_IN);
  }

  static async saveCheckIn(checkIn: SafetyCheckIn): Promise<void> {
    await this.set(STORAGE_KEYS.CHECK_IN, checkIn);
  }

  static async setUnlocked(unlocked: boolean): Promise<void> {
    await this.set(STORAGE_KEYS.UNLOCKED, unlocked);
  }

  static async isUnlocked(): Promise<boolean> {
    const unlocked = await this.get<boolean>(STORAGE_KEYS.UNLOCKED);
    return unlocked || false;
  }

  static async wipeAllData(): Promise<void> {
    await AsyncStorage.clear();
    if (isSecureStoreAvailable()) {
      try {
        await SecureStore.deleteItemAsync(STORAGE_KEYS.REAL_PIN_HASH);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.DECOY_PIN_HASH);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.WIPE_PIN_HASH);
        await SecureStore.deleteItemAsync(STORAGE_KEYS.VAULT_PIN_HASH);
      } catch (error) {
        console.warn('SecureStore delete failed:', error);
      }
    } else {
      // On web, remove from AsyncStorage
      await AsyncStorage.removeItem(STORAGE_KEYS.REAL_PIN_HASH);
      await AsyncStorage.removeItem(STORAGE_KEYS.DECOY_PIN_HASH);
      await AsyncStorage.removeItem(STORAGE_KEYS.WIPE_PIN_HASH);
      await AsyncStorage.removeItem(STORAGE_KEYS.VAULT_PIN_HASH);
    }
  }
}
