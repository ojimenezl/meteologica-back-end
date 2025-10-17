import { CONFIG } from "../config/index.js";

export function deciKelvinToCelsius(value) {
  const kelvin = value / 10;
  return kelvin - 273.15;
}

export function getIndexForCurrentTime(values) {
  if (!values?.length) return 0;

  const now = new Date();
  const secondsSinceMidnight = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

  const parseTime = (t) => {
    const [h, m, s] = t.split(":").map(Number);
    return h * 3600 + m * 60 + s;
  };

  const first = parseTime(values[0].time);
  let steps = Math.floor((secondsSinceMidnight - first) / CONFIG.INTERVAL_SECONDS);
  if (steps < 0) steps = 0;
  if (steps >= values.length) steps = values.length - 1;

  return steps;
}
