document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("translation-text-size-input-btn")
    .addEventListener("click", () => {
      const fontSize = document.getElementById(
        "translation-text-size-input"
      ).value;

      const message = {
        action: "changeTranslateionFontSize",
        size: fontSize + "px",
      };

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    });

  document
    .getElementById("translate-source-size-input-btn")
    .addEventListener("click", () => {
      const fontSize = document.getElementById(
        "translate-source-size-input"
      ).value;

      const message = {
        action: "changeSourceFontSize",
        size: fontSize + "px",
      };

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });
    });
  (async function () {
    const primaryLanguageSelect = document.getElementById("primary-language");
    const secondaryLanguageSelect =
      document.getElementById("secondary-language");

    const DEFAULT_PRIMARY = "en";
    const DEFAULT_SECONDARY = "zh-TW";

    // 先讀一次 languagesData
    const { languagesData } = await chrome.storage.local.get("languagesData");
    if (!languagesData) return;

    // 找出 priority 1 和 2 的語言
    const priorities = Object.values(languagesData).sort(
      (a, b) => a.priority - b.priority
    );

    // 找 priority 1 和 2，如果都沒有就用預設值
    const primary =
      priorities.find((l) => l.priority === 1)?.code || DEFAULT_PRIMARY;
    const secondary =
      priorities.find((l) => l.priority === 2)?.code || DEFAULT_SECONDARY;

    primaryLanguageSelect.value = primary;
    secondaryLanguageSelect.value = secondary;

    // 若都沒有設定過，初次存入預設 priority
    if (
      !Object.values(languagesData).some(
        (l) => l.priority === 1 || l.priority === 2
      )
    ) {
      for (const langData of Object.values(languagesData)) {
        if (langData.code === DEFAULT_PRIMARY) langData.priority = 1;
        else if (langData.code === DEFAULT_SECONDARY) langData.priority = 2;
      }
      await chrome.storage.local.set({ languagesData });
    }

    // 公用的設定函式
    async function updatePriority(code, priority) {
      const { languagesData } = await chrome.storage.local.get("languagesData");
      if (!languagesData) return;

      // 清空原本設定的 priority
      for (const langData of Object.values(languagesData)) {
        if (langData.priority === priority) {
          langData.priority = 999; // 隨便給一個大數字，代表非主要語言
        }
      }

      // 設定新的 priority
      for (const langData of Object.values(languagesData)) {
        if (langData.code === code) {
          langData.priority = priority;
        }
      }

      await chrome.storage.local.set({ languagesData });
      console.log(`Priority ${priority} updated: ${code}`);
    }

    // 綁定 primary 下拉事件
    primaryLanguageSelect.addEventListener("change", (e) => {
      // 1. 把所有 priority=1 的語言 priority 清除
      for (const langData of Object.values(languagesData)) {
        if (langData.priority === 1) {
          langData.priority = 999; // 或你想設其他大數字
        }
      }
      updatePriority(e.target.value, 1);
    });

    // 綁定 secondary 下拉事件
    secondaryLanguageSelect.addEventListener("change", (e) => {
      // 1. 把所有 priority=1 的語言 priority 清除
      for (const langData of Object.values(languagesData)) {
        if (langData.priority === 2) {
          langData.priority = 999; // 或你想設其他大數字
        }
      }
      updatePriority(e.target.value, 2);
    });
  })();

  const toggleInput = document.querySelector("#buttonsPositionToggle");

  if (toggleInput) {
    toggleInput.addEventListener("change", function () {
      const positionLabel = document.getElementById("positionLabel");
      const buttonsOnTop = toggleInput.checked;

      console.log(buttonsOnTop);

      // 發送訊息給 content.js
      const message = {
        action: "updateButtonsPosition",
        position: buttonsOnTop ? "top" : "bottom",
      };

      // 發送訊息到當前活動的標籤頁
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, message);
      });

      // 更新文字
      positionLabel.textContent = buttonsOnTop
        ? "bottons on bottom"
        : "buttons on top";
    });
  }
});
