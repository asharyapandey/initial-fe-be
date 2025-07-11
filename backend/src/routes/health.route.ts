import express from "express";

import { health } from "../controllers/health.controller.js";

const healthRoutes = express.Router();

healthRoutes.get("/health", health);

export default healthRoutes;
