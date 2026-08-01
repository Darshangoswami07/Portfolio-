'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2 } from 'lucide-react';
import { appointmentSchema, AppointmentFormData } from '../../validators/appointment';
import DatePicker from './DatePicker';
import TimeSlotPicker from './TimeSlotPicker';

export default function AppointmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    },
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const onSubmit = async (data: AppointmentFormData) => {
    setIsSubmitting(true);
    setServerError('');
    
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to book appointment');
      }

      setIsSuccess(true);
    } catch {
      setServerError('An error occurred while booking. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="surface-card p-8 md:p-12 text-center max-w-2xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
        >
          <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-9 h-9 text-green-500" />
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-4">
          Meeting Request Sent Successfully
        </h3>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8">
          Thank you! I have received your request for a meeting on{' '}
          <strong className="text-orange-600 dark:text-amber-400">{selectedDate}</strong> at{' '}
          <strong className="text-orange-600 dark:text-amber-400">{selectedTime}</strong>.
          I will send a calendar invite shortly.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="px-6 py-3 bg-zinc-900/5 hover:bg-zinc-900/10 dark:bg-white/5 dark:hover:bg-white/10 text-zinc-900 dark:text-white rounded-full font-semibold text-sm transition-colors"
        >
          Book Another Meeting
        </button>
      </motion.div>
    );
  }

  return (
    <div className="surface-card p-6 md:p-10">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {serverError && (
          <div className="p-4 bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12">
          {/* Left Column: Details */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Your Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Full Name *</label>
                <input
                  id="fullName"
                  {...register('fullName')}
                  className="w-full px-4 py-3 bg-surface-muted border border-zinc-900/10 dark:border-white/10 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-zinc-900 dark:text-white transition-colors"
                  placeholder="John Doe"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1.5">{errors.fullName.message}</p>}
              </div>

              <div>
                <label htmlFor="appointmentEmail" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Email *</label>
                <input
                  id="appointmentEmail"
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-surface-muted border border-zinc-900/10 dark:border-white/10 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-zinc-900 dark:text-white transition-colors"
                  placeholder="john@example.com"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Company (Optional)</label>
              <input
                id="companyName"
                {...register('companyName')}
                className="w-full px-4 py-3 bg-surface-muted border border-zinc-900/10 dark:border-white/10 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-zinc-900 dark:text-white transition-colors"
                placeholder="Acme Inc."
              />
            </div>

            <div>
              <label htmlFor="meetingType" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Meeting Type *</label>
              <select
                id="meetingType"
                {...register('meetingType')}
                className="w-full px-4 py-3 bg-surface-muted border border-zinc-900/10 dark:border-white/10 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-zinc-900 dark:text-white transition-colors"
              >
                <option value="">Select an option</option>
                <option value="Job Opportunity">Job Opportunity</option>
                <option value="Freelance Project">Freelance Project</option>
                <option value="Startup Collaboration">Startup Collaboration</option>
                <option value="Technical Discussion">Technical Discussion</option>
                <option value="Consultation Call">Consultation Call</option>
                <option value="Other">Other</option>
              </select>
              {errors.meetingType && <p className="text-red-500 text-xs mt-1.5">{errors.meetingType.message}</p>}
            </div>

            <div>
              <label htmlFor="appointmentMessage" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Message *</label>
              <textarea
                id="appointmentMessage"
                {...register('message')}
                rows={4}
                className="w-full px-4 py-3 bg-surface-muted border border-zinc-900/10 dark:border-white/10 focus:border-orange-500 dark:focus:border-orange-500 rounded-xl outline-none text-zinc-900 dark:text-white transition-colors resize-none"
                placeholder="Briefly describe what you'd like to discuss..."
              ></textarea>
              {errors.message && <p className="text-red-500 text-xs mt-1.5">{errors.message.message}</p>}
            </div>

            <input type="hidden" {...register('timezone')} />
          </div>

          {/* Right Column: Date & Time */}
          <div className="space-y-8">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Date &amp; Time</h3>

            <DatePicker
              selectedDate={selectedDate || ''}
              onSelectDate={(date) => setValue('date', date, { shouldValidate: true })}
            />
            {errors.date && <p className="text-red-500 text-xs -mt-6">{errors.date.message}</p>}

            <TimeSlotPicker
              selectedTime={selectedTime || ''}
              onSelectTime={(time) => setValue('time', time, { shouldValidate: true })}
            />
            {errors.time && <p className="text-red-500 text-xs -mt-6">{errors.time.message}</p>}

            <div className="pt-6 border-t border-zinc-900/[0.06] dark:border-white/[0.06] mt-8">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.015, y: -1 } : undefined}
                whileTap={!isSubmitting ? { scale: 0.98 } : undefined}
                className="btn-gradient w-full py-4 text-white rounded-xl font-semibold text-base flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {isSubmitting ? (
                    <motion.span
                      key="submitting"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center"
                    >
                      <Loader2 className="animate-spin mr-2 w-4 h-4" /> Booking...
                    </motion.span>
                  ) : (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                    >
                      Confirm Booking
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
