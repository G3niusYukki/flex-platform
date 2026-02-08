import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
  }).format(num);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACCEPTED: 'bg-blue-100 text-blue-800',
    IN_PROGRESS: 'bg-purple-100 text-purple-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
    DISPUTED: 'bg-orange-100 text-orange-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getOrderStatusText(status: string): string {
  const texts: Record<string, string> = {
    PENDING: '待接单',
    ACCEPTED: '已接单',
    IN_PROGRESS: '进行中',
    COMPLETED: '已完成',
    CANCELED: '已取消',
    DISPUTED: '有争议',
  };
  return texts[status] || status;
}

export function getUserStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    ACTIVE: 'bg-green-100 text-green-800',
    INACTIVE: 'bg-gray-100 text-gray-800',
    SUSPENDED: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getUserStatusText(status: string): string {
  const texts: Record<string, string> = {
    PENDING: '待审核',
    ACTIVE: '正常',
    INACTIVE: '已禁用',
    SUSPENDED: '已封禁',
  };
  return texts[status] || status;
}

export function generateOrderNo(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `ORD${timestamp}${randomStr}`.toUpperCase();
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
