import { formatDistanceToNow, format } from 'date-fns';

export const formatTimeAgo = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
};

export const formatDateTime = (date: string | Date): string => {
  return format(new Date(date), 'MMM d, yyyy h:mm a');
};

export const formatTime = (date: string | Date): string => {
  return format(new Date(date), 'h:mm a');
};
