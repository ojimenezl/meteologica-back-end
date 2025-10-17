import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { router } from "./api/routes.js";
import { CONFIG } from "./config/index.js";

export const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan("dev"));

app.use("/api", router);

app.get("/", (req, res) => res.send("✅ Meteológica backend is running!"));

app.listen(CONFIG.PORT, () => {
  console.log(`Server running on http://localhost:${CONFIG.PORT}`);
});
