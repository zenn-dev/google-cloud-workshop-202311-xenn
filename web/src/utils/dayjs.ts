import dayjs, { Dayjs } from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ja';

// ref: https://day.js.org/docs/en/customization/relative-time
const thresholds = [
  { l: 's', r: 1 },
  { l: 'm', r: 1 },
  { l: 'mm', r: 59, d: 'minute' },
  { l: 'h', r: 1 },
  { l: 'hh', r: 23, d: 'hour' },
  { l: 'd', r: 1 },
  { l: 'dd', r: 29, d: 'day' },
  { l: 'M', r: 1 },
  { l: 'MM', r: 11, d: 'month' },
  { l: 'y' },
  { l: 'yy', d: 'year' },
];

dayjs.extend(relativeTime, {
  thresholds,
});
// localeは常に`ja`とする。公開予約日時の整合性を保つために重要
dayjs.locale('ja');

// 拡張フォーマットに対応させる
dayjs.extend(advancedFormat);

type DateText = string | Date | number;

export function getDiffHoursFromNow(dateText: DateText) {
  const date = dayjs(dateText);
  return date.diff(Date.now(), 'hour');
}

export function isDateWithin(dateText: DateText, days: number) {
  const date = dayjs(dateText);
  return Math.abs(date.diff(Date.now(), 'day')) < days;
}

export function isHourWithin(dateText: DateText, hours: number) {
  const date = dayjs(dateText);
  return Math.abs(date.diff(Date.now(), 'hour')) < hours;
}

export function isValidDate(dateText: DateText): boolean {
  return dayjs(dateText).isValid();
}

export function isFutureDate(dateText: DateText): boolean {
  return dayjs(dateText).isAfter(dayjs());
}

export function formatDate(
  dateText: DateText,
  option?: {
    format?: string;
    fromNow?: boolean;
  }
): string {
  if (!dateText) return '';
  const date = dayjs(dateText);
  // 半年以内の場合のに相対時間表示する
  const isRecent = Math.abs(date.diff(Date.now(), 'month')) < 6;
  if (option?.fromNow && isRecent) {
    return date.fromNow();
  } else {
    return date.format(option?.format || 'YYYY/MM/DD');
  }
}

export function formatDateForSystem(dateText: DateText) {
  if (!dateText) return '';
  const date = dayjs(dateText);
  return date.format();
}

export function milliSecondsText(obj: Dayjs): string {
  return obj.format('x');
}
