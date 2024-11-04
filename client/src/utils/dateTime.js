export default function formatTime(data) {
  if (!data) return;
  const date = new Date(data);
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${mins}`;
}
