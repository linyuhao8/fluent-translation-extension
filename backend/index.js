const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const translatorApi = require("./utils/translatorApi");

const app = express();
app.use(cors());
app.use(express.json());

// 限制請求次數
app.set("trust proxy", true);
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

app.use((req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const userAgent = req.get("User-Agent");
  const requestBody = req.body;
  console.log(
    `IP: ${ip}, Method: ${req.method}, URL: ${req.url}, User-Agent: ${userAgent}`
  );
  console.log("Request Body:", requestBody);
  next();
});

// ===== 🔵 API 路由 =====
const MAX_TEXT_LENGTH = 1000;

app.post("/api/translate", async (req, res) => {
  const { text, sourceLang = "en", targetLang = "zh-TW" } = req.body;
  console.log(text, sourceLang, targetLang);

  if (!text) return res.status(400).json({ error: "Text is required." });
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: "Text too long." });
  }

  try {
    const result = await translatorApi.translateWithGoogleCloud(
      text,
      sourceLang,
      targetLang
    );
    res.json({ translatedText: result });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: error.message || "Unknown error" });
  }
});

app.get("/", (req, res) => {
  res.send("hello world");
});

// ===== 🟢 啟動伺服器 =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
