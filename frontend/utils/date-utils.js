// Format flight duration from minutes to hours and minutes
export const formatDuration = (minutes) => {
  if (!minutes) return '';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// Format date and time from timestamp or date string
export const formatDateTime = (dateTime) => {
  if (!dateTime) return '';
  
  const date = new Date(dateTime);
  
  // Format time
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  // Format date
  const dateStr = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
  
  return `${dateStr}, ${time}`;
};

// Format date only
export const formatDate = (date) => {
  if (!date) return '';
  
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
};

// Format time only
export const formatTime = (time) => {
  if (!time) return '';
  
  return new Date(time).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}; 