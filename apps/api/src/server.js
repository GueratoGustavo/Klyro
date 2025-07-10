const express = require("express");
const morgan = require("morgan");
const axios = require("axios");
const winston = require("winston");
const axiosRetry = require("axios-retry");

const app = express();
app.use(express.json());
app.use(morgan("dev"));
axiosRetry(axios, { retries: 3, retryDelay: axiosRetry.exponentialDelay });

const logger = winston.createLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    })
  ),
});

app.get("/health", (_, res) => {
  res.status(200).json({ status: "✅ API online" });
});

app.post("/classify", async (req, res) => {
  try {
    const response = await axios.post(
      "http://classifier:5000/classify",
      req.body
    );
    logger.info(`Classificação recebida: ${JSON.stringify(response.data)}`);
    res.json(response.data);
  } catch (error) {
    logger.error("Erro ao se comunicar com a IA: " + error.message);
    res.status(500).json({ erro: "Falha na classificação" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  logger.info(`🚀 API rodando em http://localhost:${PORT}`);
});
