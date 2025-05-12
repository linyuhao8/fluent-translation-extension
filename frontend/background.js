// ✅ ES module 格式
chrome.runtime.onInstalled.addListener((details) => {
  // 建立右鍵選單
  chrome.contextMenus.create({
    id: "translate",
    title: "Fluent Translate: Alt(option)+T or Right Click + T",
    contexts: ["selection"],
  });

  // 安裝後打開歡迎頁
  if (details.reason === "install") {
    chrome.tabs.create({
      url: "https://linyuhao8.github.io/fluent-translation-extension/",
    });
  }
});

// background.js
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate" && tab.id) {
    // 先檢查腳本是否已經注入
    chrome.tabs.sendMessage(tab.id, "ping", { frameId: 0 }, (response) => {
      if (chrome.runtime.lastError) {
        // 若未注入，則注入腳本
        chrome.scripting
          .executeScript({
            target: { tabId: tab.id },
            files: ["scripts/content.js"],
          })
          .then(() => {
            // 腳本注入後，發送翻譯訊息
            chrome.tabs.sendMessage(tab.id, { action: "TRANSLATE_SELECTION" });
          });
      } else {
        // 若已注入，直接發送翻譯訊息
        chrome.tabs.sendMessage(tab.id, { action: "TRANSLATE_SELECTION" });
      }
    });
  }
});
