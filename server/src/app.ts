import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes";
import workspaceRoutes from "./routes/workspace.routes";
import sprintRoutes from "./routes/sprint.routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("api/workspace", workspaceRoutes);
app.use("api/sprints", sprintRoutes);

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timeStamp: new Date().toISOString() });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`); 
});

export default app;