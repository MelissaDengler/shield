import { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';

interface CalculatorProps {
  onUnlockTrigger: () => void;
}

export default function Calculator({ onUnlockTrigger }: CalculatorProps) {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false);

  const handleNumber = (num: string) => {
    if (shouldResetDisplay) {
      setDisplay(num);
      setShouldResetDisplay(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleOperation = (op: string) => {
    const current = parseFloat(display);
    if (previousValue === null) {
      setPreviousValue(current);
    } else if (operation) {
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(result);
    }
    setOperation(op);
    setShouldResetDisplay(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+':
        return a + b;
      case '-':
        return a - b;
      case '×':
        return a * b;
      case '÷':
        return b !== 0 ? a / b : 0;
      default:
        return b;
    }
  };

  const handleEquals = () => {
    if (operation && previousValue !== null) {
      const current = parseFloat(display);
      const result = calculate(previousValue, current, operation);
      setDisplay(String(result));
      setPreviousValue(null);
      setOperation(null);
      setShouldResetDisplay(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setShouldResetDisplay(false);
  };

  const handleDecimal = () => {
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const buttons = [
    ['C', '÷', '×', '←'],
    ['7', '8', '9', '-'],
    ['4', '5', '6', '+'],
    ['1', '2', '3', '='],
    ['0', '.', '', '='],
  ];

  const handlePress = (button: string) => {
    // Check if '+' is pressed - trigger unlock
    if (button === '+') {
      onUnlockTrigger();
      return;
    }
    
    if (button === 'C') {
      handleClear();
    } else if (button === '=') {
      handleEquals();
    } else if (['-', '×', '÷'].includes(button)) {
      handleOperation(button);
    } else if (button === '.') {
      handleDecimal();
    } else if (button === '←') {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    } else if (button) {
      handleNumber(button);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText} numberOfLines={1}>
          {display}
        </Text>
      </View>

      <View style={styles.buttonGrid}>
        {buttons.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((button, colIndex) => {
              if (!button) return <View key={colIndex} style={styles.button} />;

              const isZero = button === '0';
              const isEquals = button === '=';
              const isOperation = ['+', '-', '×', '÷', 'C', '←'].includes(
                button
              );

              return (
                <Pressable
                  key={colIndex}
                  style={[
                    styles.button,
                    isZero && styles.buttonZero,
                    isEquals && styles.buttonEquals,
                    isOperation && styles.buttonOperation,
                  ]}
                  onPress={() => handlePress(button)}>
                  <Text
                    style={[
                      styles.buttonText,
                      (isEquals || isOperation) && styles.buttonTextWhite,
                    ]}>
                    {button}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 20,
  },
  display: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  displayText: {
    fontSize: 64,
    color: '#fff',
    fontWeight: '300',
  },
  buttonGrid: {
    flex: 2,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  button: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 70,
  },
  buttonZero: {
    flex: 2,
  },
  buttonEquals: {
    backgroundColor: '#ff9500',
  },
  buttonOperation: {
    backgroundColor: '#ff9500',
  },
  buttonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '400',
  },
  buttonTextWhite: {
    color: '#fff',
  },
});
