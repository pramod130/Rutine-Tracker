import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HabitContext = createContext();

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
export function dateStr(daysAgo = 0) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

const DEFAULT_HABITS = [
  { id: '1', name: 'Morning Meditation', icon: '🧘', color: '#9c27b0', freq: 'Daily' },
  { id: '2', name: 'Gym Workout',         icon: '💪', color: '#c94f1e', freq: '3x/week' },
  { id: '3', name: 'Daily Reading',       icon: '📚', color: '#2196f3', freq: 'Daily' },
  { id: '4', name: 'Drink 2L Water',      icon: '💧', color: '#00bcd4', freq: 'Daily' },
  { id: '5', name: 'No Junk Food',        icon: '🥗', color: '#4caf50', freq: 'Weekdays' },
];

export function HabitProvider({ children }) {
  const [habits, setHabits] = useState(DEFAULT_HABITS);
  const [completions, setCompletions] = useState({});
  const [moods, setMoods] = useState({});

  useEffect(() => {
    (async () => {
      const [h, c, m] = await Promise.all([
        AsyncStorage.getItem('dt_habits'),
        AsyncStorage.getItem('dt_completions'),
        AsyncStorage.getItem('dt_moods'),
      ]);
      if (h) setHabits(JSON.parse(h));
      if (c) setCompletions(JSON.parse(c));
      if (m) setMoods(JSON.parse(m));
    })();
  }, []);

  const saveHabits = useCallback(async (next) => {
    setHabits(next);
    await AsyncStorage.setItem('dt_habits', JSON.stringify(next));
  }, []);

  const saveCompletions = useCallback(async (next) => {
    setCompletions(next);
    await AsyncStorage.setItem('dt_completions', JSON.stringify(next));
  }, []);

  const toggleCompletion = useCallback((habitId, date = todayStr()) => {
    const key = `${date}_${habitId}`;
    const next = { ...completions, [key]: !completions[key] };
    saveCompletions(next);
  }, [completions, saveCompletions]);

  const isCompleted = useCallback((habitId, date = todayStr()) =>
    !!completions[`${date}_${habitId}`], [completions]);

  const getDayPct = useCallback((date = todayStr()) => {
    if (!habits.length) return 0;
    const done = habits.filter(h => completions[`${date}_${h.id}`]).length;
    return Math.round((done / habits.length) * 100);
  }, [habits, completions]);

  const getDayDone = useCallback((date = todayStr()) =>
    habits.filter(h => completions[`${date}_${h.id}`]).length,
  [habits, completions]);

  const getStreak = useCallback((habitId) => {
    let streak = 0, i = 0;
    while (completions[`${dateStr(i)}_${habitId}`]) { streak++; i++; }
    return streak;
  }, [completions]);

  const getHabitConsistency = useCallback((habitId, days = 7) => {
    let done = 0;
    for (let i = 0; i < days; i++)
      if (completions[`${dateStr(i)}_${habitId}`]) done++;
    return Math.round((done / days) * 100);
  }, [completions]);

  const getWeeklyData = useCallback(() => {
    const today = new Date();
    const dow = today.getDay();
    const mondayOffset = dow === 0 ? -6 : 1 - dow;
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + mondayOffset + i);
      const dStr = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
      return {
        label: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i],
        done: habits.filter(h => completions[`${dStr}_${h.id}`]).length,
        pct: getDayPct(dStr),
        isToday: dStr === todayStr(),
      };
    });
  }, [habits, completions, getDayPct]);

  const getMonthlyData = useCallback(() =>
    Array.from({ length: 30 }, (_, i) => ({ pct: getDayPct(dateStr(29 - i)) })),
  [getDayPct]);

  const getAvgWeekPct = useCallback(() => {
    let total = 0;
    for (let i = 0; i < 7; i++) total += getDayPct(dateStr(i));
    return Math.round(total / 7);
  }, [getDayPct]);

  const logMood = useCallback(async (val, date = todayStr()) => {
    const next = { ...moods, [date]: val };
    setMoods(next);
    await AsyncStorage.setItem('dt_moods', JSON.stringify(next));
  }, [moods]);

  const getMood = useCallback((date = todayStr()) => moods[date] || null, [moods]);

  const addHabit = useCallback(async (habit) => {
    await saveHabits([...habits, { id: Date.now().toString(), ...habit }]);
  }, [habits, saveHabits]);

  const updateHabit = useCallback(async (id, updates) => {
    await saveHabits(habits.map(h => h.id === id ? { ...h, ...updates } : h));
  }, [habits, saveHabits]);

  const deleteHabit = useCallback(async (id) => {
    await saveHabits(habits.filter(h => h.id !== id));
  }, [habits, saveHabits]);

  const getTotalStats = useCallback(() => {
    const allDates = [...new Set(Object.keys(completions).map(k => k.split('_')[0]))];
    return {
      totalDays: allDates.length,
      totalDone: Object.values(completions).filter(Boolean).length,
      perfectDays: allDates.filter(d => getDayPct(d) === 100).length,
    };
  }, [completions, getDayPct]);

  const resetData = useCallback(async () => {
    setCompletions({});
    setMoods({});
    await AsyncStorage.multiRemove(['dt_completions', 'dt_moods']);
  }, []);

  return (
    <HabitContext.Provider value={{
      habits, completions, moods,
      toggleCompletion, isCompleted,
      getDayPct, getDayDone, getStreak,
      getHabitConsistency, getWeeklyData, getMonthlyData,
      getAvgWeekPct, logMood, getMood,
      addHabit, updateHabit, deleteHabit,
      getTotalStats, resetData,
    }}>
      {children}
    </HabitContext.Provider>
  );
}

export const useHabits = () => useContext(HabitContext);
