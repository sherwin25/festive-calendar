export type Holiday = {
  id: string;
  name: string;
  emoji: string;
  theme: string; // CSS class suffix
};

export const getHoliday = (date: Date): Holiday | null => {
  const month = date.getMonth(); // 0-11
  const day = date.getDate(); // 1-31
  const dayOfWeek = date.getDay(); // 0 (Sun) - 6 (Sat)

  // Function to check if a date is the Nth Weekday of a Month
  const isNthWeekday = (n: number, weekday: number, targetMonth: number) => {
    if (month !== targetMonth) return false;
    const firstDayOfMonth = new Date(date.getFullYear(), month, 1).getDay();
    const offset = (weekday - firstDayOfMonth + 7) % 7;
    const targetDate = 1 + offset + (n - 1) * 7;
    return day === targetDate;
  };

  // Function to check if a date is the Last Weekday of a Month
  const isLastWeekday = (weekday: number, targetMonth: number) => {
    if (month !== targetMonth) return false;
    const nextMonth = new Date(date.getFullYear(), month + 1, 1);
    const lastDayOfMonth = new Date(nextMonth.getTime() - 86400000);
    const lastDate = lastDayOfMonth.getDate();
    const lastDay = lastDayOfMonth.getDay();
    const offset = (lastDay - weekday + 7) % 7;
    return day === lastDate - offset;
  };

  // Fixed Holidays
  if (month === 0 && day === 1) return { id: 'new-years', name: "New Year's Day", emoji: "🎆", theme: "new-year" };
  if (month === 1 && day === 14) return { id: 'valentines', name: "Valentine's Day", emoji: "💘", theme: "valentines" };
  if (month === 3 && day === 1) return { id: 'april-fools', name: "April Fool's Day", emoji: "🃏", theme: "april-fools" }; // April is month 3
  if (month === 5 && day === 19) return { id: 'juneteenth', name: "Juneteenth", emoji: "✊🏿", theme: "juneteenth" };
  if (month === 6 && day === 4) return { id: 'independence', name: "Independence Day", emoji: "💥", theme: "independence" };
  if (month === 9 && day === 31) return { id: 'halloween', name: "Halloween", emoji: "🎃", theme: "halloween" };
  if (month === 10 && day === 11) return { id: 'veterans', name: "Veterans Day", emoji: "🎖️", theme: "veterans" };
  if (month === 11 && day === 25) return { id: 'christmas', name: "Christmas Day", emoji: "🎄", theme: "christmas" };

  // Floating Holidays
  if (isNthWeekday(3, 1, 0)) return { id: 'mlk', name: "Martin Luther King Jr. Day", emoji: "🤝", theme: "mlk" }; // 3rd Mon Jan
  if (isNthWeekday(3, 1, 1)) return { id: 'presidents', name: "Washington's Birthday", emoji: "🇺🇸", theme: "presidents" }; // 3rd Mon Feb
  if (isLastWeekday(1, 4)) return { id: 'memorial', name: "Memorial Day", emoji: "🕊️", theme: "memorial" }; // Last Mon May
  if (isNthWeekday(1, 1, 8)) return { id: 'labor', name: "Labor Day", emoji: "👷", theme: "labor" }; // 1st Mon Sep
  if (isNthWeekday(2, 1, 9)) return { id: 'columbus', name: "Columbus Day", emoji: "🌎", theme: "columbus" }; // 2nd Mon Oct
  if (isNthWeekday(4, 4, 10)) return { id: 'thanksgiving', name: "Thanksgiving Day", emoji: "🦃", theme: "thanksgiving" }; // 4th Thu Nov

  return null;
};
