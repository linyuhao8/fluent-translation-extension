const fs = require("fs");
const path = require("path");
const os = require("os");
const dotenv = require("dotenv");
const { TranslationServiceClient } = require("@google-cloud/translate");

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

    const tempDir = os.tmpdir();
    const tempKeyPath = path.join(tempDir, "google-translate-key.json");

    if (!fs.existsSync(tempKeyPath)) {
      fs.writeFileSync(tempKeyPath, credentialsJson);
    }

    // 初始化 v3 Translation client
    this.translationClient = new TranslationServiceClient({
      keyFilename: tempKeyPath,
    });

    // 取得專案 ID（建議從 JSON 解析取得或用 .env）
    this.projectId = JSON.parse(credentialsJson).project_id;
  }

  // 使用 Google Cloud Translation API v3
  async translateWithGoogleCloud(
    text,
    sourceLang = "en",
    targetLang = "zh-TW"
  ) {
    try {
      const request = {
        parent: `projects/${this.projectId}/locations/global`,
        contents: [text],
        mimeType: "text/plain",
        sourceLanguageCode: sourceLang,
        targetLanguageCode: targetLang,
      };

      const [response] = await this.translationClient.translateText(request);
      return response.translations[0].translatedText;
    } catch (err) {
      console.error("Google Cloud Translation error:", err);
      throw err;
    }
  }

  // 免費 Google Translate API（非官方，建議僅限測試用）
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
