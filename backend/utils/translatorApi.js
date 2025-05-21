const fs = require("fs");
const path = require("path");
const { Translate } = require("@google-cloud/translate").v2;
const os = require("os");
const dotenv = require("dotenv");
// 載入 .env
dotenv.config();

class TranslatorApi {
  constructor() {
    // ===== 🟡 把 base64 金鑰寫成暫存檔案 =====
    const credentialsBase64 =
      process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64;

    if (!credentialsBase64) {
      console.error(
        "Missing GOOGLE_APPLICATION_CREDENTIALS_JSON_BASE64 in .env"
      );
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
    const translationClient = new Translate({ keyFilename: tempKeyPath });
  }
  // 使用 Google Cloud Translation API
  async translateWithGoogleCloud(text, from = "en", to = "zh-TW") {
    try {
      const [translation] = await translationClient.translate(text, {
        from,
        to,
      });
      return translation;
    } catch (err) {
      console.error("Google Cloud Translation error:", err);
      throw err;
    }
  }

  //google free translate api
  async freeGoogleTranslate(text, from = "en", to = "zh-TW") {
    const url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map((part) => part[0]).join("");
  }
}

module.exports = new TranslatorApi();
