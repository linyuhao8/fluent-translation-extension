const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const path = require("path");
const { Translate } = require("@google-cloud/translate").v2;
const os = require("os");
const translatorApi = require("./utils/translatorApi");
// 載入 .env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 限制請求次數
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
// ===== 🟡 把 base64 金鑰寫成暫存檔案 =====
const credentialsBase64 =
  process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64;

if (!credentialsBase64) {
  console.error("Missing GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64 in .env");
  process.exit(1);
}

const credentialsJson = Buffer.from(credentialsBase64, "base64").toString(
  "utf8"
);

// 確保臨時目錄存在（使用 OS 預設的臨時目錄）
const tempDir = os.tmpdir();
const tempKeyPath = path.join(tempDir, "google-translate-key.json");

// 確保目錄存在，若不存在則創建
const dirPath = path.dirname(tempKeyPath);
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

// 寫入 key file（若不存在）
if (!fs.existsSync(tempKeyPath)) {
  fs.writeFileSync(tempKeyPath, credentialsJson);
}

// 初始化 Google Translate client
const translate = new Translate({
  keyFilename: tempKeyPath,
});

// ===== 🔵 API 路由 =====
const MAX_TEXT_LENGTH = 1000;

app.post("/api/translate", async (req, res) => {
  const { text, sourceLang, targetLang = "zh-TW" } = req.body;
  console.log(text, sourceLang, targetLang);
  if (!text) return res.status(400).json({ error: "Text is required." });
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: "Text too long." });
  }

  try {
    const translation = await translatorApi.freeGoogleTranslate(
      text,
      sourceLang,
      targetLang
    );
    // const [translation] = await translatorApi.translateText(text, targetLang);
    res.json({ translatedText: translation });
  } catch (error) {
    console.log("Translation error:", error);
    const errorMessage = error.message || "Unknown error";
    res.status(500).json({ error: errorMessage });
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
