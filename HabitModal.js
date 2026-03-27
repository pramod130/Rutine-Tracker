import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TouchableOpacity,
  TextInput, ScrollView, TouchableWithoutFeedback, Alert,
} from 'react-native';
import { useHabits } from '../context/HabitContext';

const EMOJIS = ['💪','📚','🧘','💧','🥗','😴','🏃','🎯','✍️','🎨','🎵','💊','🧹','📱','🛒','🌿','🚿','📝','🍎','🏋️','☕','🎮','🐕','🌅','🧠'];
const COLORS = ['#c94f1e','#e91e63','#9c27b0','#3f51b5','#2196f3','#00bcd4','#009688','#4caf50','#ff9800','#607d8b'];
const FREQS = ['Daily', '3x/week', 'Weekdays', 'Weekends', 'Weekly'];

export default function HabitModal({ visible, habit, onClose }) {
  const { addHabit, updateHabit, deleteHabit } = useHabits();
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(EMOJIS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [freq, setFreq] = useState('Daily');

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setIcon(habit.icon);
      setColor(habit.color);
      setFreq(habit.freq);
    } else {
      setName('');
      setIcon(EMOJIS[0]);
      setColor(COLORS[0]);
      setFreq('Daily');
    }
  }, [habit, visible]);

  const handleSave = async () => {
    if (!name.trim()) { Alert.alert('⚠️', 'Please enter a habit name'); return; }
    if (habit) {
      await updateHabit(habit.id, { name: name.trim(), icon, color, freq });
    } else {
      await addHabit({ name: name.trim(), icon, color, freq });
    }
    onClose();
  };

  const handleDelete = () => {
    Alert.alert('Delete Habit', `Delete "${habit?.name}"? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteHabit(habit.id); onClose(); } },
    ]);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              <View style={styles.handle} />
              <Text style={styles.title}>{habit ? 'Edit Habit' : 'Add New Habit'}</Text>

              <ScrollView showsVerticalScrollIndicator={false}>
                {/* Name input */}
                <Text style={styles.label}>HABIT NAME</Text>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Morning Run"
                  placeholderTextColor="#ccc"
                  maxLength={30}
                />

                {/* Icon picker */}
                <Text style={styles.label}>ICON</Text>
                <View style={styles.emojiGrid}>
                  {EMOJIS.map(e => (
                    <TouchableOpacity
                      key={e}
                      style={[styles.emojiBtn, icon === e && styles.emojiBtnActive]}
                      onPress={() => setIcon(e)}
                    >
                      <Text style={{ fontSize: 22 }}>{e}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Color picker */}
                <Text style={styles.label}>COLOR</Text>
                <View style={styles.colorRow}>
                  {COLORS.map(c => (
                    <TouchableOpacity
                      key={c}
                      style={[styles.colorBtn, { backgroundColor: c }, color === c && styles.colorBtnActive]}
                      onPress={() => setColor(c)}
                    />
                  ))}
                </View>

                {/* Frequency picker */}
                <Text style={styles.label}>FREQUENCY</Text>
                <View style={styles.freqRow}>
                  {FREQS.map(f => (
                    <TouchableOpacity
                      key={f}
                      style={[styles.freqBtn, freq === f && { borderColor: color, backgroundColor: color + '18' }]}
                      onPress={() => setFreq(f)}
                    >
                      <Text style={[styles.freqText, freq === f && { color }]}>{f}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Save */}
                <TouchableOpacity style={[styles.saveBtn, { backgroundColor: color }]} onPress={handleSave}>
                  <Text style={styles.saveBtnText}>Save Habit ✓</Text>
                </TouchableOpacity>

                {/* Delete */}
                {habit && (
                  <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                    <Text style={styles.deleteBtnText}>🗑️ Delete Habit</Text>
                  </TouchableOpacity>
                )}
                <View style={{ height: 20 }} />
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#fff', borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 24, maxHeight: '85%',
  },
  handle: { width: 36, height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  title: { fontSize: 18, fontWeight: '900', color: '#1a1a1a', marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: '#999', marginBottom: 8, marginTop: 16 },
  input: {
    borderWidth: 2, borderColor: '#f0ebe6', borderRadius: 12,
    padding: 14, fontSize: 15, fontWeight: '600', color: '#1a1a1a',
    backgroundColor: '#fdf9f7',
  },
  emojiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  emojiBtn: {
    width: 44, height: 44, borderRadius: 10, borderWidth: 2, borderColor: '#f0ebe6',
    alignItems: 'center', justifyContent: 'center', backgroundColor: '#fdf9f7',
  },
  emojiBtnActive: { borderColor: '#c94f1e', backgroundColor: '#fde8d8' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  colorBtn: { width: 34, height: 34, borderRadius: 17, borderWidth: 3, borderColor: 'transparent' },
  colorBtnActive: { borderColor: '#1a1a1a', transform: [{ scale: 1.15 }] },
  freqRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  freqBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 2, borderColor: '#f0ebe6', backgroundColor: '#fdf9f7',
  },
  freqText: { fontSize: 12, fontWeight: '700', color: '#999' },
  saveBtn: {
    width: '100%', padding: 15, borderRadius: 14, alignItems: 'center',
    marginTop: 20, shadowColor: '#c94f1e', shadowOpacity: 0.35, shadowRadius: 10, elevation: 5,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },
  deleteBtn: {
    width: '100%', padding: 13, borderRadius: 12, alignItems: 'center',
    marginTop: 10, borderWidth: 2, borderColor: '#ff4444', backgroundColor: '#fff',
  },
  deleteBtnText: { fontSize: 14, fontWeight: '800', color: '#ff4444' },
});
