const express = require("express");
const cors = require("cors");
const { Translate } = require("@google-cloud/translate").v2;
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const app = express();
app.use(cors()); // 你可以設定來源限制，例如 chrome-extension
app.use(express.json());

// 設定每分鐘最大請求次數限制：每個 IP 一分鐘內最多可請求 10 次
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 分鐘
  max: 10, // 每個 IP 最多可請求 10 次
  message: "Too many requests, please try again later.", // 超過次數後的回應訊息
  standardHeaders: true, // 在回應標頭中包含速率限制資訊
  legacyHeaders: false, // 禁用 "X-RateLimit-*" 標頭
});

// 應用速率限制
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

// 設定服務帳戶金鑰
const translate = new Translate({
  keyFilename: process.env.GOOGLE_API_KEY, // 輸入服務帳戶 JSON 檔案的路徑
});

const MAX_TEXT_LENGTH = 500;

app.post("/api/translate", async (req, res) => {
  const { text, sourceLang = "en", targetLang = "zh-TW" } = req.body;
  // 檢查傳入的文本是否超過字數限制
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({
      error: `Text exceeds the maximum length of ${MAX_TEXT_LENGTH} characters.`,
    });
  }
  try {
    // 使用 @google-cloud/translate 的 translate 方法
    const [translation] = await translate.translate(text, targetLang);

    res.json({
      translatedText: translation,
    });
  } catch (err) {
    console.error("Translation error:", err.message || err);
    res.status(500).json({ error: "翻譯失敗" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
