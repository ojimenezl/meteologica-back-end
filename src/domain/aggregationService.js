export function aggregateByMinute(values) {
  if (!Array.isArray(values)) return [];
  const buckets = new Map();

  for (const v of values) {
    const [h, m] = v.time.split(":");
    const key = `${h}:${m}`;
    if (!buckets.has(key)) buckets.set(key, { sum: 0, count: 0 });
    const b = buckets.get(key);
    b.sum += Number(v.value);
    b.count++;
  }

  return [...buckets.entries()].map(([minute, b]) => ({
    minute,
    avg: b.sum / b.count
  }));
}
