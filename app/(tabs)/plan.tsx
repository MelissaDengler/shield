import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, Check, Circle, Trash2, Edit } from 'lucide-react-native';
import { StorageService } from '@/services/storageService';
import { CryptoService } from '@/services/cryptoService';
import { EscapePlanItem } from '@/types';
import { DEFAULT_ESCAPE_PLAN_TEMPLATE } from '@/constants/defaultData';

export default function PlanScreen() {
  const [plan, setPlan] = useState<EscapePlanItem[]>([]);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<
    EscapePlanItem['category']
  >('essential');

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    let savedPlan = await StorageService.getEscapePlan();

    if (savedPlan.length === 0) {
      savedPlan = DEFAULT_ESCAPE_PLAN_TEMPLATE.map((item, index) => ({
        id: CryptoService.generateId(),
        category: item.category,
        text: item.text,
        completed: false,
        order: index,
      }));
      await StorageService.saveEscapePlan(savedPlan);
    }

    setPlan(savedPlan.sort((a, b) => a.order - b.order));
  };

  const toggleItem = async (id: string) => {
    const updatedPlan = plan.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    await StorageService.saveEscapePlan(updatedPlan);
    setPlan(updatedPlan);
  };

  const addItem = async () => {
    if (!newItemText.trim()) {
      Alert.alert('Error', 'Please enter item text');
      return;
    }

    const newItem: EscapePlanItem = {
      id: CryptoService.generateId(),
      category: selectedCategory,
      text: newItemText.trim(),
      completed: false,
      order: plan.length,
    };

    const updatedPlan = [...plan, newItem];
    await StorageService.saveEscapePlan(updatedPlan);
    setPlan(updatedPlan);

    setAddModalVisible(false);
    setNewItemText('');
  };

  const deleteItem = async (id: string) => {
    Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          const updatedPlan = plan.filter((item) => item.id !== id);
          await StorageService.saveEscapePlan(updatedPlan);
          setPlan(updatedPlan);
        },
      },
    ]);
  };

  const getCategoryIcon = (category: EscapePlanItem['category']) => {
    const colors: Record<EscapePlanItem['category'], string> = {
      'safe-place': '#34c759',
      document: '#007aff',
      essential: '#ff9500',
      contact: '#ff3b30',
      other: '#999',
    };
    return colors[category];
  };

  const getCategoryLabel = (category: EscapePlanItem['category']) => {
    const labels: Record<EscapePlanItem['category'], string> = {
      'safe-place': 'Safe Place',
      document: 'Document',
      essential: 'Essential',
      contact: 'Contact',
      other: 'Other',
    };
    return labels[category];
  };

  const getProgress = () => {
    const completed = plan.filter((item) => item.completed).length;
    const total = plan.length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const renderItem = ({ item }: { item: EscapePlanItem }) => {
    return (
      <View style={styles.planItem}>
        <TouchableOpacity onPress={() => toggleItem(item.id)}>
          {item.completed ? (
            <Check size={24} color="#34c759" />
          ) : (
            <Circle size={24} color="#666" />
          )}
        </TouchableOpacity>

        <View style={styles.planItemContent}>
          <Text
            style={[
              styles.planItemText,
              item.completed && styles.planItemTextCompleted,
            ]}>
            {item.text}
          </Text>
          <View
            style={[
              styles.categoryBadge,
              { backgroundColor: getCategoryIcon(item.category) + '20' },
            ]}>
            <Text
              style={[
                styles.categoryText,
                { color: getCategoryIcon(item.category) },
              ]}>
              {getCategoryLabel(item.category)}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => deleteItem(item.id)}
          style={styles.deleteButton}>
          <Trash2 size={20} color="#666" />
        </TouchableOpacity>
      </View>
    );
  };

  const categories: Array<{
    value: EscapePlanItem['category'];
    label: string;
  }> = [
    { value: 'safe-place', label: 'Safe Place' },
    { value: 'document', label: 'Document' },
    { value: 'essential', label: 'Essential' },
    { value: 'contact', label: 'Contact' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Escape Plan</Text>
          <Text style={styles.subtitle}>{getProgress()}% complete</Text>
        </View>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${getProgress()}%` }]} />
      </View>

      {plan.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No Items Yet</Text>
          <Text style={styles.emptyText}>
            Start building your escape plan with essential items
          </Text>
        </View>
      ) : (
        <FlatList
          data={plan}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setAddModalVisible(true)}>
        <Plus size={28} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={addModalVisible}
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}>
        <SafeAreaView style={styles.modal}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setAddModalVisible(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Item</Text>
            <TouchableOpacity onPress={addItem}>
              <Text style={styles.modalSave}>Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categorySelector}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={[
                    styles.categoryOption,
                    selectedCategory === cat.value &&
                      styles.categoryOptionSelected,
                  ]}
                  onPress={() => setSelectedCategory(cat.value)}>
                  <Text
                    style={[
                      styles.categoryOptionText,
                      selectedCategory === cat.value &&
                        styles.categoryOptionTextSelected,
                    ]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.inputLabel}>Item</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g., Pack spare house keys"
              placeholderTextColor="#666"
              value={newItemText}
              onChangeText={setNewItemText}
              multiline
              autoFocus
            />
          </View>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#999',
    marginTop: 4,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#1c1c1e',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#34c759',
  },
  list: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 100,
  },
  planItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  planItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  planItemText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  planItemTextCompleted: {
    color: '#666',
    textDecorationLine: 'line-through',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff9500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
  modalCancel: {
    fontSize: 16,
    color: '#999',
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
    marginBottom: 12,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1c1c1e',
  },
  categoryOptionSelected: {
    borderColor: '#ff9500',
    backgroundColor: '#ff950020',
  },
  categoryOptionText: {
    fontSize: 14,
    color: '#999',
  },
  categoryOptionTextSelected: {
    color: '#ff9500',
    fontWeight: '600',
  },
  textInput: {
    backgroundColor: '#1c1c1e',
    color: '#fff',
    fontSize: 16,
    padding: 16,
    borderRadius: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
});
