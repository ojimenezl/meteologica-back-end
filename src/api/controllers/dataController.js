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
    const { temperature } = data;

    const values = temperature?.values || [];
    const index = getIndexForCurrentTime(values);
    const item = values[index];

    const tempC = deciKelvinToCelsius(item.value);

    res.json({
      time: item.time,
      rawValue: item.value,
      temperatureC: Number(tempC.toFixed(2))
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
  // Cabeceras necesarias para SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Función para enviar datos cada 5 segundos
  const sendData = async () => {
    try {
      const data = await fetchYamlData();
      const { temperature } = data;
      const values = temperature?.values || [];
      const index = getIndexForCurrentTime(values);
      const item = values[index];
      const tempC = deciKelvinToCelsius(item.value);

      // Enviar como string JSON
      res.write(`data: ${JSON.stringify({
        time: item.time,
        rawValue: item.value,
        temperatureC: Number(tempC.toFixed(2))
      })}\n\n`);
    } catch (err) {
      res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`);
    }
  };

  // Enviar inmediatamente al conectarse
  sendData();

  // Intervalo de envío cada 5 segundos
  const intervalId = setInterval(sendData, 5000);

  // Limpiar cuando el cliente se desconecte
  req.on('close', () => {
    clearInterval(intervalId);
  });
}
