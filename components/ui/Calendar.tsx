'use client';

import React, { useState } from 'react';

interface CalendarProps {
  activeDays?: Set<string>;
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

const WEEKDAYS = ['一', '二', '三', '四', '五', '六', '日'];
const MONTHS = [
  '一月', '二月', '三月', '四月', '五月', '六月',
  '七月', '八月', '九月', '十月', '十一月', '十二月'
];

export function Calendar({ 
  activeDays = new Set(), 
  selectedDate, 
  onDateSelect 
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startingDayOfWeek = (firstDayOfMonth.getDay() + 6) % 7; // 周一为0
  const daysInMonth = lastDayOfMonth.getDate();

  const isToday = (day: number) => {
    const today = new Date();
    return today.getFullYear() === year && 
           today.getMonth() === month && 
           today.getDate() === day;
  };

  const isActive = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return activeDays.has(dateStr);
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return selectedDate.getFullYear() === year && 
           selectedDate.getMonth() === month && 
           selectedDate.getDate() === day;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    const date = new Date(year, month, day);
    onDateSelect?.(date);
  };

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(<div key={`empty-${i}`} className="aspect-square" />);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const today = isToday(day);
    const active = isActive(day);
    const selected = isSelected(day);
    
    let dayClasses = 'aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all cursor-pointer';
    
    if (today) {
      dayClasses += ' bg-lime-400 text-gray-900';
    } else if (selected) {
      dayClasses += ' bg-indigo-500 text-white';
    } else if (active) {
      dayClasses += ' bg-white/20 text-white hover:bg-white/30';
    } else {
      dayClasses += ' text-gray-300 hover:bg-white/10';
    }

    days.push(
      <div 
        key={day} 
        className={dayClasses}
        onClick={() => handleDayClick(day)}
      >
        {day}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">你的活跃日期</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={handlePrevMonth}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-medium">{MONTHS[month]}</span>
          <button 
            onClick={handleNextMonth}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-blue-200">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}
