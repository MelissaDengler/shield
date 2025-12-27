import { HelpResource } from '@/types';

export const DEFAULT_HELP_RESOURCES: HelpResource[] = [
  {
    id: '1',
    name: 'SAPS Emergency',
    type: 'police',
    phone: '10111',
    available24h: true,
    description: 'South African Police Service emergency response. Also dial 112 from mobile phones. Call immediately if you are in immediate danger.',
  },
  {
    id: '2',
    name: 'GBVCC - Gender-Based Violence Command Centre',
    type: 'hotline',
    phone: '0800 428 428',
    available24h: true,
    description: '24/7 national GBV support. Also SMS "help" to 31531. Free, confidential support for gender-based violence.',
  },
  {
    id: '3',
    name: 'Stop Gender Violence',
    type: 'counseling',
    phone: '0800 150 150',
    available24h: true,
    description: 'Counselling & referrals for gender-based violence. Free and confidential support.',
  },
  {
    id: '4',
    name: 'NSM - National Shelter Movement',
    type: 'shelter',
    phone: '0800 001 005',
    available24h: true,
    description: 'Shelter placement support. Assistance finding safe accommodation in Cape Town and across South Africa.',
  },
  {
    id: '5',
    name: 'POWA - People Opposing Women Abuse',
    type: 'counseling',
    phone: '011 642 4345',
    available24h: false,
    description: 'Women abuse support services. Counselling, legal advice, and support for survivors.',
  },
  {
    id: '6',
    name: 'Childline',
    type: 'hotline',
    phone: '116',
    available24h: true,
    description: 'Abuse support & counselling for children. Free, confidential helpline for children and youth.',
  },
  {
    id: '7',
    name: 'FAMSA - Family and Marriage Society',
    type: 'counseling',
    phone: '073 213 3831',
    available24h: false,
    description: 'Family & trauma counselling. Support for families affected by domestic violence.',
  },
  {
    id: '8',
    name: 'Tears Foundation',
    type: 'counseling',
    phone: '010 590 5920',
    available24h: true,
    description: 'Crisis intervention and support. Free counselling and assistance for survivors of rape and abuse.',
  },
  {
    id: '9',
    name: 'SAPS FCS - Family Violence, Child Protection & Sexual Offences',
    type: 'police',
    phone: '012 393 2107',
    available24h: false,
    description: 'Specialized police unit for reporting and protection. Dedicated unit for GBV and child protection cases.',
  },
  {
    id: '10',
    name: 'Lifeline',
    type: 'counseling',
    phone: '0861 322 322',
    available24h: true,
    description: 'General counselling and support. Free, confidential emotional support and crisis intervention.',
  },
  {
    id: '11',
    name: 'SADAG - South African Depression and Anxiety Group',
    type: 'counseling',
    phone: '0800 567 567',
    available24h: true,
    description: 'Suicide prevention and trauma support. Mental health support and counselling services.',
  },
];

export const DEFAULT_ESCAPE_PLAN_TEMPLATE = [
  {
    category: 'safe-place' as const,
    text: 'Identify a safe place to go (friend, family, shelter)',
  },
  {
    category: 'safe-place' as const,
    text: 'Keep spare keys to house and car',
  },
  {
    category: 'document' as const,
    text: 'Birth certificates',
  },
  {
    category: 'document' as const,
    text: 'ID book or Smart ID card',
  },
  {
    category: 'document' as const,
    text: 'Driver\'s license',
  },
  {
    category: 'document' as const,
    text: 'Bank/credit card information',
  },
  {
    category: 'document' as const,
    text: 'Medical aid card and medical records',
  },
  {
    category: 'document' as const,
    text: 'Protection orders or court documents',
  },
  {
    category: 'essential' as const,
    text: 'Medications',
  },
  {
    category: 'essential' as const,
    text: 'Phone charger',
  },
  {
    category: 'essential' as const,
    text: 'Cash/emergency money (Rands)',
  },
  {
    category: 'essential' as const,
    text: 'Change of clothes',
  },
  {
    category: 'contact' as const,
    text: 'Emergency contact numbers written down',
  },
  {
    category: 'other' as const,
    text: 'Children\'s needs (clothes, toys, comfort items)',
  },
  {
    category: 'other' as const,
    text: 'Pet carrier and supplies',
  },
];

export const DEFAULT_SETTINGS = {
  disguiseMode: true,
  appName: 'Calculator',
  biometricEnabled: false,
  panicGesture: 'long-press' as const,
  emergencyMessage: 'I need help. This is my location:',
  firstLaunch: true,
};

export const DISCLAIMER_TEXT = `
⚠️ IMPORTANT SAFETY INFORMATION

Shield is designed to help you stay safer, but it is NOT a replacement for emergency services.

• If you are in immediate danger, call 10111 (SAPS) or 112 from a mobile phone
• This app works best when you have a safety plan
• Consider consulting with a domestic violence advocate or GBV support service
• Your safety is the top priority

This app stores data locally on your device. If someone has access to your device, they may be able to access this app with enough time and technical knowledge.

Take additional precautions:
• Use a strong PIN
• Enable disguise mode
• Clear app regularly
• Have a safety plan
• Keep emergency numbers memorized or written down separately
`.trim();
