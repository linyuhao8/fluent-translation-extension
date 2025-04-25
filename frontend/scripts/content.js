(function () {
  // 檢查是否已經注入過
  if (window.fluentQuickAlreadyInjected) return;
  window.fluentQuickAlreadyInjected = true;

  const FluentQuick_LANGUAGES = {
    zh: {
      code: "zh-TW",
      name: "中文",
      //detect 是一個函數，用來判斷輸入的 text 有多少比例是中文。
      //然後計算：中文字數 / 整段文字長度，回傳的是 比例（例如 0.8 表示 80% 是中文）
      detect: (text) => {
        const chineseChars = text.match(/[\u4e00-\u9fff]/g) || [];
        return chineseChars.length / text.length;
      },
      //threshold（門檻值）：表示只要超過 50% 是中文，就當作這段是中文
      threshold: 0.5,
      priority: 1,
    },
    en: {
      code: "en",
      name: "英文",
      detect: (text) => {
        const englishChars = text.match(/[a-zA-Z]/g) || [];
        return englishChars.length / text.length;
      },
      threshold: 0.5,
      priority: 2,
    },
    ja: {
      code: "ja",
      name: "日文",
      detect: (text) => {
        const japaneseChars = text.match(/[\u3040-\u30ff\u3400-\u4dbf]/g) || [];
        return japaneseChars.length / text.length;
      },
      threshold: 0.5,
      priority: 3,
    },
    // 可以在此處輕鬆添加其他語言
    // "ko": {
    //   code: "ko",
    //   name: "韓文",
    //   detect: (text) => {
    //     const koreanChars = text.match(/[\uAC00-\uD7AF]/g) || [];
    //     return koreanChars.length / text.length;
    //   },
    //   threshold: 0.5
    // },
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
      console.log("⚠️ 文字只包含標點符號或數字");
      return;
    }

    // 偵測原始語言是甚麼
    const detectionResult = detectLanguage(cleanText);

    // 計算優先級
    const priority = getPriority(detectionResult.languageCode);
    currentSourceLanguage = priority[0].code;
    currentTargetLanguage = priority[1].code;
  });

  // handle keyboard
  document.addEventListener("keydown", async (e) => {
    // click t to translate
    if (e.key === "t" && e.altKey && currentSelectedText) {
      handleTranslateAndInsert();
    }
  });

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
      const selectedElement = range.startContainer.parentNode;

      console.log(selectedElement);
      // 顯示翻譯中狀態
      showTranslationLoading(selectedElement);

      // 取得翻譯文本
      const translatedText = await translateText(
        currentSelectedText,
        currentTargetLanguage
      );
      console.log("🔁 翻譯結果：", translatedText);

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
    // 這個正則表達式會移除標點符號和數字，但保留中文、英文字母和空格
    return text
      .replace(/[^\w\u4e00-\u9fff\s]/g, "")
      .replace(/\d+/g, "")
      .trim();
  }

  // 語言偵測函數 - 回傳最可能的語言和分數
  function detectLanguage(text) {
    let highestScore = 0;
    let detectedLanguage = {
      languageCode: "",
      languageName: "未知語言",
    };
    // 計算各語言的分數
    // 將LNGUAGES解構，方便使用func
    for (const [langCode, langData] of Object.entries(FluentQuick_LANGUAGES)) {
      //使用func來計算每個語言的分數
      const score = langData.detect(text);
      //計算最高分
      if (score > highestScore) {
        highestScore = score;
        detectedLanguage = {
          languageCode: langData.code,
          languageName: langData.name,
        };
      }
    }

    //回傳目前語言分數最多的語言資料
    return detectedLanguage;
  }

  // 根據目標語言做排序
  function getPriority(sourceLanguage) {
    priorityArray = [];
    for (const [langCode, langData] of Object.entries(FluentQuick_LANGUAGES)) {
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

  // 取得第二高分的語言，可檢查中英混合(未來)

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

    // 建立暫停按鈕
    const pauseBtn = document.createElement("button");
    pauseBtn.classList.add("translation-audioPause-btn");
    pauseBtn.type = "button";
    pauseBtn.textContent = "⏸";
    pauseBtn.disabled = true; // 預設禁用

    // 狀態顯示
    const statusText = document.createElement("span");
    statusText.textContent = "status：未開始";
    statusText.classList.add("status-text");

    // 創建朗讀按鈕
    const readSourceBtn = document.createElement("button");
    readSourceBtn.classList.add("translation-readSource-btn");
    readSourceBtn.type = "button";

    // 創建朗讀按鈕
    const readBtn = document.createElement("button");
    readBtn.classList.add("translation-read-btn");
    readBtn.type = "button";
    console.log(1, translatedText, translatedCode);
    readBtn.addEventListener("click", () => {
      speechManager.play(
        translatedText,
        translatedCode,
        playBtn,
        pauseBtn,
        statusText,
        readBtn,
        readSourceBtn
      );
    });

    // 播放按鈕邏輯
    playBtn.addEventListener("click", () => {
      speechManager.resume(
        playBtn,
        pauseBtn,
        statusText,
        readBtn,
        readSourceBtn
      );
    });

    // 暫停按鈕邏輯
    pauseBtn.addEventListener("click", () => {
      speechManager.pause(
        playBtn,
        pauseBtn,
        statusText,
        readBtn,
        readSourceBtn
      );
    });

    //撥放原始
    console.log(1, currentSelectedText, currentSourceLanguage);
    readSourceBtn.addEventListener("click", () => {
      speechManager.play(
        currentSelectedText,
        currentSourceLanguage,
        playBtn,
        pauseBtn,
        statusText,
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
    controls.appendChild(statusText);
    controls.appendChild(readBtn);
    controls.appendChild(readSourceBtn);
    controls.appendChild(toggleSourceBtn);
    controls.appendChild(closeBtn);

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
      statusText.textContent = "播放中";
      playBtn.disabled = true;
      pauseBtn.disabled = false;
      readBtn.disabled = true;
      readSourceBtn.disabled = true;

      speechSynthesis.speak(utterance);

      // 結束後恢復按鈕狀態
      utterance.onend = () => {
        isPlaying = false;
        statusText.textContent = "狀態：播放結束";
        playBtn.disabled = false; // 允許播放
        pauseBtn.disabled = true; // 禁用暫停
        readBtn.disabled = false; // 允許繼續操作
        readSourceBtn.disabled = false;
        console.log("Speech end");
      };
    },

    pause(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      if (isPlaying) {
        isPlaying = false;
        speechSynthesis.pause();
        console.log("Speech paused");
        statusText.textContent = "狀態：已暫停";
        playBtn.disabled = false;
        pauseBtn.disabled = true;
        readBtn.disabled = true;
        readSourceBtn.disabled = true;
      }
      console.log("Speech pause");
    },

    resume(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      if (!isPlaying && utterance) {
        // 檢查語音是否存在
        isPlaying = true;
        speechSynthesis.resume();
        console.log("Speech resumed");
        statusText.textContent = "狀態：繼續播放";
        playBtn.disabled = true; // 禁用播放按鈕
        pauseBtn.disabled = false; // 允許暫停
        readBtn.disabled = true;
        readSourceBtn.disabled = true;
      }
      console.log("Speech resume");
    },

    stop(playBtn, pauseBtn, statusText, readBtn, readSourceBtn) {
      isPlaying = false;
      speechSynthesis.cancel();
      statusText.textContent = "狀態：已停止";
      playBtn.disabled = false; // 允許重新播放
      pauseBtn.disabled = true; // 禁用暫停按鈕
      console.log("Speech stopped");
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
    const response = await fetch("http://localhost:3000/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, sourceLang: from, targetLang: to }),
    });

    const data = await response.json();

    if (data.translatedText) {
      return data.translatedText;
    } else {
      throw new Error("Translation failed");
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
    if (message === "ping") {
      sendResponse(true);
      return true; // 表示將異步回應
    }
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
