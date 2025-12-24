"use client";

import { useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { getHoliday } from "../utils/holidays";

type CalendarDay = {
  date: Date | null;
  label: string;
  isToday: boolean;
  holiday: ReturnType<typeof getHoliday>;
  isCurrentMonth: boolean;
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function buildCalendar(reference: Date): CalendarDay[] {
  const year = reference.getFullYear();
  const month = reference.getMonth();
  
  // Find the first day of the month
  const firstOfMonth = new Date(year, month, 1);
  const startDayConfig = firstOfMonth.getDay(); // 0 = Sunday

  // We want to fill 6 rows * 7 cols = 42 cells
  // We start 'startDayConfig' days before the 1st
  const startDate = new Date(year, month, 1 - startDayConfig);

  const today = new Date();
  const cells: CalendarDay[] = [];

  for (let i = 0; i < 42; i++) {
    const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + i);
    
    const isToday =
      today.getFullYear() === current.getFullYear() &&
      today.getMonth() === current.getMonth() &&
      today.getDate() === current.getDate();
    
    const isCurrentMonth = current.getMonth() === month;

    // Check for holiday
    const holiday = getHoliday(current);

    cells.push({
      date: current,
      label: current.getDate().toString(),
      isToday,
      holiday,
      isCurrentMonth
    });
  }

  return cells;
}

function formatMonth(reference: Date): string {
  return reference.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
}

export function Calendar(): JSX.Element {
  const [activeDay, setActiveDay] = useState<string | null>(null);
  // Initial state is today
  const [currentMonth, setCurrentMonth] = useState(() => new Date());

  const monthLabel = formatMonth(currentMonth);
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric"
  });

  const days = useMemo(() => buildCalendar(currentMonth), [currentMonth]);

  // Range Constraints
  const todayDate = new Date();
  const sixMonthsAgo = new Date(todayDate.getFullYear(), todayDate.getMonth() - 6, 1);
  const oneYearFuture = new Date(todayDate.getFullYear() + 1, todayDate.getMonth(), 1);

  const prevMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
  const nextMonthDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);

  const canGoPrev = prevMonthDate >= sixMonthsAgo;
  const canGoNext = nextMonthDate <= oneYearFuture;

  const handlePrev = () => {
    if (canGoPrev) setCurrentMonth(prevMonthDate);
  };

  const handleNext = () => {
    if (canGoNext) setCurrentMonth(nextMonthDate);
  };

  const handleDayClick = (dayId: string, holidayId?: string) => {
    setActiveDay((prev) => (prev === dayId ? null : dayId));
    
    // Trigger confetti if it's a holiday (or just general sparkle)
    const defaults = { origin: { y: 0.7 } };
    
    if (holidayId) {
       // Customized effects based on holiday could go here
       if (holidayId === 'christmas') {
          // specific snow like effect maybe?
          const duration = 3 * 1000;
          const animationEnd = Date.now() + duration;
          let skew = 1;

          (function frame() {
            const timeLeft = animationEnd - Date.now();
            const ticks = Math.max(200, 500 * (timeLeft / duration));
            
            skew = Math.max(0.8, skew - 0.001);

            confetti({
              particleCount: 1,
              startVelocity: 0,
              ticks: ticks,
              origin: {
                x: Math.random(),
                // since particles fall down, skew start toward the top
                y: (Math.random() * skew) - 0.2
              },
              colors: ['#ffffff'],
              shapes: ['circle'],
              gravity: 0.4,
              scalar: 0.8,
              drift: 0.2,
              disableForReducedMotion: true
            });

            if (timeLeft > 0) {
              requestAnimationFrame(frame);
            }
          }());
       } else {
         confetti({
           ...defaults,
           particleCount: 60,
           spread: 100,
           scalar: 1.2,
         });
       }
    }
  };

  return (
    <section className="calendar-card" aria-label={`Calendar for ${monthLabel}`}>
      <header className="calendar-caption">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
             <button 
               onClick={handlePrev} 
               disabled={!canGoPrev}
               className="nav-button"
               aria-label="Previous Month"
             >
               &larr;
             </button>
             <div>
                <h1>{monthLabel}</h1>
                <p>Today is {today}</p>
             </div>
             <button 
               onClick={handleNext} 
               disabled={!canGoNext}
               className="nav-button"
               aria-label="Next Month"
             >
               &rarr;
             </button>
        </div>
      </header>
      <div key={currentMonth.toISOString()} className="calendar-grid animate-enter" role="grid">
        {weekdayLabels.map((weekday) => (
          <div
            key={weekday}
            role="columnheader"
            aria-label={weekday}
            className="calendar-cell"
            style={{
              cursor: "default",
              background: "transparent",
              boxShadow: "none",
              fontWeight: 500
            }}
            data-active="false"
          >
            <span>{weekday}</span>
          </div>
        ))}
        {days.map(({ date, label, isToday, holiday, isCurrentMonth }, index) => {
          const dayId = date?.toISOString() ?? `empty-${index}`;
          // Since we now always have dates, the !date check is technically redundant for our logic but safe to keep if types allowed null. 
          // However, our new logic guarantees dates.
          
          const isActive = activeDay === dayId;

          return (
            <button
              key={dayId}
              type="button"
              className={`calendar-cell${isToday ? " today" : ""}${holiday ? ` theme-${holiday.theme}` : ""}`}
              data-active={isActive}
              onClick={() => handleDayClick(dayId, holiday?.id)}
              aria-pressed={isActive}
              title={holiday?.name}
              style={{
                 opacity: isCurrentMonth ? 1 : 0.3
              }}
            >
              <div className="calendar-spark" aria-hidden="true" />
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: holiday ? '0.9em' : '1em' }}>{label}</span>
                {holiday && <span style={{ fontSize: '1.2em' }}>{holiday.emoji}</span>}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
