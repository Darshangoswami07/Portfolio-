'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon } from 'lucide-react';

interface DatePickerProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

export default function DatePicker({ selectedDate, onSelectDate }: DatePickerProps) {
  const [minDate, setMinDate] = useState('');

  useEffect(() => {
    // Set minimum date to today
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    setMinDate(`${yyyy}-${mm}-${dd}`);
  }, []);

  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Select Date</h3>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <CalendarIcon className="h-4 w-4 text-zinc-400 dark:text-zinc-500" />
        </div>
        <input
          type="date"
          min={minDate}
          value={selectedDate}
          onChange={(e) => onSelectDate(e.target.value)}
          aria-label="Select date"
          className="w-full pl-11 pr-4 py-3 bg-surface-muted border border-zinc-900/10 dark:border-white/10 rounded-xl focus:ring-0 focus:border-orange-500 dark:focus:border-orange-500 text-zinc-900 dark:text-white appearance-none cursor-pointer transition-colors"
        />
      </div>
    </div>
  );
}
