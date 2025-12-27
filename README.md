# Shield - Personal Safety App

Shield is a discreet personal safety application designed to help individuals at risk of domestic violence stay safe, document evidence, and access support resources.

## ⚠️ Critical Safety Information

**Shield is NOT a replacement for emergency services.**

- If you are in immediate danger, call 10111 (SAPS) or 112 from a mobile phone
- This app is a support tool to help with safety planning and evidence collection
- Consider consulting with a domestic violence advocate or GBV support service
- Your safety is always the top priority

## 🎯 Key Features

### 1. **Disguised Interface**
- Opens to a fully functional calculator app
- Long-press the "0" button for 2 seconds to access the safety features
- Helps maintain privacy and discretion

### 2. **Panic Alert System**
- One-tap emergency alert to trusted contacts
- Automatically sends your GPS location
- Configurable to call and/or text emergency contacts
- Works offline via SMS

### 3. **Evidence Vault**
- Encrypted storage for photos, notes, and audio
- Automatic timestamp and location tagging
- Separate PIN protection
- Export functionality for legal purposes

### 4. **Escape Plan Builder**
- Pre-loaded checklist of essential items
- Track important documents, contacts, and supplies
- Customizable categories
- Progress tracking

### 5. **Local Help Directory**
- Curated list of support resources
- National hotlines available 24/7
- One-tap calling and directions
- Distance-based sorting

### 6. **Safety Check-ins**
- Regular safety check-in reminders
- Missed check-in alerts (coming soon)
- Configurable schedule and grace period

## 🚀 Getting Started

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd shield
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open in:
- **Web Browser**: Press `w`
- **iOS Simulator**: Press `i` (Mac only)
- **Android Emulator**: Press `a`
- **Physical Device**: Scan the QR code with Expo Go app

### First Launch Setup

1. The app opens to a calculator interface
2. On first launch, you'll be prompted to create a 6-digit PIN
3. This PIN will be required to access the safety features
4. After setup, long-press the "0" button on the calculator to unlock

## 📱 Building for Production

### Web Deployment on Vercel

The app is configured for deployment on Vercel. To deploy:

1. **Install Vercel CLI** (optional, for local testing):
```bash
npm i -g vercel
```

