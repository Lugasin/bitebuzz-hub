
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-ZM', {
    style: 'currency',
    currency: 'ZMW',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
}

export function getRandomItemFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

export function getDifficultyColor(difficulty) {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return 'text-green-500';
    case 'medium':
      return 'text-yellow-500';
    case 'hard':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getOrderStatusColor(status) {
  switch (status.toLowerCase()) {
    case 'preparing':
      return 'text-yellow-500';
    case 'ready':
      return 'text-green-500';
    case 'delivered':
      return 'text-blue-500';
    case 'cancelled':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
}

export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = String(item[key]);
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}
