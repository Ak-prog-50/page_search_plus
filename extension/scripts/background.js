/// <reference path="./chrome.d.ts" />

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );

  const badgeState = await chrome.action.getBadgeText({ tabId: sender.tab.id });

  if (badgeState === "ON") {
    if (message.action === "pageContent") {
      const pageContent = message.content;
      console.log("Received page content:", pageContent);
      // TODO: process the content, build the trie, and perform autocomplete logic.
      // TODO: send this processed data to your extension's UI.
      sendResponse("content processed")
    }
  }
  else if (badgeState === "OFF") {
    sendResponse("extension is OFF")
  }

});
