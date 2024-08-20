import { PeriodType } from '../core/types/period-type';
import { getNumberOfWeeks } from './get-number-of-weeks';

export function getDatesInRange(startDate, endDate, period: PeriodType) {
  const date = new Date(startDate.getTime());
  const dates: string[] = [];

  if (period == PeriodType.HOUR) {
    return Array.from(Array(24), (x, index) => index.toString());
  }
  while (date < endDate) {
    let formatted_day = '';
    const yyyy = date.getFullYear().toString();
    switch (period) {
      case PeriodType.DAY:
        {
          let mm = (date.getMonth() + 1).toString();
          let dd = date.getDate().toString();

          if (date.getDate() < 10) {
            dd = '0' + date.getDate().toString();
          }
          if (date.getMonth() < 9) {
            mm = '0' + (date.getMonth() + 1).toString();
          }

          formatted_day = dd + '-' + mm + '-' + yyyy;
        }
        break;
      case PeriodType.WEEK:
        {
          formatted_day = getNumberOfWeeks(date);
        }
        break;
      case PeriodType.MONTH:
        {
          const m = (date.getMonth() + 1).toString();
          formatted_day = m + '-' + yyyy;
        }
        break;
      case PeriodType.QUARTER:
        {
          const q = Math.ceil((date.getMonth() + 1) / 3);
          formatted_day = q + '-' + yyyy;
        }
        break;
    }
    if (dates.indexOf(formatted_day) == -1) {
      dates.push(formatted_day);
    }

    date.setDate(date.getDate() + 1);
  }

  return dates;
}
