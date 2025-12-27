import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Shield } from 'lucide-react-native';

interface PINEntryProps {
  onSuccess: (pin: string, isDecoy: boolean) => void;
  onCancel: () => void;
  mode: 'unlock' | 'setup' | 'verify';
  title?: string;
}

export default function PINEntry({
  onSuccess,
  onCancel,
  mode,
  title,
}: PINEntryProps) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  const [error, setError] = useState('');

  const handleNumberPress = (num: string) => {
    setError('');

    if (step === 'enter') {
      if (pin.length < 6) {
        setPin(pin + num);
      }
    } else {
      if (confirmPin.length < 6) {
        setConfirmPin(confirmPin + num);
      }
    }
  };

  const handleDelete = () => {
    setError('');
    if (step === 'enter') {
      setPin(pin.slice(0, -1));
    } else {
      setConfirmPin(confirmPin.slice(0, -1));
    }
  };

  const handleClear = () => {
    setError('');
    setPin('');
    setConfirmPin('');
    setStep('enter');
  };

  useEffect(() => {
    if (mode === 'unlock' && pin.length === 6) {
      setTimeout(() => {
        onSuccess(pin, false);
      }, 100);
    } else if (mode === 'setup' && step === 'enter' && pin.length === 6) {
      setStep('confirm');
    } else if (mode === 'setup' && step === 'confirm' && confirmPin.length === 6) {
      if (pin === confirmPin) {
        onSuccess(pin, false);
      } else {
        setError('PINs do not match');
        setConfirmPin('');
      }
    } else if (mode === 'verify' && pin.length === 6) {
      setTimeout(() => {
        onSuccess(pin, false);
      }, 100);
    }
  }, [pin, confirmPin, mode, step, onSuccess]);

  const renderDots = () => {
    const currentPin = step === 'enter' ? pin : confirmPin;
    return (
      <View style={styles.dotsContainer}>
        {[...Array(6)].map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i < currentPin.length && styles.dotFilled]}
          />
        ))}
      </View>
    );
  };

  const getTitle = () => {
    if (title) return title;
    if (mode === 'setup') {
      return step === 'enter' ? 'Create PIN' : 'Confirm PIN';
    }
    return 'Enter PIN';
  };

  const buttons = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', '←'],
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Shield size={48} color="#fff" />
        <Text style={styles.title}>{getTitle()}</Text>
        {mode === 'setup' && step === 'enter' && (
          <Text style={styles.subtitle}>Choose a 6-digit PIN</Text>
        )}
        {mode === 'setup' && step === 'confirm' && (
          <Text style={styles.subtitle}>Re-enter your PIN</Text>
        )}
      </View>

      {renderDots()}

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.keypad}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keypadRow}>
            {row.map((button, colIndex) => {
              if (button === '') {
                return <View key={colIndex} style={styles.keypadButton} />;
              }

              if (button === '←') {
                return (
                  <TouchableOpacity
                    key={colIndex}
                    style={styles.keypadButton}
                    onPress={handleDelete}>
                    <Text style={styles.keypadButtonText}>{button}</Text>
                  </TouchableOpacity>
                );
              }

              return (
                <TouchableOpacity
                  key={colIndex}
                  style={styles.keypadButton}
                  onPress={() => handleNumberPress(button)}>
                  <Text style={styles.keypadButtonText}>{button}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        {pin.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#fff',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 8,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginBottom: 20,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#333',
    backgroundColor: 'transparent',
  },
  dotFilled: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  error: {
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 14,
  },
  keypad: {
    marginTop: 20,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20,
  },
  keypadButton: {
    width: 75,
    height: 75,
    borderRadius: 37.5,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keypadButtonText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '300',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 40,
  },
  cancelButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  cancelButtonText: {
    color: '#999',
    fontSize: 16,
  },
  clearButton: {
    paddingHorizontal: 30,
    paddingVertical: 12,
  },
  clearButtonText: {
    color: '#ff9500',
    fontSize: 16,
  },
});
