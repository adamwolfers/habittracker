'use client';

import { useState, useEffect } from 'react';
import { Habit, HabitFormData } from '@/types/habit';
import { formatDate } from '@/utils/dateUtils';

const STORAGE_KEY = 'habits';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load habits from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setHabits(JSON.parse(stored));
      } catch (error) {
        console.error('Error loading habits:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  const addHabit = (habitData: HabitFormData) => {
    const newHabit: Habit = {
      id: Date.now().toString(),
      name: habitData.name,
      description: habitData.description,
      color: habitData.color,
      createdAt: new Date().toISOString(),
      completedDates: [],
    };
    setHabits([...habits, newHabit]);
  };

  const deleteHabit = (habitId: string) => {
    setHabits(habits.filter(h => h.id !== habitId));
  };

  const toggleHabitCompletion = (habitId: string, date: Date) => {
    const dateString = formatDate(date);
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDates.includes(dateString);
        return {
          ...habit,
          completedDates: isCompleted
            ? habit.completedDates.filter(d => d !== dateString)
            : [...habit.completedDates, dateString],
        };
      }
      return habit;
    }));
  };

  const isHabitCompletedOnDate = (habitId: string, date: Date): boolean => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return false;
    return habit.completedDates.includes(formatDate(date));
  };

  return {
    habits,
    addHabit,
    deleteHabit,
    toggleHabitCompletion,
    isHabitCompletedOnDate,
    isLoaded,
  };
};
