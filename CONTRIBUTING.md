# Contributing to Shield

Thank you for your interest in contributing to Shield. This project is designed to help people in vulnerable situations, so we take contributions seriously and expect all contributors to maintain the highest standards of quality, security, and sensitivity.

## Code of Conduct

### Our Pledge

This project exists to support survivors of domestic violence and other vulnerable individuals. We are committed to:

- Prioritizing user safety above all else
- Maintaining strict security and privacy standards
- Using trauma-informed language and design
- Creating a welcoming environment for all contributors
- Respecting the experiences of survivors

### Expected Behavior

- Be respectful and empathetic
- Consider the real-world impact of your code
- Test thoroughly before submitting
- Document security implications
- Use inclusive, trauma-aware language
- Keep discussions constructive and professional

### Unacceptable Behavior

- Adding analytics, tracking, or telemetry without explicit consent
- Implementing features that could be weaponized
- Introducing security vulnerabilities
- Using insensitive or victim-blaming language
- Sharing details about implementation that could help abusers
- Prioritizing features over security

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Git
- Expo CLI
- A code editor (VS Code recommended)
- Understanding of React Native and Expo

### Setup Development Environment

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/your-username/shield.git
   cd shield
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Guidelines

### Security First

Every contribution must prioritize security:

1. **Review Security Implications**
   - How could this be exploited?
   - What data is exposed?
   - Are there side-channel attacks?
   - Could this reveal user presence?

2. **Data Protection**
   - Never log sensitive data
   - Use secure storage for all user data
   - Encrypt data at rest
   - Clear sensitive data from memory

3. **Testing Security**
   - Test with malicious inputs
   - Verify data isolation
   - Check for information leaks
   - Validate access controls

### Code Quality

1. **TypeScript**
   - Use strict typing
   - No `any` types without justification
   - Document complex types
   - Export types that might be reused

2. **Code Style**
   - Run `npm run lint` before committing
   - Follow existing patterns
   - Use meaningful variable names
   - Keep functions small and focused

3. **Documentation**
   - Comment complex logic
   - Update README for new features
   - Document security considerations
   - Include usage examples

4. **Testing**
   - Test all user flows
   - Test error conditions
   - Test on multiple platforms
   - Verify type safety with `npm run typecheck`

### Trauma-Informed Design

1. **Language**
   - Use empowering, not victimizing language
   - Avoid triggering terminology
   - Be clear and direct
   - Provide context and warnings

2. **UX Considerations**
   - Don't force choices
   - Provide exits and cancels
   - Use progressive disclosure
   - Avoid sudden, jarring changes
   - Consider cognitive load during crisis

3. **Features**
   - Quick exit functionality
   - Clear privacy controls
   - No shame or judgment
   - Respect autonomy

## Pull Request Process

### Before Submitting

1. **Self Review**
   - [ ] Code follows style guidelines
   - [ ] All tests pass
   - [ ] Type checking passes (`npm run typecheck`)
   - [ ] No security vulnerabilities introduced
   - [ ] Documentation updated
   - [ ] Tested on web (and mobile if possible)

2. **Commits**
   - Use clear, descriptive commit messages
   - Reference issues if applicable
   - Keep commits focused and atomic
   - Sign commits if possible

3. **Pull Request Description**
   - Explain what and why
   - List any breaking changes
   - Note security implications
   - Include screenshots for UI changes
   - Link to related issues

### Review Process

1. Maintainers will review within 1 week
2. Security review for sensitive changes
3. May request changes or additional tests
4. Once approved, PR will be merged
5. Credit will be given in release notes

## Feature Requests

### Proposing New Features

Before implementing a feature:

1. **Check if it exists** in issues or roadmap
2. **Create a discussion** to get feedback
3. **Consider security** implications
4. **Think about abuse** potential
5. **Get maintainer approval** before coding

### Feature Criteria

Features should be:
- ✅ Beneficial to user safety
- ✅ Privacy-preserving
- ✅ Difficult to abuse
- ✅ Implementable securely
- ✅ Maintainable long-term

Features should NOT:
- ❌ Expose user data
- ❌ Create attack vectors
- ❌ Require constant connection
- ❌ Depend on third parties
- ❌ Compromise disguise

## Bug Reports

### Reporting Bugs

Use the bug report template and include:

1. **Description**: What happened?
2. **Expected**: What should happen?
3. **Steps**: How to reproduce?
4. **Environment**: Platform, version, device
5. **Screenshots**: If applicable
6. **Impact**: Who is affected?

### Security Bugs

⚠️ **DO NOT** file public issues for security vulnerabilities.

Email security@[domain].com with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Areas That Need Help

### High Priority

- [ ] Audio recording for evidence vault
- [ ] Biometric authentication
- [ ] Decoy PIN implementation
- [ ] Emergency wipe feature
- [ ] Automated testing suite

### Medium Priority

- [ ] iOS native modules
- [ ] Android optimizations
- [ ] Accessibility improvements
- [ ] Internationalization (i18n)
- [ ] Better error handling

### Documentation

- [ ] User guide
- [ ] Video tutorials
- [ ] Security audit
- [ ] Deployment guide
- [ ] API documentation

## Development Principles

### 1. Offline First

The app must work without internet:
- Store all data locally
- Don't require API calls
- SMS/calls should degrade gracefully
- Cache all resources

### 2. Privacy by Design

Privacy is not optional:
- No tracking or analytics by default
- No third-party services without consent
- Data stays on device
- User controls all data

### 3. Fail Safely

Errors should not expose users:
- Graceful error handling
- No sensitive error messages
- Maintain disguise on errors
- Log errors securely

### 4. User Agency

Users must have control:
- Clear options and choices
- Ability to delete data
- Transparent about what happens
- No dark patterns

## Questions?

- Check existing issues and discussions
- Read the README and SECURITY.md
- Ask in discussions (not issues)
- Be patient and respectful

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- Release notes
- Contributors list
- Acknowledgments section (optional)

Thank you for helping make the world a safer place. Your contributions matter.
