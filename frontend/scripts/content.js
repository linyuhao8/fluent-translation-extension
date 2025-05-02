(function () {
  // 檢查是否已經注入過
  if (window.fluentQuickAlreadyInjected) return;
  window.fluentQuickAlreadyInjected = true;

  const fluentquick_languages_data = {
    "zh-TW": { code: "zh-TW", name: "繁體中文", threshold: 0.5, priority: 2 },
    en: { code: "en", name: "英文", threshold: 0.5, priority: 1 },
    ja: { code: "ja", name: "日文", threshold: 0.5, priority: 999 },
    ko: { code: "ko", name: "韓文", threshold: 0.5, priority: 999 },
    es: { code: "es", name: "西班牙文", threshold: 0.5, priority: 999 },
    fr: { code: "fr", name: "法文", threshold: 0.5, priority: 999 },
    de: { code: "de", name: "德文", threshold: 0.5, priority: 999 },
    ru: { code: "ru", name: "俄文", threshold: 0.5, priority: 999 },
    it: { code: "it", name: "義大利文", threshold: 0.5, priority: 999 },
    pt: { code: "pt", name: "葡萄牙文", threshold: 0.5, priority: 999 },
    vi: { code: "vi", name: "越南文", threshold: 0.5, priority: 999 },
    th: { code: "th", name: "泰文", threshold: 0.5, priority: 999 },
    id: { code: "id", name: "印尼文", threshold: 0.5, priority: 999 },
    tr: { code: "tr", name: "土耳其文", threshold: 0.5, priority: 999 },
    nl: { code: "nl", name: "荷蘭文", threshold: 0.5, priority: 999 },
    pl: { code: "pl", name: "波蘭文", threshold: 0.5, priority: 999 },
    sv: { code: "sv", name: "瑞典文", threshold: 0.5, priority: 999 },
    uk: { code: "uk", name: "烏克蘭文", threshold: 0.5, priority: 999 },
    ar: { code: "ar", name: "阿拉伯文", threshold: 0.5, priority: 999 },
    he: { code: "he", name: "希伯來文", threshold: 0.5, priority: 999 },
    "zh-CN": { code: "zh-CN", name: "簡體中文", threshold: 0.5, priority: 999 },
  };

  const fluentquick_languages_detect_functions = {
    // 繁體中文偵測
    // 繁體中文偵測
    "zh-TW": (text) => {
      const traditionalSpecific =
        text.match(/[\u4e00-\u9fff\uF900-\uFAFF]/g) || [];
      // 確保比例大於一定閾值才認定為繁體中文
      const ratio = traditionalSpecific.length / text.length;
      return ratio > 0.5 ? ratio : 0; // 比例高於50%才判定為繁體
    },

    // 簡體中文偵測
    "zh-CN": (text) => {
      const simplifiedSpecific = text.match(/[\u3400-\u4DBF]/g) || [];
      // 確保比例大於一定閾值才認定為簡體中文
      const ratio = simplifiedSpecific.length / text.length;
      return ratio > 0.5 ? ratio : 0; // 比例高於50%才判定為簡體
    },
    en: (text) => {
      const englishChars = text.match(/[a-zA-Z]/g) || [];
      return englishChars.length / text.length;
    },
    ja: (text) => {
      const japaneseChars = text.match(/[\u3040-\u30ff\u3400-\u4dbf]/g) || [];
      return japaneseChars.length / text.length;
    },
    ko: (text) => {
      const koreanChars = text.match(/[\uAC00-\uD7AF]/g) || [];
      return koreanChars.length / text.length;
    },
    es: (text) => {
      const spanishChars = text.match(/[a-zA-ZñÑáéíóúüÁÉÍÓÚÜ]/g) || [];
      return spanishChars.length / text.length;
    },
    fr: (text) => {
      const frenchChars = text.match(/[a-zA-Zàâçéèêëîïôûùüÿñæœ]/g) || [];
      return frenchChars.length / text.length;
    },
    de: (text) => {
      const germanChars = text.match(/[äöüßÄÖÜẞ]/g) || [];
      const germanRatio = germanChars.length / text.length;
      return germanRatio > 0.1 ? germanRatio : 0; // 比例高於10%才判定為德文
    },

    ru: (text) => {
      const russianChars = text.match(/[\u0400-\u04FF]/g) || [];
      return russianChars.length / text.length;
    },
    it: (text) => {
      const italianChars = text.match(/[a-zA-Zàèéìòù]/g) || [];
      return italianChars.length / text.length;
    },
    pt: (text) => {
      const portugueseChars = text.match(/[a-zA-Záâãàçéêíóôõúü]/g) || [];
      return portugueseChars.length / text.length;
    },
    vi: (text) => {
      const vietnameseChars =
        text.match(
          /[a-zA-Zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/g
        ) || [];
      return vietnameseChars.length / text.length;
    },
    th: (text) => {
      const thaiChars = text.match(/[\u0E00-\u0E7F]/g) || [];
      return thaiChars.length / text.length;
    },
    id: (text) => {
      const indonesianChars = text.match(/[a-zA-Z]/g) || [];
      return indonesianChars.length / text.length;
    },
    tr: (text) => {
      const turkishChars = text.match(/[a-zA-ZçğıöşüÇĞİÖŞÜ]/g) || [];
      return turkishChars.length / text.length;
    },
    nl: (text) => {
      const dutchChars = text.match(/[a-zA-Zéèëïöü]/g) || [];
      return dutchChars.length / text.length;
    },
    pl: (text) => {
      const polishChars = text.match(/[a-zA-ZąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g) || [];
      return polishChars.length / text.length;
    },
    sv: (text) => {
      const swedishChars = text.match(/[a-zA-ZåäöÅÄÖ]/g) || [];
      return swedishChars.length / text.length;
    },
    uk: (text) => {
      const ukrainianChars = text.match(/[\u0400-\u04FF]/g) || [];
      return ukrainianChars.length / text.length;
    },
    ar: (text) => {
      const arabicChars = text.match(/[\u0600-\u06FF]/g) || [];
      return arabicChars.length / text.length;
    },
    he: (text) => {
      const hebrewChars = text.match(/[\u0590-\u05FF]/g) || [];
      return hebrewChars.length / text.length;
    },
  };

  // UI object
  class LoadingManager {
    constructor() {
      this.loadingElement = null;
    }

    // 顯示加載狀態
    showLoading(targetEl) {
      // 檢查是否已有加載元素
      if (this.loadingElement) {
        return this.loadingElement;
      }
      this.loadingElement = document.createElement("div");
      this.loadingElement.classList.add("loading");
      this.loadingElement.textContent = "Loading...";
      this.loadingElement.style.color = "#333";
      this.loadingElement.style.backgroundColor = "#00FF4C";
      this.loadingElement.style.display = "inline-flex";
      targetEl.appendChild(this.loadingElement);
      return this.loadingElement;
    }

    // 移除加載狀態
    removeLoading() {
      if (this.loadingElement) {
        this.loadingElement.remove();
        this.loadingElement = null;
      }
    }
  }
  // SpeechManger
  class SpeechManager {
    constructor() {
      this.isPlaying = false;
      this.utterance = null;
    }
    // Wait for the library to finish loading
    waitForVoices() {
      return new Promise((resolve) => {
        const voices = speechSynthesis.getVoices();
        if (voices.length) {
          resolve(voices);
        } else {
          // 當語音庫還沒載入時，監聽 onvoiceschanged 事件
          speechSynthesis.onvoiceschanged = () => {
            resolve(speechSynthesis.getVoices());
          };
        }
      });
    }
    // Play Voice
    async play(
      text,
      lang = "zh-TW",
      playBtn,
      pauseBtn,
      statusText,
      readBtn,
      readSourceBtn
    ) {
      const voices = await this.waitForVoices();
      if (!voices || voices.length === 0) {
        alert(
          "No voices available. Your browser may not support speech synthesis."
        );
        return;
      }
      const voice =
        voices.find((v) => v.lang === lang) ||
        voices.find((v) => v.lang.startsWith(lang + "-"));

      // 播放語音
      this.isPlaying = true;
      this.utterance = new SpeechSynthesisUtterance(text);
      this.utterance.lang = lang;
      this.utterance.voice = voice;

      // 播放中時，禁用相關按鈕
      statusText.textContent = "Playing";
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      readBtn.disabled = true;
      readSourceBtn.disabled = true;

      speechSynthesis.speak(this.utterance);

      // 結束後恢復按鈕狀態
      this.utterance.onend = () => {
        this.isPlaying = false;
        statusText.textContent = "End";
        playBtn.disabled = true; // 允許播放
        pauseBtn.disabled = true; // 禁用暫停
        readBtn.disabled = false; // 允許繼續操作
        readSourceBtn.disabled = false;
      };
    }
    // Pause
    pause(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      if (this.isPlaying) {
        this.isPlaying = false;
        speechSynthesis.pause();
        statusText.textContent = "pause";
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        readBtn.disabled = true;
        readSourceBtn.disabled = true;
      }
    }
    // Resume
    resume(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      if (!this.isPlaying && this.utterance) {
        // 檢查語音是否存在
        this.isPlaying = true;
        speechSynthesis.resume();
        statusText.textContent = "resume";
        playBtn.disabled = true; // 禁用播放按鈕
        pauseBtn.disabled = false; // 允許暫停
        readBtn.disabled = true;
        readSourceBtn.disabled = true;
      }
    }
    // Stop
    stop(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      this.isPlaying = false;
      speechSynthesis.cancel();
      statusText.textContent = "stop";
      playBtn.disabled = false; // 允許重新播放
      pauseBtn.disabled = true; // 禁用暫停按鈕
    }
  }
  // API
  class TranslatorApi {
    constructor() {}
    //google translate api
    async freeGoogleTranslate(text, from = "en", to = "zh-TW") {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
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
  // TextUtils
  class TextUtils {
    static UNSAFE_TAGS = [
      "A",
      "BUTTON",
      "INPUT",
      "TEXTAREA",
      "SELECT",
      "LABEL",
    ];
    // Check the selected element, if it is an interactive element it will return null.
    static findSuitableContainer(node) {
      let current = node;

      // Start from the given node and move up the DOM tree
      while (current && current !== document.body) {
        // Check if the node is an element and not an interactive (unsafe) tag
        if (
          current.nodeType === Node.ELEMENT_NODE && // Ensure it's a valid HTML element
          !TextUtils.UNSAFE_TAGS.includes(current.tagName) // Skip tags like <a>, <button>, etc.
        ) {
          return current; // Found a suitable container
        }

        // Move up to the parent node and continue the check
        current = current.parentNode;
      }

      // If no suitable container is found, return null
      return null;
    }

    static sanitizeTextForAPI(text) {
      if (!text) return "";

      return (
        text
          // 替換非標準引號（中文引號）為標準 ASCII 引號
          .replace(/[“”]/g, '"')
          .replace(/[‘’]/g, "'")

          // 移除不可見控制字元 (例如 \u0000 - \u001F)
          .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")

          // 移除換行與回車
          .replace(/[\r\n]+/g, " ")

          // 壓縮多個空白為單一空白
          .replace(/\s+/g, " ")

          // 最後去除首尾空白
          .trim()
      );
    }
  }
  // LanguageUtils
  class LanguageUtils {
    // Language Detection Function - Returns the most probable languages and scores.
    static decideTargetLanguage(text, languagesData, detectFunctions) {
      let highestScore = 0;
      let detectedLanguage = {
        languageCode: "",
        languageName: "Unknown Language",
      };
      for (const [langCode, langData] of Object.entries(languagesData)) {
        //算出每個語言的分數
        const detectFn = detectFunctions[langCode];
        if (!detectFn) {
          console.log(`no detect function: ${langCode}`);
          continue;
        }
        const score = detectFn(text);
        if (score > highestScore) {
          highestScore = score;
          detectedLanguage = {
            languageCode: langData.code,
            languageName: langData.name,
          };
        }
      }

      return detectedLanguage;
    }

    // Input the original language and select the highest level of user-defined language as the target translation language. return languages sort array
    static getPriority(sourceLanguage) {
      //優先級陣列
      let priorityArray = [];
      for (const [langCode, langData] of Object.entries(languagesData)) {
        //使用使用者目前最高等級的語言作為目標語言
        let effectivePriority = langData.priority;
        if (sourceLanguage == langData.code) {
          effectivePriority = 0;
          console.log(langData.code);
        }
        priorityArray.push({
          code: langData.code,
          name: langData.name,
          priority: effectivePriority,
        });
      }
      priorityArray.sort((a, b) => a.priority - b.priority);
      return priorityArray;
    }
  }

  // save data to chrome local
  let languagesData = null;
  chrome.storage.local.get("languagesData", (result) => {
    // 如果沒有找到 'languagesData'，才設置預設資料
    if (!result.languagesData) {
      chrome.storage.local.set({ languagesData: fluentquick_languages_data });
      console.log("設置了預設語言資料");
    } else {
      console.log("已讀取儲存的語言資料");
    }
    languagesData = result.languagesData || fluentquick_languages_data;
  });

  // 創建實例
  const loadingManager = new LoadingManager();
  const speechManager = new SpeechManager();
  const translatorAPi = new TranslatorApi();

  //handle mouse select text
  let currentSelectedText = "";
  let currentSourceLanguage = "";
  let currentTargetLanguage = ""; //func will handle this

  //Front-end and back-end need to be the same
  const MAX_CHARACTERS = 1000;

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // ==================================================
  // 🔵 Event Listeners - (Selection, Keydown, Runtime)
  // ==================================================

  // if mouse selection change detection source language and target language
  // Add event listener for selection changes
  document.addEventListener("selectionchange", () => {
    // Get the current selection
    const selection = window.getSelection();

    // Get the selected text and trim whitespace
    const text = selection.toString().trim();

    // Only proceed if there's new text selected
    if (text && text !== currentSelectedText) {
      currentSelectedText = text;

      // Clean the text for language detection (remove punctuation and numbers)
      const cleanText = TextUtils.sanitizeTextForAPI(currentSelectedText);

      // Skip processing if text is empty after cleaning
      if (cleanText.length === 0) {
        console.log("⚠️ Text contains only punctuation or numbers");
        return;
      }

      // Check if Chrome extension context is valid before proceeding
      if (
        typeof chrome !== "undefined" &&
        chrome.runtime &&
        chrome.runtime.id
      ) {
        try {
          chrome.storage.local.get("languagesData", (result) => {
            // Handle potential empty result
            if (chrome.runtime.lastError) {
              console.log("Storage access error:", chrome.runtime.lastError);
              useFallbackLanguages(cleanText);
              return;
            }

            // Use stored language data or fall back to default
            languagesData = result.languagesData || fluentquick_languages_data;

            // Detect language of the selected text
            const detectionResult = LanguageUtils.decideTargetLanguage(
              cleanText,
              languagesData,
              fluentquick_languages_detect_functions
            );

            // Determine translation direction based on detected language
            const priority = LanguageUtils.getPriority(
              detectionResult.languageCode
            );

            // Set source and target languages
            currentSourceLanguage = priority[0].code;
            currentTargetLanguage = priority[1].code;

            console.log("Detected language:", detectionResult.languageCode);
            console.log("Source language:", currentSourceLanguage);
            console.log("Target language:", currentTargetLanguage);

            // Proceed with translation or other actions here
            processSelectedText(
              cleanText,
              currentSourceLanguage,
              currentTargetLanguage
            );
          });
        } catch (e) {
          console.log("Storage access failed:", e);
          useFallbackLanguages(cleanText);
        }
      } else {
        console.log("Chrome extension context is invalid");
        useFallbackLanguages(cleanText);
      }
    }
  });

  // Fallback function when storage access fails
  function useFallbackLanguages(text) {
    // Use default languages
    const defaultSourceLang = "en"; // Default source language (e.g., English)
    const defaultTargetLang = "zh"; // Default target language (e.g., Chinese)

    console.log(
      "Using fallback languages - Source:",
      defaultSourceLang,
      "Target:",
      defaultTargetLang
    );

    // Continue with default languages
    processSelectedText(text, defaultSourceLang, defaultTargetLang);
  }

  // Process the selected text with the determined languages
  function processSelectedText(text, sourceLang, targetLang) {
    // Implement your processing logic here
    // For example, show translation UI, call translation API, etc.
    console.log(
      `Ready to process text from ${sourceLang} to ${targetLang}: "${text.substring(
        0,
        50
      )}${text.length > 50 ? "..." : ""}"`
    );
  }

  // Shortcut Keys handle keyboard
  document.addEventListener("keydown", async (e) => {
    // 注意大小寫：是 "KeyT" 而不是 "keyT"
    if (e.code === "KeyT" && e.altKey && currentSelectedText) {
      try {
        await handleTranslateAndInsert();
      } catch (err) {
        console.log("Shortcut translation error:", err);
      }
    }
  });

  //handle popup setting message
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // if (message === "ping") {
    //   sendResponse(true);
    //   return true; // 表示將異步回應
    // }
    if (message.action === "changeTranslateionFontSize") {
      const translationDivs = document.querySelectorAll(".translation-text");

      translationDivs.forEach((div) => {
        div.style.fontSize = message.size;
      });
    }
    if (message.action === "changeSourceFontSize") {
      const translationDivs = document.querySelectorAll(".translate-source");

      translationDivs.forEach((div) => {
        div.style.fontSize = message.size;
      });
    }
    if (message.action === "updateButtonsPosition") {
      const position = message.position;
      const translationResults = document.querySelectorAll(
        ".translation-content"
      );

      translationResults.forEach((translationResult) => {
        if (translationResult) {
          translationResult.style.flexDirection =
            position === "top" ? "column" : "column-reverse";
        }
      });
    }
    if (message.action === "TRANSLATE_SELECTION") {
      handleTranslateAndInsert();
    }
  });

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // =========================
  // 🟠 Sub Functions
  // =========================

  // Handling APi and inserting translation boxes (trigger shortcut keys or right-click to translate).
  async function handleTranslateAndInsert() {
    // Remove the old translation box first to avoid interferences.
    const box = document.querySelector(".translation-result");
    if (box) box.remove();

    // Check how many words are selected, if the limit is exceeded, it will stop.
    const selection = window.getSelection();
    let selectedText = selection.toString();

    // 檢查是否有選取文字
    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);
      const rawTarget = range.startContainer.parentNode;
      const selectedElement = TextUtils.findSuitableContainer(rawTarget);

      if (!selectedElement) {
        console.log("⚠️ Unable to find a suitable insertion container");
        return;
      }

      if (selectedText.length > MAX_CHARACTERS) {
        selectedText = selectedText.substring(0, MAX_CHARACTERS);
        alert(
          "The selected text is too long and has been shortened to a maximum of " +
            MAX_CHARACTERS +
            " characters."
        );
        return null;
      }

      // loading...
      loadingManager.showLoading(selectedElement);
      // showTranslationLoading(selectedElement);

      // Test Environment API
      // const translatedText = await freeGoogleTranslate(
      //   currentSelectedText,
      //   currentSourceLanguage,
      //   currentTargetLanguage
      // );

      // Production Environment API
      const translatedText = await translatorAPi.translateText(
        currentSelectedText,
        currentSourceLanguage,
        currentTargetLanguage
      );

      // remove loading
      loadingManager.removeLoading();
      // removeTranslationLoading(selectedElement);

      // If there is a voice playing, cancel it first.
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }

      // Insert Translation Box
      insertTranslationUnderTarget(
        selectedElement,
        translatedText,
        currentTargetLanguage,
        currentSelectedText,
        currentSourceLanguage
      );
    }
  }

  // Insert translation boxes html
  function insertTranslationUnderTarget(
    targetEl,
    translatedText,
    translatedCode,
    currentSelectedText,
    currentSourceLanguage
  ) {
    // 確保目標元素存在
    if (!targetEl) {
      console.log("Target element not found");
      return null;
    }

    // 如果有舊的翻譯區塊，先移除
    const oldTranslation = targetEl.querySelector(".translation-result");
    if (oldTranslation) {
      // 確保先取消任何語音合成
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }

      oldTranslation.remove();
    }

    // 使用文檔片段來提高性能
    const fragment = document.createDocumentFragment();

    // 創建外層容器
    const translationDiv = document.createElement("div");
    translationDiv.classList.add("translation-result");

    // 創建標題區域
    const headerDiv = document.createElement("div");
    headerDiv.classList.add("translation-header");

    const headerTitle = document.createElement("span");
    headerTitle.classList.add("translation-header-title");
    headerTitle.textContent = "Fluent Translate";

    const headerSpan = document.createElement("span");
    headerSpan.classList.add("translation-header-span");
    headerSpan.textContent = "Alt+T or Right click";

    headerDiv.appendChild(headerTitle);
    headerDiv.appendChild(headerSpan);

    // 創建內容區域
    const contentDiv = document.createElement("div");
    contentDiv.classList.add("translation-content");

    // 創建翻譯文字框
    const textBox = document.createElement("div");
    textBox.classList.add("translation-text-box");

    // 創建來源標題
    const sourceTitle = document.createElement("p");
    sourceTitle.classList.add("translate-source-title");
    sourceTitle.textContent = "Source";

    // 創建來源文字
    const source = document.createElement("div");
    source.classList.add("translate-source");
    source.textContent = currentSelectedText || "";

    // 創建翻譯標題
    const translateTitle = document.createElement("p");
    translateTitle.classList.add("translate-text-title");
    translateTitle.textContent = "translated";

    // 創建翻譯文字
    const text = document.createElement("div");
    text.classList.add("translation-text");
    text.textContent = translatedText || "";

    // 組織文字框內容
    textBox.appendChild(sourceTitle);
    textBox.appendChild(source);
    textBox.appendChild(translateTitle);
    textBox.appendChild(text);

    // 創建控制按鈕區
    const controls = document.createElement("div");
    controls.classList.add("translation-controls");

    // 建立按鈕函數 - 統一創建按鈕的邏輯
    const createButton = (
      className,
      title,
      iconSrc,
      buttonText,
      clickHandler
    ) => {
      const btn = document.createElement("button");
      btn.classList.add(className);
      btn.type = "button";
      btn.title = title;

      const img = document.createElement("img");
      img.src = iconSrc;
      img.alt = "icon";
      img.classList.add("icon-button");

      btn.appendChild(img);

      if (buttonText) {
        btn.appendChild(document.createTextNode(buttonText));
      }

      if (clickHandler) {
        btn.addEventListener("click", clickHandler);
      }

      return btn;
    };

    const createLink = (
      className,
      title,
      iconSrc,
      linkText,
      href,
      clickHandler
    ) => {
      const link = document.createElement("a");
      link.classList.add(className);
      link.title = title;
      link.href = href || "#";
      link.target = "_blank"; // 可選，若是外部頁面

      const img = document.createElement("img");
      img.src = iconSrc;
      img.alt = "icon";
      img.classList.add("icon-button");

      link.appendChild(img);

      if (linkText) {
        link.appendChild(document.createTextNode(linkText));
      }

      if (clickHandler) {
        link.addEventListener("click", clickHandler);
      }

      return link;
    };

    // 建立播放按鈕
    const playBtn = createButton(
      "translation-audioPlay-btn",
      "Play",
      chrome.runtime.getURL("icon/Play.svg")
    );
    playBtn.disabled = true;

    // 建立暫停按鈕
    const pauseBtn = createButton(
      "translation-audioPause-btn",
      "Pause",
      chrome.runtime.getURL("icon/Pause.svg")
    );
    pauseBtn.disabled = true;

    // 建立Read Translation按鈕
    const readBtn = createButton(
      "translation-read-btn",
      "Read Translation Text",
      chrome.runtime.getURL("icon/Speaker.svg"),
      "Read",
      () => {
        if (typeof speechManager !== "undefined") {
          speechManager.play(
            translatedText,
            translatedCode,
            playBtn,
            pauseBtn,
            statusLabel,
            readBtn,
            readSourceBtn
          );
        }
      }
    );

    // 創建Read Source按鈕
    const readSourceBtn = createButton(
      "translation-readSource-btn",
      "Read Source",
      chrome.runtime.getURL("icon/Voice.svg"),
      "ReadSource",
      () => {
        if (typeof speechManager !== "undefined") {
          speechManager.play(
            currentSelectedText,
            currentSourceLanguage,
            playBtn,
            pauseBtn,
            statusLabel,
            readBtn,
            readSourceBtn
          );
        }
      }
    );

    // 播放按鈕邏輯
    playBtn.addEventListener("click", () => {
      if (typeof speechManager !== "undefined") {
        speechManager.resume(
          playBtn,
          pauseBtn,
          statusLabel,
          readBtn,
          readSourceBtn
        );
      }
    });

    // 暫停按鈕邏輯
    pauseBtn.addEventListener("click", () => {
      if (typeof speechManager !== "undefined") {
        speechManager.pause(
          playBtn,
          pauseBtn,
          statusLabel,
          readBtn,
          readSourceBtn
        );
      }
    });

    // 創建Toggle Source按鈕
    const toggleSourceBtn = createButton(
      "translation-toggle-source-btn",
      "Hide/show Source",
      chrome.runtime.getURL("icon/Blind.svg"),
      "display original",
      () => {
        source.style.display =
          source.style.display === "none" ? "block" : "none";
        sourceTitle.style.display =
          sourceTitle.style.display === "none" ? "block" : "none";
      }
    );

    // 創建Close按鈕
    const closeBtn = createButton(
      "translation-close-btn",
      "Close",
      chrome.runtime.getURL("icon/Close.svg"),
      "close",
      () => {
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        translationDiv.remove();
      }
    );

    const docLink = createLink(
      "translation-setting-link",
      "Doc",
      chrome.runtime.getURL("icon/Book.svg"),
      "Doc",
      "chrome-extension://fluent-translate/welcome-en.html"
    );

    // 狀態顯示
    const statusTextBtn = document.createElement("div");
    statusTextBtn.classList.add("status-text-btn");
    statusTextBtn.title = "Status";

    const statusLabel = document.createElement("span");
    statusLabel.textContent = "unplayed";
    statusLabel.classList.add("status-text");
    statusTextBtn.appendChild(statusLabel);

    // 組合控制按鈕
    controls.appendChild(playBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(readBtn);
    controls.appendChild(readSourceBtn);
    controls.appendChild(toggleSourceBtn);
    controls.appendChild(closeBtn);
    controls.appendChild(docLink);
    controls.appendChild(statusTextBtn);

    // 組合整體結構
    contentDiv.appendChild(textBox);
    contentDiv.appendChild(controls);

    translationDiv.appendChild(headerDiv);
    translationDiv.appendChild(contentDiv);

    fragment.appendChild(translationDiv);

    // 添加到目標元素 - 使用文檔片段提高性能
    targetEl.appendChild(fragment);

    // 返回創建的翻譯元素，便於後續操作
    return translationDiv;
  }
})();
