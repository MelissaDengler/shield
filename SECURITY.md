# Security Policy

## Purpose

Shield is designed to help individuals at risk stay safe and document evidence. Security and privacy are paramount.

## Security Model

### Threat Model

Shield is designed to protect against:
- ✅ Casual device access (someone briefly using your phone)
- ✅ Accidental discovery
- ✅ Basic snooping
- ✅ Data exposure through normal app usage

Shield is NOT designed to protect against:
- ❌ Sophisticated attackers with forensic tools
- ❌ Prolonged physical access to unlocked device
- ❌ Device rooting/jailbreaking
- ❌ Malware or spyware on the device
- ❌ Network-level surveillance

### Security Features

#### 1. Data Encryption
- **PINs**: Hashed using SHA-256 before storage
- **Evidence**: Photos and notes encrypted using device encryption
- **Storage**: Uses Expo SecureStore for sensitive data (iOS Keychain, Android Keystore)

#### 2. Access Control
- **Main PIN**: Required to access app from calculator
- **Vault PIN**: Separate PIN for evidence vault
- **Biometric Auth**: Coming soon (Touch ID / Face ID)

#### 3. Disguise Mode
- App opens to a functional calculator
- Hidden unlock gesture (long-press "0" for 2 seconds)
- No visible indication of safety features

#### 4. No Remote Access
- All data stored locally
- No cloud sync by default
- No external API calls (except SMS/phone)
- No tracking or analytics

## Known Limitations

### 1. Platform Limitations
- **Web Platform**: Limited access to native APIs (SMS, calls may not work)
- **iOS**: SMS pre-fills but requires user to send
- **Android**: Better SMS integration

### 2. Encryption Caveats
- Relies on device-level encryption
- Data may be accessible if device is rooted/jailbroken
- Backups may contain unencrypted data

### 3. Physical Security
- Cannot prevent forced unlock
- Screen recording could capture PIN entry
- Device screenshots may contain sensitive info

### 4. Network Security
- SMS messages are not encrypted
- Phone calls are not encrypted
- Location sharing exposes real-time position

## Best Practices for Users

### Critical Safety Tips

1. **Device Security**
   - Use strong device lock screen (6+ digits)
   - Enable auto-lock (30 seconds or less)
   - Disable lock screen notifications for this app
   - Consider using a different phone if possible

2. **PIN Selection**
   - Use a different PIN than device unlock
   - Don't use birthdays, anniversaries, or predictable patterns
   - Change PINs if you suspect compromise
   - Don't share your PIN with anyone

3. **Regular Maintenance**
   - Clear evidence vault regularly
   - Export and backup important evidence securely
   - Update the app when new versions are available
   - Review emergency contacts periodically

4. **App Usage**
   - Don't leave app open in background
   - Clear app from recent apps after use
   - Practice unlock gesture in private
   - Be aware of surveillance (cameras, screen recording)

5. **Evidence Collection**
   - Only document what's safe to document
   - Be mindful of when/where you take photos
   - Don't risk your safety for documentation
   - Store exports in a separate, secure location

## Reporting Security Issues

If you discover a security vulnerability:

1. **DO NOT** create a public GitHub issue
2. Email: security@[yourdomain].com (if available)
3. Provide detailed description
4. Include steps to reproduce
5. Suggest a fix if possible

We will respond within 48 hours.

## Security Roadmap

### Planned Improvements

#### Short Term
- [ ] Biometric authentication
- [ ] Decoy PIN with fake data
- [ ] Emergency wipe PIN
- [ ] Enhanced encryption (AES-256)
- [ ] Secure file deletion

#### Medium Term
- [ ] End-to-end encrypted cloud backup
- [ ] Zero-knowledge architecture
- [ ] Steganography for hidden data
- [ ] Anti-forensics features
- [ ] Duress detection

#### Long Term
- [ ] Hardware security key support
- [ ] Secure enclave utilization
- [ ] Multi-factor authentication
- [ ] Dead man's switch
- [ ] Self-destructing messages

## Compliance & Standards

### Privacy Compliance
- No data collection without consent
- No third-party data sharing
- No advertising or tracking
- GDPR/CCPA compliant by design

### Security Standards
- OWASP Mobile Top 10 considerations
- Follows mobile security best practices
- Regular security audits (planned)
- Penetration testing (planned)

## Responsible Disclosure

We believe in responsible disclosure:
- Give us reasonable time to fix issues
- Don't exploit vulnerabilities
- Don't access others' data
- Coordinate public disclosure

We commit to:
- Acknowledge reports within 48 hours
- Provide status updates
- Credit researchers (if desired)
- Fix critical issues within 30 days

## Legal Considerations

### Evidence Admissibility
- Consult legal counsel about evidence collection
- Understand local laws on recording
- Chain of custody may be questioned
- Timestamps can be valuable but not foolproof

### Consent & Recording Laws
- Check local laws on audio/video recording
- Some jurisdictions require two-party consent
- Recording in certain locations may be illegal
- Consult with a lawyer before using evidence in court

## Emergency Procedures

### If Device is Compromised
1. Stop using the app immediately
2. Do not try to wipe data if unsafe
3. If safe, use emergency wipe feature (future)
4. Contact emergency contacts via another method
5. Seek help from authorities or shelter

### If PIN is Discovered
1. Change PIN immediately if safe to do so
2. Export and move critical evidence
3. Consider getting a new device
4. Update your safety plan
5. Inform trusted contacts

### If App Behavior is Suspicious
1. Stop using immediately
2. Check for device malware
3. Factory reset if necessary
4. Re-download app from official source
5. Report the issue

## Additional Resources

- [National Cyber Security Centre - Mobile Security](https://www.ncsc.gov.uk/collection/mobile-device-guidance)
- [EFF Surveillance Self-Defense](https://ssd.eff.org/)
- [Consumer Reports Security Planner](https://securityplanner.consumerreports.org/)
- [NNEDV Safety Net](https://www.techsafety.org/)

---

**Remember**: No technology is perfect. Your safety plan should never rely solely on this or any app. Always have backup plans and trusted people who can help.

**Stay Safe**: If you're in immediate danger, call emergency services (911 in US) right away.
