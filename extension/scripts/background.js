/// <reference path="./chrome.d.ts" />

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "pageContent") {
//     const pageContent = message.content;
//     console.log("Received page content:", pageContent);
//     // Here, you can process the content, build the trie, and perform autocomplete logic.
//     // You might want to send this processed data to your extension's UI.
//   }
// });
