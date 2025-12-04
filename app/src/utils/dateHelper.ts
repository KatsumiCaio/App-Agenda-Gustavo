import { format, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, isSameDay, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const DateHelper = {
  formatDate: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'dd/MM/yyyy', { locale: ptBR });
  },

  formatDateWithDay: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, 'EEEE, dd MMM yyyy', { locale: ptBR });
  },

  getWeekDays: (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return eachDayOfInterval({ start, end });
  },

  getMonthDays: (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    return eachDayOfInterval({ start, end });
  },

  formatWeekRange: (date: Date) => {
    const start = startOfWeek(date, { weekStartsOn: 0 });
    const end = endOfWeek(date, { weekStartsOn: 0 });
    return `${format(start, 'dd MMM', { locale: ptBR })} - ${format(end, 'dd MMM yyyy', { locale: ptBR })}`;
  },

  formatMonth: (date: Date) => {
    return format(date, 'MMMM yyyy', { locale: ptBR });
  },

  isSameDay: (date1: Date | string, date2: Date | string) => {
    const d1 = typeof date1 === 'string' ? parseISO(date1) : date1;
    const d2 = typeof date2 === 'string' ? parseISO(date2) : date2;
    return isSameDay(d1, d2);
  },

  getTodayString: () => format(new Date(), 'yyyy-MM-dd'),

  isToday: (date: Date | string) => {
    return DateHelper.isSameDay(date, new Date());
  },

  isPast: (date: Date | string) => {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return d < new Date();
  }
};
