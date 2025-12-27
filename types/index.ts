export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  isPrimary: boolean;
  sendSMS: boolean;
  callOnPanic: boolean;
}

export interface EvidenceItem {
  id: string;
  type: 'photo' | 'audio' | 'note';
  timestamp: number;
  title?: string;
  content?: string;
  filePath?: string;
  encrypted: boolean;
  metadata?: {
    location?: {
      latitude: number;
      longitude: number;
    };
    duration?: number;
  };
}

export interface EscapePlanItem {
  id: string;
  category: 'safe-place' | 'document' | 'essential' | 'contact' | 'other';
  text: string;
  completed: boolean;
  order: number;
}

export interface HelpResource {
  id: string;
  name: string;
  type: 'hotline' | 'shelter' | 'legal' | 'counseling' | 'police';
  phone?: string;
  whatsapp?: string;
  address?: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  available24h: boolean;
  description?: string;
}

export interface SafetyCheckIn {
  id: string;
  scheduledTime: string;
  lastCheckIn?: number;
  enabled: boolean;
  gracePeriodMinutes: number;
}

export interface AppSettings {
  disguiseMode: boolean;
  appName: string;
  biometricEnabled: boolean;
  panicGesture: 'long-press' | 'shake' | 'volume-buttons';
  emergencyMessage: string;
  firstLaunch: boolean;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}
