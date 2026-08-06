import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ================= CORS =================
const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === "production") {
        callback(null, true);
      } else {
        callback(new Error("CORS Not Allowed"));
      }
    },
    credentials: true,
  }),
);

// ================= SECURITY =================
app.use(
  helmet({
    contentSecurityPolicy: false, // Avoid blocking inline scripts/styles if needed in production
  })
);

// ================= LOGS =================
app.use(morgan("dev"));

// ================= BODY PARSER =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= COOKIE =================
app.use(cookieParser());

// ================= STATIC FILES (FRONTEND BUILD) =================
app.use(express.static(path.join(__dirname, "dist")));

// ================= API ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/dashboard", dashboardRoutes);

// ================= FRONTEND SPA FALLBACK ROUTE =================
app.use((req, res) => {
  // Try multiple possible paths for dist/index.html
  const possiblePaths = [
    path.join(__dirname, "dist", "index.html"),
    path.join(process.cwd(), "dist", "index.html"),
  ];

  const indexPath = possiblePaths.find((p) => fs.existsSync(p));

  if (indexPath) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    fs.createReadStream(indexPath).pipe(res);
  } else {
    res.status(404).send("Not Found: index.html missing. Paths checked: " + possiblePaths.join(", "));
  }
});

export default app;
