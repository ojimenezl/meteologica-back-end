import axios from "axios";
import { logger } from "./logger.js";

export const httpClient = axios.create({
  timeout: 10000
});

httpClient.interceptors.response.use(
  res => res,
  err => {
    logger.error("HTTP Error:", err.message);
    return Promise.reject(err);
  }
);
