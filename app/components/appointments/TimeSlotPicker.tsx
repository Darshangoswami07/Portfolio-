'use client';

import { motion } from 'framer-motion';

interface TimeSlotPickerProps {
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

const timeSlots = [
  '09:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '02:00 PM',
  '03:00 PM',
  '04:00 PM',
  '05:00 PM',
  '06:00 PM',
  '07:00 PM',
  '08:00 PM',
  '09:00 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM',
  
];

export default function TimeSlotPicker({ selectedTime, onSelectTime }: TimeSlotPickerProps) {
  return (
    <div>
      <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Select Time</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {timeSlots.map((time, index) => {
          const isSelected = selectedTime === time;
          return (
            <motion.button
              type="button"
              key={time}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectTime(time)}
              className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border ${
                isSelected
                  ? 'border-orange-500 bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  : 'border-zinc-900/10 dark:border-white/10 text-zinc-600 dark:text-zinc-300 bg-surface-muted hover:border-orange-300 dark:hover:border-orange-500/50'
              }`}
            >
              {time}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