2. **Deploy to Vercel**:
   - Option A: Connect your GitHub repository to Vercel
     - Go to [vercel.com](https://vercel.com)
     - Click "New Project"
     - Import your GitHub repository
     - Vercel will auto-detect the settings from `vercel.json`
     - Click "Deploy"
   
   - Option B: Deploy via CLI
     ```bash
     vercel
     ```

3. **Build Configuration**:
   - Build Command: `npm run build:web`
   - Output Directory: `dist`
   - Framework Preset: Other (auto-detected from vercel.json)

4. **Local Build Test**:
```bash
npm run build:web
```

The output will be in the `dist` folder. The `vercel.json` file includes:
- Proper SPA routing rewrites
- Security headers
- Static asset caching

### Android APK

To create a production Android build:

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Configure EAS:
```bash
eas build:configure
```

3. Build APK:
```bash
eas build --platform android --profile preview
```

### iOS Build

```bash
eas build --platform ios
```

Note: You'll need an Apple Developer account for iOS builds.

## 🔐 Security & Privacy

### Data Storage
- All sensitive data is stored locally on the device
- Evidence vault uses encryption for photos and notes
- PINs are hashed using SHA-256
- No data is sent to external servers by default

### Security Features
- Separate vault PIN for evidence access
- Wipe PIN to emergency-delete all data (coming soon)
- Decoy PIN for fake content display (coming soon)
- No analytics or tracking
- Offline-first architecture

### Important Security Notes

**This app provides reasonable security for everyday scenarios, but:**

1. **Physical Access**: If someone has prolonged physical access to your device, they may be able to access the app
2. **Device Security**: Use a strong device lock screen PIN/password
3. **Backups**: Be aware that device backups may contain app data
4. **Legal Considerations**: Consult with legal counsel about evidence admissibility
5. **Not Foolproof**: No app can guarantee 100% security

### Best Practices

- Use a strong, unique PIN
- Enable disguise mode
- Regularly clear the evidence vault if needed
- Have a backup safety plan that doesn't rely on technology
- Keep the app updated
- Consider using a burner phone if high-risk

## 🏗️ Architecture

```
shield/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Main app tabs
│   │   ├── index.tsx      # Home/Dashboard
│   │   ├── vault.tsx      # Evidence vault
│   │   ├── plan.tsx       # Escape plan
│   │   ├── help.tsx       # Help resources
│   │   └── settings.tsx   # Settings & contacts
│   ├── _layout.tsx        # Root layout
│   └── index.tsx          # Calculator entry point
├── components/            # Reusable components
│   ├── Calculator.tsx     # Disguised calculator UI
│   └── PINEntry.tsx       # PIN input component
├── services/              # Business logic
│   ├── cryptoService.ts   # Encryption utilities
│   ├── storageService.ts  # Data persistence
│   ├── locationService.ts # GPS functionality
│   └── panicService.ts    # Emergency alerts
├── types/                 # TypeScript definitions
└── constants/             # Static data & config
```

## 🛠️ Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router (file-based routing)
- **Storage**:
  - AsyncStorage (general data)
  - Expo SecureStore (PINs and sensitive data)
- **Encryption**: Expo Crypto (SHA-256 hashing)
- **Location**: Expo Location
- **Images**: Expo Image Picker
- **UI**: React Native (StyleSheet)
- **Icons**: Lucide React Native

## 🗺️ Roadmap

### Phase 1 (Current - MVP)
- ✅ Disguised calculator interface
- ✅ PIN-based unlock
- ✅ Panic alert system
- ✅ Evidence vault (photos, notes)
- ✅ Escape plan builder
- ✅ Help directory
- ✅ Emergency contacts management
- ✅ Safety check-in framework

### Phase 2 (Next)
- [ ] Audio recording for evidence
- [ ] Biometric authentication (fingerprint/face)
- [ ] Decoy PIN functionality
- [ ] Wipe PIN emergency deletion
- [ ] Automatic missed check-in alerts
- [ ] Evidence export to encrypted ZIP
- [ ] App icon/name customization
- [ ] Multiple language support

### Phase 3 (Future)
- [ ] Optional encrypted cloud backup (Supabase)
- [ ] Geofencing alerts
- [ ] Silent alarm via volume buttons
- [ ] Shake-to-alert gesture
- [ ] Integration with smart home devices
- [ ] Trusted contact live location sharing
- [ ] Video evidence support
- [ ] Offline map caching for safe routes
- [ ] Anonymous usage analytics (opt-in)

### Phase 4 (Advanced)
- [ ] AI-powered threat assessment
- [ ] Integration with local law enforcement systems
- [ ] Legal document generation
- [ ] Court-ready evidence packaging
- [ ] Multi-device sync
- [ ] Wearable device integration
- [ ] Voice-activated emergency mode

## 🧪 Testing

Run type checking:
```bash
npm run typecheck
```

Run linter:
```bash
npm run lint
```

## 🤝 Contributing

This is a sensitive application dealing with personal safety. Contributions are welcome, but please:

1. Respect the gravity of the use case
2. Prioritize security and privacy
3. Use trauma-informed language
4. Test thoroughly
5. Document security implications

## 📄 License

This project is licensed under the MIT License. See LICENSE file for details.

## 🆘 Support Resources (South Africa)

### Emergency Services
- **SAPS Emergency**: 10111 or 112 (from mobile) - Call immediately if in immediate danger
- **SAPS FCS Unit**: 012 393 2107 - Family Violence, Child Protection & Sexual Offences Unit

### National Hotlines (24/7)
- **GBVCC - Gender-Based Violence Command Centre**: 0800 428 428 (SMS "help" to 31531)
- **Stop Gender Violence**: 0800 150 150 - Counselling & referrals
- **Childline**: 116 - Abuse support & counselling for children
- **Tears Foundation**: 010 590 5920 - Crisis intervention and support
- **Lifeline**: 0861 322 322 - General counselling and crisis intervention
- **SADAG**: 0800 567 567 - Suicide prevention and trauma support

### Shelter & Support Services
- **NSM - National Shelter Movement**: 0800 001 005 - Shelter placement support
- **POWA**: 011 642 4345 - People Opposing Women Abuse
- **FAMSA**: 073 213 3831 - Family & trauma counselling

### Cape Town Specific
This app is designed with Cape Town users in mind. All national services are available in Cape Town, and the app can help you find local shelters and support services in the Western Cape region.

## ⚖️ Legal Disclaimer

This software is provided "as is" without warranty of any kind. The developers are not responsible for:
- Misuse of the application
- Data loss or corruption
- Failure of safety features
- Any harm resulting from use of this app

This app is not a substitute for:
- Professional legal advice
- Mental health counseling
- Law enforcement protection
- Emergency services

Always consult with qualified professionals for legal, medical, and safety advice.

## 💝 Acknowledgments

This app was created with the goal of providing support and resources to those in difficult situations. It's inspired by real needs and built with care and respect for all users.

If you're in crisis, please reach out. You're not alone, and help is available.

---

**Remember**: Your safety matters. You deserve to feel safe and supported.
