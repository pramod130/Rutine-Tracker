// StreakScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../context/HabitContext';

const { width } = Dimensions.get('window');

export function StreakScreen() {
  const { habits, getStreak, getTotalStats } = useHabits();
  const stats = getTotalStats();
  const bestStreak = habits.reduce((mx, h) => Math.max(mx, getStreak(h.id)), 0);

  const achievements = [
    { icon: '🌱', label: 'First Step',  desc: 'Complete 1 habit',  earned: stats.totalDone >= 1 },
    { icon: '⚡', label: 'On Fire',     desc: '3-day streak',       earned: habits.some(h => getStreak(h.id) >= 3) },
    { icon: '💎', label: 'Diamond',     desc: '7-day streak',       earned: habits.some(h => getStreak(h.id) >= 7) },
    { icon: '🏆', label: 'Champion',    desc: '30 habits done',     earned: stats.totalDone >= 30 },
  ];

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}><Text style={s.title}>🔥 Streaks</Text></View>

        {/* Best streak */}
        <View style={s.bestCard}>
          <Text style={{ fontSize: 48, marginBottom: 6 }}>🏆</Text>
          <Text style={s.bestVal}>{bestStreak}</Text>
          <Text style={s.bestLabel}>Best current streak</Text>
        </View>

        {/* Current streaks */}
        <Text style={s.sectionLabel}>Current Streaks</Text>
        {habits.map(h => {
          const streak = getStreak(h.id);
          return (
            <View key={h.id} style={s.streakCard}>
              <Text style={{ fontSize: 26 }}>{h.icon}</Text>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.habitName}>{h.name}</Text>
                <Text style={s.habitSub}>{streak > 0 ? `${streak} day streak` : 'Start today!'}</Text>
              </View>
              {streak > 0 && <>
                <Text style={{ fontSize: 20 }}>🔥</Text>
                <Text style={s.streakCount}>{streak}</Text>
              </>}
            </View>
          );
        })}

        {/* Achievements */}
        <Text style={[s.sectionLabel, { marginTop: 20 }]}>Achievements 🎖️</Text>
        <View style={s.achGrid}>
          {achievements.map((a, i) => (
            <View key={i} style={[s.achCard, { opacity: a.earned ? 1 : 0.4, backgroundColor: a.earned ? '#fde8d8' : '#dceeff' }]}>
              <Text style={{ fontSize: 28 }}>{a.icon}</Text>
              <Text style={s.achLabel}>{a.label}</Text>
              <Text style={s.achDesc}>{a.desc}</Text>
            </View>
          ))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fdf6f0' },
  header: { backgroundColor: '#f9ece3', padding: 20, alignItems: 'center' },
  title: { fontSize: 20, fontWeight: '900', color: '#1a1a1a' },
  bestCard: {
    margin: 20, padding: 24, backgroundColor: '#fff', borderRadius: 18,
    alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  bestVal: { fontSize: 48, fontWeight: '900', color: '#c94f1e' },
  bestLabel: { fontSize: 13, fontWeight: '700', color: '#999', marginTop: 4 },
  sectionLabel: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginHorizontal: 20, marginBottom: 12 },
  streakCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', borderRadius: 14, padding: 14,
    marginHorizontal: 20, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  habitName: { fontSize: 14, fontWeight: '800', color: '#1a1a1a' },
  habitSub: { fontSize: 11, fontWeight: '600', color: '#999' },
  streakCount: { fontSize: 22, fontWeight: '900', color: '#c94f1e', marginLeft: 4 },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 },
  achCard: { width: (width - 52) / 2, borderRadius: 18, padding: 18, gap: 4, alignItems: 'flex-start' },
  achLabel: { fontSize: 14, fontWeight: '800', color: '#1a1a1a' },
  achDesc: { fontSize: 11, fontWeight: '600', color: '#666' },
});

export default StreakScreen;
