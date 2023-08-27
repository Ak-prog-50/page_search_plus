/// <reference path="./chrome.d.ts" />

// registered as a content script

console.log("scroll-to.js loaded");

function scrollToMatch(text) {
  const regex = new RegExp(text, "i"); // Case-insensitive search
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node.textContent.match(regex)) {
      node.parentElement.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      break;
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (message.action === "scrollToMatch") {
    scrollToMatch(message.text);
  }
});
