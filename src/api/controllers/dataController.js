import { fetchYamlData } from "../../domain/yamlService.js";
import { getIndexForCurrentTime, deciKelvinToCelsius } from "../../domain/timeIndexService.js";
import { aggregateByMinute } from "../../domain/aggregationService.js";

export async function getAll(req, res) {
  try {
    const data = await fetchYamlData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getLatest(req, res) {
  try {
    const data = await fetchYamlData();
    const { temperature, power } = data;

    const tempValues = temperature?.values || [];
    const powerValues = power?.values || [];

    const index = getIndexForCurrentTime(tempValues);
    const tempItem = tempValues[index];
    const powerItem = powerValues[index];

    const tempC = deciKelvinToCelsius(tempItem.value);
    const energyKWh = powerItem ? Number((parseFloat(powerItem.value) * 5 / 3600).toFixed(3)) : undefined;

    res.json({
      time: tempItem.time,
      rawValue: tempItem.value,
      temperatureC: Number(tempC.toFixed(2)),
      energyKWh
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function getMinutes(req, res) {
  try {
    const data = await fetchYamlData();
    const { temperature } = data;
    const values = temperature?.values || [];

    const minutes = aggregateByMinute(values).map(m => ({
      minute: m.minute,
      avgC: Number((deciKelvinToCelsius(m.avg)).toFixed(2))
    }));

    res.json(minutes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export async function streamLatest(req, res) {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const sendData = async () => {
    try {
      const data = await fetchYamlData();
      const { temperature, power } = data;

      const tempValues = temperature?.values || [];
      const powerValues = power?.values || [];
      const index = getIndexForCurrentTime(tempValues);

      const tempItem = tempValues[index];
      const powerItem = powerValues[index];

      const tempC = deciKelvinToCelsius(tempItem.value);
      const energyKWh = powerItem ? Number((parseFloat(powerItem.value) * 5 / 3600).toFixed(3)) : undefined;

      res.write(`data: ${JSON.stringify({
        time: tempItem.time,
        rawValue: tempItem.value,
        temperatureC: Number(tempC.toFixed(2)),
        energyKWh
      })}\n\n`);
    } catch (err) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    }
  };

  sendData();
  const intervalId = setInterval(sendData, 5000);

  req.on('close', () => clearInterval(intervalId));
}
