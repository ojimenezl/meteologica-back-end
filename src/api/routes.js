import express from "express";
import * as controller from "./controllers/dataController.js";

export const router = express.Router();

router.get("/data", controller.getAll);
router.get("/latest", controller.getLatest);
router.get("/minutes", controller.getMinutes);
router.get("/stream", controller.streamLatest);
