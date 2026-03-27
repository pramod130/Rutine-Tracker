import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabits } from '../context/HabitContext';

const { width } = Dimensions.get('window');

const QUOTES = [
  "Small daily improvements lead to staggering long-term results.",
  "Discipline is choosing between what you want now and what you want most.",
  "The secret of your future is hidden in your daily routine.",
  "We are what we repeatedly do. Excellence is a habit.",
  "Don't wish for it. Work for it. Every single day.",
];

export default function ProfileScreen() {
  const { habits, getTotalStats, resetData } = useHabits();
  const stats = getTotalStats();
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const handleReset = () => {
    Alert.alert('Reset Data', 'Clear all tracked data? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: resetData },
    ]);
  };

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={s.header}><Text style={s.title}>Profile</Text></View>

        {/* Avatar */}
        <View style={s.avatar}>
          <Text style={{ fontSize: 72 }}>🧠</Text>
          <Text style={s.name}>Champion</Text>
          <Text style={s.sub}>Discipline Seeker</Text>
        </View>

        {/* Stats grid */}
        <View style={s.grid}>
          <View style={[s.card, { backgroundColor: '#fde8d8' }]}>
            <Text style={{ fontSize: 24 }}>📅</Text>
            <Text style={s.cardVal}>{stats.totalDays}</Text>
            <Text style={s.cardLabel}>Days tracked</Text>
          </View>
          <View style={[s.card, { backgroundColor: '#dceeff' }]}>
            <Text style={{ fontSize: 24 }}>✅</Text>
            <Text style={s.cardVal}>{stats.totalDone}</Text>
            <Text style={s.cardLabel}>Total done</Text>
          </View>
          <View style={[s.card, { backgroundColor: '#ddf4e4' }]}>
            <Text style={{ fontSize: 24 }}>💯</Text>
            <Text style={s.cardVal}>{stats.perfectDays}</Text>
            <Text style={s.cardLabel}>Perfect days</Text>
          </View>
          <View style={[s.card, { backgroundColor: '#fde4ee' }]}>
            <Text style={{ fontSize: 24 }}>🎯</Text>
            <Text style={s.cardVal}>{habits.length}</Text>
            <Text style={s.cardLabel}>Active habits</Text>
          </View>
        </View>

        {/* Quote */}
        <View style={s.quoteCard}>
          <Text style={s.quoteTitle}>Daily Quote ✨</Text>
          <Text style={s.quoteText}>"{quote}"</Text>
        </View>

        {/* Reset */}
        <View style={s.quoteCard}>
          <Text style={s.quoteTitle}>Reset Data</Text>
          <Text style={{ fontSize: 12, color: '#999', marginBottom: 12, fontWeight: '600' }}>
            Clear all tracked data and start fresh
          </Text>
          <TouchableOpacity style={s.resetBtn} onPress={handleReset}>
            <Text style={s.resetText}>🗑️ Reset All Data</Text>
          </TouchableOpacity>
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
  avatar: { alignItems: 'center', paddingVertical: 24 },
  name: { fontSize: 22, fontWeight: '900', color: '#1a1a1a', marginTop: 8 },
  sub: { fontSize: 13, fontWeight: '600', color: '#999', marginTop: 2 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 },
  card: { width: (width - 52) / 2, borderRadius: 18, padding: 18, gap: 4 },
  cardVal: { fontSize: 32, fontWeight: '900', color: '#1a1a1a' },
  cardLabel: { fontSize: 12, fontWeight: '700', color: '#666' },
  quoteCard: {
    margin: 20, marginBottom: 0, padding: 20,
    backgroundColor: '#fff', borderRadius: 18,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  quoteTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 10 },
  quoteText: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', lineHeight: 22, fontStyle: 'italic' },
  resetBtn: {
    width: '100%', padding: 13, borderRadius: 12,
    borderWidth: 2, borderColor: '#ff4444', backgroundColor: '#fff', alignItems: 'center',
  },
  resetText: { fontSize: 14, fontWeight: '800', color: '#ff4444' },
});
