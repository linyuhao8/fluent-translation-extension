(function () {
  // 檢查是否已經注入過
  if (window.fluentQuickAlreadyInjected) return;
  window.fluentQuickAlreadyInjected = true;

  const fluentquick_languages_data = {
    zh: { code: "zh-TW", name: "中文", threshold: 0.5, priority: 1 },
    en: { code: "en", name: "英文", threshold: 0.5, priority: 2 },
    ja: { code: "ja", name: "日文", threshold: 0.5, priority: 3 },
    ko: { code: "ko", name: "韓文", threshold: 0.5, priority: 4 },
    es: { code: "es", name: "西班牙文", threshold: 0.5, priority: 5 },
    fr: { code: "fr", name: "法文", threshold: 0.5, priority: 6 },
    de: { code: "de", name: "德文", threshold: 0.5, priority: 7 },
    ru: { code: "ru", name: "俄文", threshold: 0.5, priority: 8 },
    it: { code: "it", name: "義大利文", threshold: 0.5, priority: 9 },
    pt: { code: "pt", name: "葡萄牙文", threshold: 0.5, priority: 10 },
    vi: { code: "vi", name: "越南文", threshold: 0.5, priority: 11 },
    th: { code: "th", name: "泰文", threshold: 0.5, priority: 12 },
    id: { code: "id", name: "印尼文", threshold: 0.5, priority: 13 },
    tr: { code: "tr", name: "土耳其文", threshold: 0.5, priority: 14 },
    nl: { code: "nl", name: "荷蘭文", threshold: 0.5, priority: 15 },
    pl: { code: "pl", name: "波蘭文", threshold: 0.5, priority: 16 },
    sv: { code: "sv", name: "瑞典文", threshold: 0.5, priority: 17 },
    uk: { code: "uk", name: "烏克蘭文", threshold: 0.5, priority: 18 },
    ar: { code: "ar", name: "阿拉伯文", threshold: 0.5, priority: 19 },
    he: { code: "he", name: "希伯來文", threshold: 0.5, priority: 20 },
  };

  const fluentquick_languages_detect_functions = {
    zh: (text) => {
      const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
      return chineseChars.length / text.length;
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
      const germanChars = text.match(/[a-zA-ZäöüßÄÖÜẞ]/g) || [];
      return germanChars.length / text.length;
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

  //handle mouse select text
  let currentSelectedText = "";
  let currentSourceLanguage = ""; // 當前偵測到的語言
  let currentTargetLanguage = ""; // 當前目標語言
  const MAX_CHARACTERS = 500;

  document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();
    const text = selection.toString().trim();

    if (text && text !== currentSelectedText) {
      currentSelectedText = text;
    }
    // 移除標點符號和數字，但保留空格
    const cleanText = removePunctuationAndNumbers(currentSelectedText);

    // 判斷文字是否為空
    if (cleanText.length === 0) {
      console.log("⚠️ Text contains only punctuation or numbers");
      return;
    }

    // 偵測原始語言是甚麼
    const detectionResult = decideTargetLanguage(
      cleanText,
      fluentquick_languages_data,
      fluentquick_languages_detect_functions
    );

    // 計算優先級
    const priority = getPriority(detectionResult.languageCode);
    currentSourceLanguage = priority[0].code;
    currentTargetLanguage = priority[1].code;
    console.log(currentSourceLanguage, currentTargetLanguage);
  });

  // handle keyboard
  document.addEventListener("keydown", async (e) => {
    // click t to translate
    if (e.key === "t" && e.altKey && currentSelectedText) {
      handleTranslateAndInsert();
    }
  });

  //檢查選取到的element
  function findSuitableContainer(node) {
    const UNSAFE_TAGS = ["A", "BUTTON", "INPUT", "TEXTAREA", "SELECT", "LABEL"];
    let current = node;

    // 往上找一個合適的元素
    while (current && current !== document.body) {
      if (
        current.nodeType === Node.ELEMENT_NODE &&
        !UNSAFE_TAGS.includes(current.tagName)
      ) {
        return current;
      }
      current = current.parentNode;
    }

    return null;
  }

  //處理APi及插入翻譯框
  async function handleTranslateAndInsert() {
    //先移除舊的翻譯框避免互擾
    const box = document.querySelector(".translation-result");
    if (box) box.remove();

    const selection = window.getSelection();
    //檢查選取了多少字
    let selectedText = selection.toString();
    if (selectedText.length > MAX_CHARACTERS) {
      selectedText = selectedText.substring(0, MAX_CHARACTERS);
      alert(
        "The selected text is too long and has been shortened to a maximum of " +
          MAX_CHARACTERS +
          " characters."
      );

      return;
    }

    // 檢查是否有選取文字
    if (!selection.isCollapsed) {
      const range = selection.getRangeAt(0);

      const rawTarget = range.startContainer.parentNode;

      const selectedElement = findSuitableContainer(rawTarget);

      if (!selectedElement) {
        console.warn("⚠️ Unable to find a suitable insertion container");
        return;
      }

      // 顯示翻譯中狀態
      showTranslationLoading(selectedElement);

      // 取得翻譯文本
      // const translatedText = await freeGoogleTranslate(
      //   currentSelectedText,
      //   currentSourceLanguage,
      //   currentTargetLanguage
      // );

      const translatedText = await translateText(
        currentSelectedText,
        currentSourceLanguage,
        currentTargetLanguage
      );

      // 移除翻譯中顯示
      removeTranslationLoading(selectedElement);

      // 清除舊的語音播放

      // 如果有正在播放的語音，先取消它
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel(); // 取消當前播放的語音
      }

      // 直接刪除舊的翻譯區塊並插入新的
      insertTranslationUnderTarget(
        selectedElement,
        translatedText,
        currentTargetLanguage,
        currentSelectedText,
        currentSourceLanguage
      );
    }
  }

  // 移除標點符號和數字
  function removePunctuationAndNumbers(text) {
    // 移除所有標點符號、數字，保留 中文、英文、大寫小寫字母 和 空白
    return text
      .replace(/[^\p{L}\p{Script=Han}\s]/gu, "") // 保留所有 Unicode 的字母（Latin, Han等）+空格
      .trim();
  }

  // 語言偵測函數 - 回傳最可能的語言和分數
  function decideTargetLanguage(text, languagesData, detectFunctions) {
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

  // 將原始語言傳入 然後挑選出最高等級的語言作為目標翻譯語言
  function getPriority(sourceLanguage) {
    //優先級陣列
    priorityArray = [];
    for (const [langCode, langData] of Object.entries(
      fluentquick_languages_data
    )) {
      //使用使用者目前最高等級的語言作為目標語言
      let effectivePriority = langData.priority;
      if (sourceLanguage == langData.code) {
        effectivePriority = 0;
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

  // 取得第二高分的語言，可檢查中英混合(未來可新增)

  // 插入翻譯結果到選取元素下方
  function insertTranslationUnderTarget(
    targetEl,
    translatedText,
    translatedCode,
    currentSelectedText,
    currentSourceLanguage
  ) {
    // 如果有舊的翻譯區塊，先移除
    const oldTranslation = targetEl.querySelector(".translation-result");
    if (oldTranslation) oldTranslation.remove();

    // 創建外層容器
    const translationDiv = document.createElement("div");
    translationDiv.classList.add("translation-result");

    // 創建翻譯文字框
    const textBox = document.createElement("div");
    textBox.setAttribute("translate", "translation-text-box");

    // 創建來源文字
    const source = document.createElement("div");
    source.classList.add("translate-source");
    source.textContent = currentSelectedText;

    // 創建翻譯文字
    const text = document.createElement("div");
    text.classList.add("translation-text");
    text.textContent = translatedText;

    // 創建控制按鈕區
    const controls = document.createElement("div");
    controls.classList.add("translation-controls");

    // 建立播放按鈕
    const playBtn = document.createElement("button");
    playBtn.classList.add("translation-audioPlay-btn");
    playBtn.type = "button";
    playBtn.textContent = "▶";
    playBtn.disabled = true;
    playBtn.title = "Play";

    // 建立暫停按鈕
    const pauseBtn = document.createElement("button");
    pauseBtn.classList.add("translation-audioPause-btn");
    pauseBtn.type = "button";
    pauseBtn.textContent = "⏸";
    pauseBtn.disabled = true; // 預設禁用
    pauseBtn.title = "Pause";

    // 狀態顯示
    // 创建一个div容器
    const statusTextBtn = document.createElement("div");
    statusTextBtn.classList.add("status-text-btn");

    // 创建SVG代码
    const svg = `
  <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" class="icon-button">
    <!-- 圆形背景 -->
    <circle cx="20" cy="20" r="18" fill="#f0f0f0" stroke="#d0d0d0" stroke-width="1"/>
    
    <!-- 状态指示点 -->
    <circle cx="20" cy="20" r="8" fill="#888888" class="status-indicator">
      <animate attributeName="fill" values="#888888;#ff6b6b;#888888" dur="2s" repeatCount="indefinite" id="unplayed-indicator" begin="indefinite"/>
    </circle>
    
  </svg>
`;

    // 将SVG插入到statusText div中
    statusTextBtn.innerHTML = svg;

    // 创建一个文本节点并添加到div中
    const statusLabel = document.createElement("span");
    statusLabel.textContent = "unplayed";
    statusLabel.classList.add("status-text");
    statusTextBtn.appendChild(statusLabel);
    statusTextBtn.title = "Status";

    // 創建朗讀按鈕
    const readSourceBtn = document.createElement("button");
    readSourceBtn.classList.add("translation-readSource-btn");
    readSourceBtn.type = "button";
    readSourceBtn.title = "Read Source";

    // 創建朗讀按鈕
    const readBtn = document.createElement("button");
    readBtn.classList.add("translation-read-btn");
    readBtn.type = "button";
    readBtn.title = "Read Translation Text";
    readBtn.addEventListener("click", () => {
      speechManager.play(
        translatedText,
        translatedCode,
        playBtn,
        pauseBtn,
        statusLabel,
        readBtn,
        readSourceBtn
      );
    });

    // 播放按鈕邏輯
    playBtn.addEventListener("click", () => {
      speechManager.resume(
        playBtn,
        pauseBtn,
        statusLabel,
        readBtn,
        readSourceBtn
      );
    });

    // 暫停按鈕邏輯
    pauseBtn.addEventListener("click", () => {
      speechManager.pause(
        playBtn,
        pauseBtn,
        statusLabel,
        readBtn,
        readSourceBtn
      );
    });

    //撥放原始
    readSourceBtn.addEventListener("click", () => {
      speechManager.play(
        currentSelectedText,
        currentSourceLanguage,
        playBtn,
        pauseBtn,
        statusLabel,
        readBtn,
        readSourceBtn
      );
    });

    // 創建朗讀按鈕的SVG圖標
    const readSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    readSvg.setAttribute("viewBox", "0 0 40 40");
    readSvg.setAttribute("class", "icon-button");

    const readCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    readCircle.setAttribute("cx", "20");
    readCircle.setAttribute("cy", "20");
    readCircle.setAttribute("r", "18");
    readCircle.setAttribute("fill", "#0084ff");

    const readPath1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    readPath1.setAttribute("d", "M10,10 L10,30 L20,30 L30,20 L20,10 Z");
    readPath1.setAttribute("fill", "white");

    const readPath2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    readPath2.setAttribute("d", "M32,12 A12,12 0 0 1 32,28");
    readPath2.setAttribute("stroke", "white");
    readPath2.setAttribute("stroke-width", "2");
    readPath2.setAttribute("fill", "none");

    readSvg.appendChild(readCircle);
    readSvg.appendChild(readPath1);
    readSvg.appendChild(readPath2);

    readBtn.appendChild(readSvg);
    readBtn.appendChild(document.createTextNode("Read"));

    // 創建朗讀按鈕的SVG圖標
    const readSourceSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    readSourceSvg.setAttribute("viewBox", "0 0 40 40");
    readSourceSvg.setAttribute("class", "icon-button");

    const readSourceCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );

    readSourceCircle.setAttribute("cx", "20");
    readSourceCircle.setAttribute("cy", "20");
    readSourceCircle.setAttribute("r", "18");
    readSourceCircle.setAttribute("fill", "#0084ff");

    const readSourcePath1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    readSourcePath1.setAttribute("d", "M10,10 L10,30 L20,30 L30,20 L20,10 Z");
    readSourcePath1.setAttribute("fill", "white");

    const readSourcePath2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    readSourcePath2.setAttribute("d", "M32,12 A12,12 0 0 1 32,28");
    readSourcePath2.setAttribute("stroke", "white");
    readSourcePath2.setAttribute("stroke-width", "2");
    readSourcePath2.setAttribute("fill", "none");

    readSourceSvg.appendChild(readSourceCircle);
    readSourceSvg.appendChild(readSourcePath1);
    readSourceSvg.appendChild(readSourcePath2);

    readSourceBtn.appendChild(readSourceSvg);
    readSourceBtn.appendChild(document.createTextNode("ReadSource"));

    // 創建隱藏原文按鈕
    const toggleSourceBtn = document.createElement("button");
    toggleSourceBtn.classList.add("translation-toggle-source-btn");
    toggleSourceBtn.type = "button";
    toggleSourceBtn.title = "Hide/show Source";

    // 創建隱藏原文按鈕的SVG圖標
    const toggleSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    toggleSvg.setAttribute("class", "icon-button");
    toggleSvg.setAttribute("viewBox", "0 0 24 24");

    const togglePath = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path"
    );
    togglePath.setAttribute(
      "d",
      "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
    );

    toggleSvg.appendChild(togglePath);
    toggleSourceBtn.appendChild(toggleSvg);
    toggleSourceBtn.appendChild(document.createTextNode("display original"));
    toggleSourceBtn.addEventListener("click", () => {
      // 這裡添加隱藏/顯示原文的邏輯
      source.style.display = source.style.display === "none" ? "block" : "none";
    });

    // 創建關閉按鈕
    const closeBtn = document.createElement("button");
    closeBtn.classList.add("translation-close-btn");
    closeBtn.type = "button";
    closeBtn.title = "Close";

    // 創建關閉按鈕的SVG圖標
    const closeSvg = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    closeSvg.setAttribute("viewBox", "0 0 40 40");
    closeSvg.setAttribute("class", "icon-button");

    const closeCircle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    closeCircle.setAttribute("cx", "20");
    closeCircle.setAttribute("cy", "20");
    closeCircle.setAttribute("r", "18");
    closeCircle.setAttribute("fill", "#ff4d4f");

    const closeLine1 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    closeLine1.setAttribute("x1", "12");
    closeLine1.setAttribute("y1", "12");
    closeLine1.setAttribute("x2", "28");
    closeLine1.setAttribute("y2", "28");
    closeLine1.setAttribute("stroke", "white");
    closeLine1.setAttribute("stroke-width", "3");
    closeLine1.setAttribute("stroke-linecap", "round");

    const closeLine2 = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "line"
    );
    closeLine2.setAttribute("x1", "28");
    closeLine2.setAttribute("y1", "12");
    closeLine2.setAttribute("x2", "12");
    closeLine2.setAttribute("y2", "28");
    closeLine2.setAttribute("stroke", "white");
    closeLine2.setAttribute("stroke-width", "3");
    closeLine2.setAttribute("stroke-linecap", "round");

    closeSvg.appendChild(closeCircle);
    closeSvg.appendChild(closeLine1);
    closeSvg.appendChild(closeLine2);

    closeBtn.appendChild(closeSvg);
    closeBtn.appendChild(document.createTextNode("close"));
    closeBtn.addEventListener("click", () => {
      speechSynthesis.cancel();
      translationDiv.remove();
    });

    // 組合結構
    textBox.appendChild(source);
    textBox.appendChild(text);

    controls.appendChild(playBtn);
    controls.appendChild(pauseBtn);
    controls.appendChild(readBtn);
    controls.appendChild(readSourceBtn);
    controls.appendChild(toggleSourceBtn);
    controls.appendChild(closeBtn);
    controls.appendChild(statusTextBtn);

    translationDiv.appendChild(textBox);
    translationDiv.appendChild(controls);

    // 添加到目標元素
    targetEl.appendChild(translationDiv);

    return translationDiv;
  }

  let isPlaying = false;
  let utterance = null; // Move utterance outside so it can be accessed in pause/resume

  function waitForVoices() {
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

  const speechManager = {
    async play(
      text,
      lang = "zh-TW",
      playBtn,
      pauseBtn,
      statusText,
      readBtn,
      readSourceBtn
    ) {
      // 等待語音載入完成
      const voices = await waitForVoices();

      // 播放語音
      isPlaying = true;
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;

      // 播放中時，禁用相關按鈕
      statusText.textContent = "Playing";
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      readBtn.disabled = true;
      readSourceBtn.disabled = true;

      speechSynthesis.speak(utterance);

      // 結束後恢復按鈕狀態
      utterance.onend = () => {
        isPlaying = false;
        statusText.textContent = "End";
        playBtn.disabled = true; // 允許播放
        pauseBtn.disabled = true; // 禁用暫停
        readBtn.disabled = false; // 允許繼續操作
        readSourceBtn.disabled = false;
      };
    },

    pause(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      if (isPlaying) {
        isPlaying = false;
        speechSynthesis.pause();
        statusText.textContent = "pause";
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        readBtn.disabled = true;
        readSourceBtn.disabled = true;
      }
    },

    resume(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      if (!isPlaying && utterance) {
        // 檢查語音是否存在
        isPlaying = true;
        speechSynthesis.resume();
        statusText.textContent = "resume";
        playBtn.disabled = true; // 禁用播放按鈕
        pauseBtn.disabled = false; // 允許暫停
        readBtn.disabled = true;
        readSourceBtn.disabled = true;
      }
    },

    stop(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      isPlaying = false;
      speechSynthesis.cancel();
      statusText.textContent = "stop";
      playBtn.disabled = false; // 允許重新播放
      pauseBtn.disabled = true; // 禁用暫停按鈕
    },
  };

  //google translate api
  async function freeGoogleTranslate(text, from = "en", to = "zh-TW") {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(
      text
    )}`;
    const res = await fetch(url);
    const data = await res.json();
    return data[0].map((part) => part[0]).join("");
  }

  async function translateText(text, from = "en", to = "zh-TW") {
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      if (data.translatedText) {
        return data.translatedText;
      } else {
        console.log("Translation failed: No translatedText found.");
      }
    } catch (error) {
      console.error("translateText error:", error);
      return null; // 或者你可以選擇拋出 error，看你要怎麼用
    }
  }

  //handle loading text
  function showTranslationLoading(targetEl) {
    // 先檢查是否已經有 loading 存在
    let existing = targetEl.querySelector(".translation-loading");
    if (existing) return existing;

    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("translation-loading");
    loadingDiv.textContent = "翻譯中...";
    loadingDiv.style.color = "rgb(48, 147, 252)";

    // 可以根據你的設計加 spinner 或 icon
    // loadingDiv.innerHTML = '<span class="spinner"></span> 翻譯中...';

    targetEl.appendChild(loadingDiv);
    return loadingDiv;
  }

  //remove loading text
  function removeTranslationLoading(targetEl) {
    const loadingDiv = targetEl.querySelector(".translation-loading");
    if (loadingDiv) loadingDiv.remove();
  }

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
        ".translation-result"
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
})();
