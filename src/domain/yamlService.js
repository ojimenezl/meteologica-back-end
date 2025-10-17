import yaml from "js-yaml";
import { httpClient } from "../infrastructure/httpClient.js";
import { cache } from "../infrastructure/cache.js";
import { CONFIG } from "../config/index.js";
import { logger } from "../infrastructure/logger.js";

export async function fetchYamlData() {
  const cached = cache.get("parsedData");
  if (cached) return cached;

  logger.info("Fetching YAML from GitHub...");
  const response = await httpClient.get(CONFIG.RAW_YAML_URL);
  const parsed = yaml.load(response.data);
  cache.set("parsedData", parsed);
  logger.info("YAML data cached");
  return parsed;
}
