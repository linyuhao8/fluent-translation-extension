// ✅ ES module 格式
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate",
    title: "簡單翻譯: Alt+T or Option + T",
    contexts: ["selection"],
  });
});

// background.js
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate" && tab.id) {
    // 先檢查腳本是否已經注入
    chrome.tabs.sendMessage(tab.id, 'ping', {frameId: 0}, (response) => {
      if (chrome.runtime.lastError) {
        // 若未注入，則注入腳本
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ["scripts/content.js"],
        }).then(() => {
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