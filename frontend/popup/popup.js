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
