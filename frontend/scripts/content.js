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

  //handle mouse select text
  let currentSelectedText = "";
  let currentSourceLanguage = "";
  let currentTargetLanguage = ""; //func will handle this

  //Front-end and back-end need to be the same
  const MAX_CHARACTERS = 500;

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // ==================================================
  // 🔵 Event Listeners - (Selection, Keydown, Runtime)
  // ==================================================
  //       \    /\
  //        )  ( ')
  //       (  /  )
  //        \(__)|

  // if mouse selection change detection source language and target language
  document.addEventListener("selectionchange", () => {
    //window selection
    const selection = window.getSelection();
    //remove space
    const text = selection.toString().trim();
    if (text && text !== currentSelectedText) {
      currentSelectedText = text;
    }

    // Removes punctuation and numbers, but retains spaces
    const cleanText = removePunctuationAndNumbers(currentSelectedText);

    // Determine if the text is empty, No follow-up
    if (cleanText.length === 0) {
      console.log("⚠️ Text contains only punctuation or numbers");
      return;
    }

    // Access to up-to-date language information (priority will change depending on the type of language selected)
    chrome.storage.local.get("languagesData", (result) => {
      languagesData = result.languagesData || fluentquick_languages_data;

      // Detect original language according to detect function
      // The most likely language code will be returned.
      const detectionResult = decideTargetLanguage(
        cleanText,
        languagesData,
        fluentquick_languages_detect_functions
      );

      // Use detectionResult to calculate the target language ranking of current users
      // If select content is in your primary language, it will be translated to your secondary language.
      // If select content is in your secondary language, it will be translated to your primary language.
      // If select content is in another language, it will be translated to your primary language.
      const priority = getPriority(detectionResult.languageCode);
      currentSourceLanguage = priority[0].code;
      currentTargetLanguage = priority[1].code;
      console.log(currentSourceLanguage, currentTargetLanguage);
    });
  });

  // Shortcut Keys handle keyboard
  document.addEventListener("keydown", async (e) => {
    // click t to translate
    if (e.key === "t" && e.key === "T" && e.altKey && currentSelectedText) {
      handleTranslateAndInsert();
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

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // =========================
  // 🟠 Sub Functions
  // =========================
  //       \    /\
  //        )  ( ')
  //       (  /  )
  //        \(__)|

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
      const selectedElement = findSuitableContainer(rawTarget);

      if (!selectedElement) {
        console.warn("⚠️ Unable to find a suitable insertion container");
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
      showTranslationLoading(selectedElement);

      // Test Environment API
      // const translatedText = await freeGoogleTranslate(
      //   currentSelectedText,
      //   currentSourceLanguage,
      //   currentTargetLanguage
      // );

      // Production Environment API
      const translatedText = await translateText(
        currentSelectedText,
        currentSourceLanguage,
        currentTargetLanguage
      );

      // remove loading
      removeTranslationLoading(selectedElement);

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
  // Insert translation boxes  html
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

    // 創建翻譯文字框
    const textBox = document.createElement("div");
    textBox.setAttribute("translate", "translation-text-box");

    // 創建來源文字 - 使用安全的文本操作
    const source = document.createElement("div");
    source.classList.add("translate-source");
    source.textContent = currentSelectedText || "";

    // 創建翻譯文字 - 使用安全的文本操作
    const text = document.createElement("div");
    text.classList.add("translation-text");
    text.textContent = translatedText || "";

    // 創建控制按鈕區
    const controls = document.createElement("div");
    controls.classList.add("translation-controls");

    // 建立按鈕函數 - 統一創建按鈕的邏輯
    const createButton = (className, title, clickHandler) => {
      const btn = document.createElement("button");
      btn.classList.add(className);
      btn.type = "button";
      btn.title = title;
      if (clickHandler) {
        btn.addEventListener("click", clickHandler);
      }
      return btn;
    };

    // 建立播放按鈕
    const playBtn = createButton("translation-audioPlay-btn", "Play");
    playBtn.textContent = "▶";
    playBtn.disabled = true;

    // 建立暫停按鈕
    const pauseBtn = createButton("translation-audioPause-btn", "Pause");
    pauseBtn.textContent = "⏸";
    pauseBtn.disabled = true;

    // 狀態顯示
    const statusTextBtn = document.createElement("div");
    statusTextBtn.classList.add("status-text-btn");
    statusTextBtn.innerHTML = `
    <svg viewBox="0 0 120 40" xmlns="http://www.w3.org/2000/svg" class="icon-button">
      <circle cx="20" cy="20" r="18" fill="#f0f0f0" stroke="#d0d0d0" stroke-width="1"/>
      <circle cx="20" cy="20" r="8" fill="#888888" class="status-indicator">
        <animate attributeName="fill" values="#888888;#ff6b6b;#888888" dur="2s" repeatCount="indefinite" id="unplayed-indicator" begin="indefinite"/>
      </circle>
    </svg>
  `;
    statusTextBtn.title = "Status";

    const statusLabel = document.createElement("span");
    statusLabel.textContent = "unplayed";
    statusLabel.classList.add("status-text");
    statusTextBtn.appendChild(statusLabel);

    // 創建SVG元素的輔助函數
    const createSvgElement = (type, attributes = {}) => {
      const element = document.createElementNS(
        "http://www.w3.org/2000/svg",
        type
      );
      Object.entries(attributes).forEach(([key, value]) => {
        element.setAttribute(key, value);
      });
      return element;
    };

    // 創建Read Translation按鈕
    const readBtn = createButton(
      "translation-read-btn",
      "Read Translation Text",
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

    const readSvg = createSvgElement("svg", {
      viewBox: "0 0 40 40",
      class: "icon-button",
    });
    readSvg.appendChild(
      createSvgElement("circle", {
        cx: "20",
        cy: "20",
        r: "18",
        fill: "#0084ff",
      })
    );
    readSvg.appendChild(
      createSvgElement("path", {
        d: "M10,10 L10,30 L20,30 L30,20 L20,10 Z",
        fill: "white",
      })
    );
    readSvg.appendChild(
      createSvgElement("path", {
        d: "M32,12 A12,12 0 0 1 32,28",
        stroke: "white",
        "stroke-width": "2",
        fill: "none",
      })
    );

    readBtn.appendChild(readSvg);
    readBtn.appendChild(document.createTextNode("Read"));

    // 創建Read Source按鈕
    const readSourceBtn = createButton(
      "translation-readSource-btn",
      "Read Source",
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

    const readSourceSvg = createSvgElement("svg", {
      viewBox: "0 0 40 40",
      class: "icon-button",
    });
    readSourceSvg.appendChild(
      createSvgElement("circle", {
        cx: "20",
        cy: "20",
        r: "18",
        fill: "#0084ff",
      })
    );
    readSourceSvg.appendChild(
      createSvgElement("path", {
        d: "M10,10 L10,30 L20,30 L30,20 L20,10 Z",
        fill: "white",
      })
    );
    readSourceSvg.appendChild(
      createSvgElement("path", {
        d: "M32,12 A12,12 0 0 1 32,28",
        stroke: "white",
        "stroke-width": "2",
        fill: "none",
      })
    );

    readSourceBtn.appendChild(readSourceSvg);
    readSourceBtn.appendChild(document.createTextNode("ReadSource"));

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
      () => {
        source.style.display =
          source.style.display === "none" ? "block" : "none";
      }
    );

    const toggleSvg = createSvgElement("svg", {
      class: "icon-button",
      viewBox: "0 0 24 24",
    });
    toggleSvg.appendChild(
      createSvgElement("path", {
        d: "M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z",
      })
    );

    toggleSourceBtn.appendChild(toggleSvg);
    toggleSourceBtn.appendChild(document.createTextNode("display original"));

    // 創建Close按鈕
    const closeBtn = createButton("translation-close-btn", "Close", () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      translationDiv.remove();
    });

    const closeSvg = createSvgElement("svg", {
      viewBox: "0 0 40 40",
      class: "icon-button",
    });
    closeSvg.appendChild(
      createSvgElement("circle", {
        cx: "20",
        cy: "20",
        r: "18",
        fill: "#ff4d4f",
      })
    );
    closeSvg.appendChild(
      createSvgElement("line", {
        x1: "12",
        y1: "12",
        x2: "28",
        y2: "28",
        stroke: "white",
        "stroke-width": "3",
        "stroke-linecap": "round",
      })
    );
    closeSvg.appendChild(
      createSvgElement("line", {
        x1: "28",
        y1: "12",
        x2: "12",
        y2: "28",
        stroke: "white",
        "stroke-width": "3",
        "stroke-linecap": "round",
      })
    );

    closeBtn.appendChild(closeSvg);
    closeBtn.appendChild(document.createTextNode("close"));

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
    fragment.appendChild(translationDiv);

    // 添加到目標元素 - 使用文檔片段提高性能
    targetEl.appendChild(fragment);

    // 返回創建的翻譯元素，便於後續操作
    return translationDiv;
  }

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // =========================
  // 🔵 API
  // =========================
  //       \    /\
  //        )  ( ')
  //       (  /  )
  //        \(__)|

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
        console.log(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.translatedText) {
        return data.translatedText;
      } else {
        console.log("Translation failed: No translatedText found.");
      }
    } catch (error) {
      console.log("translateText error:", error);
      return null; // 或者你可以選擇拋出 error，看你要怎麼用
    }
  }

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // =========================
  // 🟠 Translation Related Functions
  // =========================
  //       \    /\
  //        )  ( ')
  //       (  /  )
  //        \(__)|

  // Language Detection Function - Returns the most probable languages and scores.
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

  // Input the original language and select the highest level of user-defined language as the target translation language. return languages sort array
  function getPriority(sourceLanguage) {
    //優先級陣列
    priorityArray = [];
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
    console.log("array", priorityArray);
    return priorityArray;
  }

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // =========================
  // 🟣 Utility Functions
  // =========================
  //       \    /\
  //        )  ( ')
  //       (  /  )
  //        \(__)|

  // Check the selected element, if it is an interactive element it will return null.
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

  // Remove punctuation and numbers from text
  function removePunctuationAndNumbers(text) {
    // Keep only letters (Latin, Chinese) and spaces
    return text.replace(/[^\p{L}\p{Script=Han}\s]/gu, "").trim();
  }

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // =========================
  // 🟣 handle speak
  // =========================
  //       \    /\
  //        )  ( ')
  //       (  /  )
  //        \(__)|

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
      if (!voices) {
        alert("Voice not yet loaded");
      }
      const voice = voices.find((v) => v.lang === lang);
      if (!voice) {
        alert("Your browser does not support this language.");
        return "Your browser does not support this language.";
      }

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

  //         |\      _,,,---,,_
  // ZZZzz /,`.-'`'    -.  ;-;;,_
  //      |,4-  ) )-,_. ,\ (  `'-'
  //     '---''(_/--'  `-'\_)
  // =========================
  // 🟣 Loading
  // =========================
  //       \    /\
  //        )  ( ')
  //       (  /  )
  //        \(__)|

  //handle loading text
  function showTranslationLoading(targetEl) {
    // 先檢查是否已經有 loading 存在
    let existing = targetEl.querySelector(".translation-loading");
    if (existing) return existing;

    const loadingDiv = document.createElement("div");
    loadingDiv.classList.add("translation-loading");
    loadingDiv.textContent = "In Translation...";
    loadingDiv.style.color = "rgb(48, 147, 252)";

    targetEl.appendChild(loadingDiv);
    return loadingDiv;
  }

  //remove loading text
  function removeTranslationLoading(targetEl) {
    const loadingDiv = targetEl.querySelector(".translation-loading");
    if (loadingDiv) loadingDiv.remove();
  }

})();
