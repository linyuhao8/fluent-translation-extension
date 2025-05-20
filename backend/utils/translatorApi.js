class TranslatorApi {
  constructor() {}
  //google translate api
  async freeGoogleTranslate(text, from = "en", to = "zh-TW") {
    const url = `http://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map((part) => part[0]).join("");
  }

  async translateText(text, from = "en", to = "zh-TW") {
    try {
      const response = await fetch(
        "https://fluent-quick-translation-extension.onrender.com/api/translate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, sourceLang: from, targetLang: to }),
        }
      );

      if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.translatedText) {
        return data.translatedText;
      }
    } catch (error) {
      console.log("translateText error:", error);
      return null; // 或者你可以選擇拋出 error，看你要怎麼用
    }
  }
}

module.exports = new TranslatorApi();
