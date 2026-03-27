import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Animated, Alert, Dimensions, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useHabits, todayStr, dateStr } from '../context/HabitContext';
import HabitModal from '../components/HabitModal';

const { width } = Dimensions.get('window');
const COLORS = { bg: '#fdf6f0', peach: '#f5ddd0', orange: '#c94f1e', text: '#1a1a1a', text2: '#666', text3: '#999' };
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MOODS = ['😢', '😕', '😐', '🙂', '😄'];

function getWeekDates() {
  const today = new Date();
  const dow = today.getDay();
  const mondayOffset = dow === 0 ? -6 : 1 - dow;
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + mondayOffset + i);
    return {
      label: DAY_NAMES[i],
      num: d.getDate(),
      str: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`,
    };
  });
}

function formatDate(d = new Date()) {
  return d.toLocaleDateString('en-GB', { weekday:'long', day:'numeric', month:'long', year:'numeric' });
}

export default function HomeScreen({ navigation }) {
  const { habits, toggleCompletion, isCompleted, getDayPct, getDayDone, getStreak, logMood, getMood } = useHabits();
  const [selectedDate, setSelectedDate] = useState(todayStr());
  const [modalVisible, setModalVisible] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const checkAnims = useRef({}).current;

  const getAnim = (id) => {
    if (!checkAnims[id]) checkAnims[id] = new Animated.Value(1);
    return checkAnims[id];
  };

  const handleToggle = useCallback((habitId) => {
    const anim = getAnim(habitId);
    Animated.sequence([
      Animated.timing(anim, { toValue: 0.8, duration: 80, useNativeDriver: true }),
      Animated.spring(anim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    toggleCompletion(habitId, selectedDate);
  }, [selectedDate, toggleCompletion]);

  const weekDates = getWeekDates();
  const todayStats = { pct: getDayPct(selectedDate), done: getDayDone(selectedDate), total: habits.length };
  const currentMood = getMood(selectedDate);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ---- Header ---- */}
        <View style={styles.header}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Morning, Champion 👋</Text>
            <Text style={styles.dateText}>{formatDate()}</Text>
          </View>
          <TouchableOpacity style={styles.statsBtn} onPress={() => navigation.navigate('Stats')}>
            <Ionicons name="bar-chart" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* ---- Calendar Strip ---- */}
        <View style={styles.calStrip}>
          {weekDates.map(d => {
            const isToday = d.str === todayStr();
            const isSel = d.str === selectedDate;
            const hasDots = getDayPct(d.str) > 0;
            return (
              <TouchableOpacity key={d.str} onPress={() => setSelectedDate(d.str)} style={styles.calDay} activeOpacity={0.7}>
                <Text style={[styles.calDayName, isToday && { color: COLORS.orange }]}>{d.label}</Text>
                <View style={[styles.calNumWrap, isToday && styles.calNumActive]}>
                  <Text style={[styles.calNum, isToday && styles.calNumActiveText]}>{d.num}</Text>
                </View>
                <View style={[styles.calDot, { opacity: hasDots ? 1 : 0 }]} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ---- Progress Banner ---- */}
        <View style={styles.progressBanner}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressPct}>{todayStats.pct}%</Text>
            <Text style={styles.progressSub}>{todayStats.done}/{todayStats.total}</Text>
          </View>
          <View style={styles.progressRight}>
            <Text style={styles.progressLabel}>
              {todayStats.pct === 100 ? '🏆 Perfect day!' : todayStats.pct >= 70 ? '🔥 Keep going!' : '💪 Let\'s go!'}
            </Text>
            <View style={styles.progressBarBg}>
              <View style={[styles.progressBarFill, { width: `${todayStats.pct}%` }]} />
            </View>
            <Text style={styles.progressHint}>{todayStats.done} habits done today</Text>
          </View>
        </View>

        {/* ---- Mood Logger ---- */}
        <View style={styles.moodCard}>
          <Text style={styles.moodTitle}>How are you feeling?</Text>
          <View style={styles.moodRow}>
            {MOODS.map((m, i) => (
              <TouchableOpacity key={i} onPress={() => logMood(i, selectedDate)} style={[styles.moodBtn, currentMood === i && styles.moodBtnActive]}>
                <Text style={styles.moodEmoji}>{m}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ---- Reminder Card ---- */}
        <View style={styles.reminderCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.reminderTitle}>Set the reminder 🔔</Text>
            <Text style={styles.reminderSub}>Never miss your routine!{'\n'}Set a reminder to stay on track</Text>
            <TouchableOpacity style={styles.setBtn} onPress={() => Alert.alert('⏰ Reminder', 'Reminder set for 7:00 AM!')}>
              <Text style={styles.setBtnText}>Set Now</Text>
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 48 }}>🔔</Text>
        </View>

        {/* ---- Habit List ---- */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily routine</Text>
            <TouchableOpacity onPress={() => { setEditingHabit(null); setModalVisible(true); }}>
              <Text style={styles.addLink}>+ Add</Text>
            </TouchableOpacity>
          </View>

          {habits.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 48, marginBottom: 12 }}>✨</Text>
              <Text style={{ fontWeight: '700', color: COLORS.text2 }}>No habits yet!</Text>
              <Text style={{ fontSize: 12, color: COLORS.text3, marginTop: 4 }}>Tap + to add your first habit</Text>
            </View>
          ) : (
            habits.map(habit => {
              const done = isCompleted(habit.id, selectedDate);
              const streak = getStreak(habit.id);
              const anim = getAnim(habit.id);
              return (
                <TouchableOpacity
                  key={habit.id}
                  style={[styles.habitItem, { borderLeftColor: habit.color }]}
                  onPress={() => handleToggle(habit.id)}
                  onLongPress={() => { setEditingHabit(habit); setModalVisible(true); }}
                  activeOpacity={0.85}
                >
                  {/* Check circle */}
                  <Animated.View style={[styles.checkCircle, done && { backgroundColor: habit.color, borderColor: habit.color }, { transform: [{ scale: anim }] }]}>
                    {done && <Ionicons name="checkmark" size={16} color="#fff" strokeWidth={3} />}
                  </Animated.View>

                  {/* Icon box */}
                  <View style={[styles.habitIconBox, { backgroundColor: habit.color + '22' }]}>
                    <Text style={{ fontSize: 22 }}>{habit.icon}</Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.habitName, done && styles.habitNameDone]}>{habit.name}</Text>
                    {streak > 0
                      ? <View style={styles.streakBadge}><Text style={styles.streakText}>🔥 {streak} day streak</Text></View>
                      : <Text style={styles.habitSub}>Streak 0 days</Text>}
                  </View>

                  {/* Frequency */}
                  <View style={[styles.freqBadge, { backgroundColor: habit.color + '18' }]}>
                    <Ionicons name="time-outline" size={12} color={habit.color} />
                    <Text style={[styles.freqText, { color: habit.color }]}>{habit.freq}</Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={styles.fab} onPress={() => { setEditingHabit(null); setModalVisible(true); }}>
        <Text style={{ color: '#fff', fontSize: 28, lineHeight: 32 }}>+</Text>
      </TouchableOpacity>

      {/* Modal */}
      <HabitModal
        visible={modalVisible}
        habit={editingHabit}
        onClose={() => { setModalVisible(false); setEditingHabit(null); }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fdf6f0' },
  scroll: { flex: 1 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 8,
    backgroundColor: '#f5ddd0',
  },
  greeting: { flex: 1 },
  greetingText: { fontSize: 24, fontWeight: '900', color: '#1a1a1a' },
  dateText: { fontSize: 13, color: '#666', marginTop: 2, fontWeight: '600' },
  statsBtn: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: '#c94f1e',
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#c94f1e', shadowOpacity: 0.4, shadowRadius: 8, elevation: 5,
  },
  calStrip: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 16,
    backgroundColor: '#f5ddd0',
  },
  calDay: { alignItems: 'center', gap: 4, minWidth: 40 },
  calDayName: { fontSize: 11, fontWeight: '700', color: '#999', textTransform: 'uppercase' },
  calNumWrap: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  calNumActive: { backgroundColor: '#c94f1e', shadowColor: '#c94f1e', shadowOpacity: 0.4, shadowRadius: 6, elevation: 4 },
  calNum: { fontSize: 17, fontWeight: '800', color: '#1a1a1a' },
  calNumActiveText: { color: '#fff' },
  calDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#c94f1e' },
  progressBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    marginHorizontal: 20, marginTop: 16, padding: 16,
    backgroundColor: '#fff', borderRadius: 18,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  progressCircle: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: '#fde8d8', alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: '#c94f1e',
  },
  progressPct: { fontSize: 18, fontWeight: '900', color: '#c94f1e' },
  progressSub: { fontSize: 11, fontWeight: '700', color: '#999' },
  progressRight: { flex: 1 },
  progressLabel: { fontSize: 15, fontWeight: '800', color: '#1a1a1a', marginBottom: 6 },
  progressBarBg: { height: 8, backgroundColor: '#f0ebe6', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: '#c94f1e', borderRadius: 4 },
  progressHint: { fontSize: 12, color: '#999', fontWeight: '600', marginTop: 4 },
  moodCard: {
    marginHorizontal: 20, marginTop: 14, padding: 16,
    backgroundColor: '#fff', borderRadius: 18,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  moodTitle: { fontSize: 14, fontWeight: '800', color: '#1a1a1a', marginBottom: 10 },
  moodRow: { flexDirection: 'row', justifyContent: 'space-around' },
  moodBtn: { padding: 6, borderRadius: 12 },
  moodBtnActive: { backgroundColor: '#fde8d8', borderWidth: 2, borderColor: '#c94f1e' },
  moodEmoji: { fontSize: 26 },
  reminderCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    marginHorizontal: 20, marginTop: 14, padding: 18,
    backgroundColor: '#f9ece3', borderRadius: 18,
  },
  reminderTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 4 },
  reminderSub: { fontSize: 12, color: '#666', lineHeight: 18, fontWeight: '600' },
  setBtn: {
    marginTop: 10, backgroundColor: '#7a3010',
    paddingHorizontal: 20, paddingVertical: 9, borderRadius: 10, alignSelf: 'flex-start',
  },
  setBtnText: { color: '#fff', fontWeight: '800', fontSize: 14 },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '900', color: '#1a1a1a' },
  addLink: { fontSize: 14, fontWeight: '700', color: '#c94f1e' },
  emptyState: { alignItems: 'center', padding: 40 },
  habitItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 18, padding: 14,
    marginBottom: 10, borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  checkCircle: {
    width: 30, height: 30, borderRadius: 15,
    borderWidth: 2.5, borderColor: '#ddd',
    alignItems: 'center', justifyContent: 'center',
  },
  habitIconBox: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  habitName: { fontSize: 15, fontWeight: '800', color: '#1a1a1a' },
  habitNameDone: { textDecorationLine: 'line-through', opacity: 0.5 },
  habitSub: { fontSize: 12, color: '#999', fontWeight: '600', marginTop: 2 },
  streakBadge: { backgroundColor: '#fff3e0', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 3 },
  streakText: { fontSize: 11, fontWeight: '800', color: '#e65100' },
  freqBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  freqText: { fontSize: 11, fontWeight: '700' },
  fab: {
    position: 'absolute', bottom: 20, right: 24,
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: '#c94f1e', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#c94f1e', shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
  },
});
