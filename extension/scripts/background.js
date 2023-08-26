/// <reference path="./chrome.d.ts" />

import Trie from "../modules/trie.js";

let pageTrie = new Trie();

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );

  if (message.action === "pageContent") {
    const pageContent = message.content;
    console.log("Received page content.");
    const words = pageContent.split(/\s+/);
    words.forEach((word) => {
      pageTrie.addWord(word.toLowerCase()); // for case-insensitive search
    });
    sendResponse("content processed");
  }

  if (message.action === "getAutoMatches") {
    const prefix = message.prefix.toLowerCase();
    const matches = pageTrie.autocomplete(prefix);
    sendResponse(matches);
  }

  // if (message.action === "getWordCount") {
  //   const count = pageTrie.getWordCount();
  //   sendResponse(count);
  // }

  if (message.action === "reload_content") {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["scripts/content.js"],
    });
  }
});
