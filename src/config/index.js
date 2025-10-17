export const CONFIG = {
  RAW_YAML_URL: process.env.DATA_RAW_URL || 'https://raw.githubusercontent.com/joboxappec-netizen/meteologica-test-data/refs/heads/main/data.yml',
  INTERVAL_SECONDS: Number(process.env.INTERVAL_SECONDS) || 5,
  CACHE_TTL_SECONDS: Number(process.env.CACHE_TTL_SECONDS) || 300,
  PORT: process.env.PORT || 3000
};
