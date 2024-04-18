export function convertTime(timestamp: string) {
  return (
    timestamp.slice(0, 4) +
    "-" +
    timestamp.slice(4, 6) +
    "-" +
    timestamp.slice(6, 11) +
    ":" +
    timestamp.slice(11, 13) +
    ":" +
    timestamp.slice(13, timestamp.length)
  );
}
