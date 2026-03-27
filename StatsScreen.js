import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart } from 'react-native-chart-kit';
import { useHabits } from '../context/HabitContext';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
  const { habits, getAvgWeekPct, getWeeklyData, getMonthlyData, getHabitConsistency, getStreak } = useHabits();
  const [tab, setTab] = useState('week');

  const avgPct = getAvgWeekPct();
  const weekData = getWeeklyData();
  const monthData = getMonthlyData();
  const activeStreaks = habits.filter(h => getStreak(h.id) > 0).length;
  const longestStreak = habits.reduce((mx, h) => Math.max(mx, getStreak(h.id)), 0);

  const circumference = 251.2;
  const offset = circumference - (circumference * avgPct / 100);

  const chartData = tab === 'week'
    ? { labels: weekData.map(d => d.label), datasets: [{ data: weekData.map(d => d.done || 0) }] }
    : { labels: Array.from({ length: 6 }, (_, i) => `W${i+1}`), datasets: [{ data: Array.from({ length: 6 }, (_, i) => { let s=0; for(let j=0;j<5;j++) s+=monthData[i*5+j]?.pct||0; return Math.round(s/5); }) }] };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Statistics</Text>
        </View>

        {/* Stat cards */}
        <View style={styles.grid}>
          <View style={[styles.statCard, { backgroundColor: '#fde8d8' }]}>
            <Text style={styles.statIcon}>≡</Text>
            <Text style={styles.statVal}>{habits.length}</Text>
            <Text style={styles.statLabel}>Total Habits</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#dceeff' }]}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statVal}>{activeStreaks}</Text>
            <Text style={styles.statLabel}>Active Streaks</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fde4ee' }]}>
            <Text style={styles.statIcon}>📈</Text>
            <Text style={styles.statVal}>{avgPct}%</Text>
            <Text style={styles.statLabel}>Avg Completion</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#ddf4e4' }]}>
            <Text style={styles.statIcon}>🏆</Text>
            <Text style={styles.statVal}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Longest Streak</Text>
          </View>
        </View>

        {/* Progress ring */}
        <View style={styles.ringWrap}>
          <View style={styles.ringContainer}>
            <View style={styles.ringInner}>
              <Text style={styles.ringPct}>{avgPct}%</Text>
              <Text style={styles.ringSub}>Week avg</Text>
            </View>
          </View>
        </View>

        {/* Tab switcher */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tabBtn, tab === 'week' && styles.tabActive]} onPress={() => setTab('week')}>
            <Text style={[styles.tabText, tab === 'week' && styles.tabTextActive]}>Weekly</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, tab === 'month' && styles.tabActive]} onPress={() => setTab('month')}>
            <Text style={[styles.tabText, tab === 'month' && styles.tabTextActive]}>Monthly</Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>{tab === 'week' ? 'Weekly Progress' : 'Monthly Progress'}</Text>
          <Text style={styles.chartSub}>{tab === 'week' ? 'Completed habits in the last 7 days' : 'Avg weekly completion %'}</Text>
          <BarChart
            data={chartData}
            width={width - 72}
            height={180}
            yAxisLabel=""
            yAxisSuffix=""
            fromZero
            chartConfig={{
              backgroundColor: '#fff',
              backgroundGradientFrom: '#fff',
              backgroundGradientTo: '#fff',
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(201, 79, 30, ${opacity})`,
              labelColor: () => '#999',
              propsForBars: { rx: '6' },
              propsForBackgroundLines: { strokeDasharray: '', stroke: '#f0ebe6', strokeWidth: 1 },
            }}
            style={{ borderRadius: 12, marginLeft: -8 }}
            showValuesOnTopOfBars
            withInnerLines
          />
        </View>

        {/* Habit Consistency */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Habit Consistency</Text>
          <Text style={styles.chartSub}>Your success rate (last 7 days)</Text>
          {habits.map(h => {
            const pct = getHabitConsistency(h.id, 7);
            return (
              <View key={h.id} style={styles.consistRow}>
                <Text style={{ fontSize: 18, width: 28 }}>{h.icon}</Text>
                <Text style={styles.consistName}>{h.name}</Text>
                <View style={styles.consistBarBg}>
                  <View style={[styles.consistBarFill, { width: `${pct}%`, backgroundColor: h.color }]} />
                </View>
                <Text style={[styles.consistPct, { color: h.color }]}>{pct}%</Text>
              </View>
            );
          })}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fdf6f0' },
  scroll: { flex: 1 },
  header: {
    backgroundColor: '#f9ece3',
    paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20,
    alignItems: 'center',
  },
  title: { fontSize: 20, fontWeight: '900', color: '#1a1a1a' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, padding: 20, paddingBottom: 0 },
  statCard: {
    width: (width - 52) / 2, borderRadius: 18, padding: 18,
    gap: 4,
  },
  statIcon: { fontSize: 24 },
  statVal: { fontSize: 32, fontWeight: '900', color: '#1a1a1a' },
  statLabel: { fontSize: 12, fontWeight: '700', color: '#666' },
  ringWrap: { alignItems: 'center', marginVertical: 20 },
  ringContainer: {
    width: 110, height: 110, borderRadius: 55,
    borderWidth: 10, borderColor: '#f0ebe6',
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: '#c94f1e', shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
  },
  ringInner: { alignItems: 'center' },
  ringPct: { fontSize: 26, fontWeight: '900', color: '#1a1a1a' },
  ringSub: { fontSize: 11, fontWeight: '700', color: '#999' },
  tabs: {
    flexDirection: 'row', backgroundColor: '#f0ebe6',
    borderRadius: 12, margin: 20, marginTop: 0, padding: 4, gap: 4,
  },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 9, alignItems: 'center' },
  tabActive: { backgroundColor: '#c94f1e', shadowColor: '#c94f1e', shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  tabText: { fontSize: 14, fontWeight: '800', color: '#999' },
  tabTextActive: { color: '#fff' },
  chartCard: {
    marginHorizontal: 20, marginBottom: 14, padding: 20,
    backgroundColor: '#fff', borderRadius: 18,
    shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 3,
  },
  chartTitle: { fontSize: 16, fontWeight: '800', color: '#1a1a1a', marginBottom: 2 },
  chartSub: { fontSize: 12, fontWeight: '600', color: '#999', marginBottom: 14 },
  consistRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  consistName: { fontSize: 13, fontWeight: '700', color: '#1a1a1a', flex: 1 },
  consistBarBg: { flex: 1.5, height: 8, backgroundColor: '#f0ebe6', borderRadius: 4, overflow: 'hidden' },
  consistBarFill: { height: '100%', borderRadius: 4 },
  consistPct: { fontSize: 12, fontWeight: '800', width: 36, textAlign: 'right' },
});
