require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const customerRoutes = require("./routes/customerRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.status(200).json({ message: "Connectly CRM API is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    database: require("mongoose").connection.readyState === 1 ? "connected" : "disconnected"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

async function startServer() {
  if (!process.env.MONGO_URI) {
    console.error("Startup failed: MONGO_URI is not set.");
    process.exit(1);
  }

  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    console.error("Startup failed: JWT_SECRET must be set and contain at least 32 characters.");
    process.exit(1);
  }

  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Connectly CRM API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
