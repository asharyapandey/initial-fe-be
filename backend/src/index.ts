import express from "express";
import morgan from "morgan";

import { AppDataSource } from "./libs/data-source.js";
import env from "./libs/env.js";
import logger from "./libs/logger.js";
import healthRoutes from "./routes/health.route.js";
import seedAdmin from "./seed/admin.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (env.NODE_ENV !== "production") {
  app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
  );
}

// Routes
app.use(healthRoutes);

// Initialize
try {
  await AppDataSource.initialize();
  logger.info({
    message: `DataSource: ✅`,
  });

  await seedAdmin();

  app.listen(env.PORT, () => {
    console.log(`Started on http://localhost:${env.PORT}`);
  });
} catch (error) {
  logger.error({
    message: `Failed to start the server: ${error.message}`,
  });
}
