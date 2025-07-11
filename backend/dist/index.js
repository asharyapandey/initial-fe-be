import cors from "cors";
import express from "express";
import morgan from "morgan";
import { AppDataSource } from "./libs/data-source.js";
import env from "./libs/env.js";
import logger from "./libs/logger.js";
import { BASE_API } from "./libs/utils/constants.js";
import { loginRoute } from "./routes/auth.route.js";
import candidateRoutes from "./routes/candidate.route.js";
import designationRoutes from "./routes/designation.route.js";
import healthRoutes from "./routes/health.route.js";
import mediumRoutes from "./routes/medium.route.js";
import shortlistRoutes from "./routes/shortlist.route.js";
import statusRoutes from "./routes/status.route.js";
import vacancyRoutes from "./routes/vacancy.route.js";
import vacancyCandidateRoutes from "./routes/vacancy-candidate.route.js";
import seedAdmin from "./seed/admin.js";
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
if (env.NODE_ENV !== "production") {
    app.use(morgan(":method :url :status :res[content-length] - :response-time ms"));
}
// Routes
app.use(BASE_API, healthRoutes);
app.use(BASE_API, designationRoutes);
app.use(BASE_API, mediumRoutes);
app.use(BASE_API, vacancyRoutes);
app.use(BASE_API, shortlistRoutes);
app.use(BASE_API, loginRoute);
app.use(BASE_API, statusRoutes);
app.use(BASE_API, candidateRoutes);
app.use(BASE_API, vacancyCandidateRoutes);
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
}
catch (error) {
    logger.error({
        message: `Failed to start the server: ${error.message}`,
    });
}
//# sourceMappingURL=index.js.map