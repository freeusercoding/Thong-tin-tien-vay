/**
 * Formatting utilities for Vietnamese currency and dates
 */

export function formatVND(value: number): string {
  if (isNaN(value)) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  if (isNaN(value)) return '0';
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(value);
}

export function parseFormattedNumber(input: string): number {
  if (!input) return 0;
  // Remove dots, commas, spaces and non-digit characters
  const cleanStr = input.replace(/[^0-9]/g, '');
  const parsed = parseInt(cleanStr, 10);
  return isNaN(parsed) ? 0 : parsed;
}

const UNITS = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín'];
const TENS = ['', 'mười', 'hai mươi', 'ba mươi', 'bốn mươi', 'năm mươi', 'sáu mươi', 'bảy mươi', 'tám mươi', 'chín mươi'];

function readTriple(numStr: string, readFull: boolean): string {
  let result = '';
  const hundreds = parseInt(numStr[0], 10);
  const tens = parseInt(numStr[1], 10);
  const ones = parseInt(numStr[2], 10);

  if (hundreds === 0 && tens === 0 && ones === 0) return '';

  if (readFull || hundreds > 0) {
    result += UNITS[hundreds] + ' trăm ';
    if (tens === 0 && ones > 0) {
      result += 'lẻ ';
    }
  }

  if (tens > 0) {
    result += TENS[tens] + ' ';
  }

  if (ones === 1 && tens > 1) {
    result += 'mốt ';
  } else if (ones === 5 && tens > 0) {
    result += 'lăm ';
  } else if (ones > 0 && tens !== 0) {
    result += UNITS[ones] + ' ';
  } else if (ones > 0 && tens === 0 && (readFull || hundreds > 0)) {
    result += UNITS[ones] + ' ';
  } else if (ones > 0 && tens === 0 && !readFull && hundreds === 0) {
    result += UNITS[ones] + ' ';
  }

  return result.trim();
}

/**
 * Converts a number to Vietnamese words (e.g. 2000000000 -> "Hai tỷ đồng")
 */
export function numberToVietnameseWords(n: number): string {
  if (n === 0) return 'Không đồng';
  if (n < 0) return 'Âm ' + numberToVietnameseWords(Math.abs(n)).toLowerCase();
  
  const scales = ['', 'nghìn', 'triệu', 'tỷ', 'nghìn tỷ', 'triệu tỷ'];
  let str = Math.round(n).toString();
  
  // Pad with zeros to make length multiple of 3
  while (str.length % 3 !== 0) {
    str = '0' + str;
  }
  
  const groups: string[] = [];
  for (let i = 0; i < str.length; i += 3) {
    groups.push(str.substring(i, i + 3));
  }
  
  const numGroups = groups.length;
  const parts: string[] = [];
  
  for (let i = 0; i < numGroups; i++) {
    const groupVal = parseInt(groups[i], 10);
    if (groupVal > 0) {
      const scaleIndex = numGroups - 1 - i;
      const readFull = i > 0;
      const text = readTriple(groups[i], readFull);
      if (text) {
        const scaleText = scales[scaleIndex] ? ' ' + scales[scaleIndex] : '';
        parts.push(text + scaleText);
      }
    }
  }
  
  if (parts.length === 0) return 'Không đồng';
  
  const combined = parts.join(' ').replace(/\s+/g, ' ').trim();
  const capitalized = combined.charAt(0).toUpperCase() + combined.slice(1);
  return `${capitalized} đồng`;
}
