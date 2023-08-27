/// <reference path="./chrome.d.ts" />

// registered as a content script

console.log("scroll-to.js loaded");

function scrollToMatch(text) {
  const regex = new RegExp(text, "i"); // case-insensitive search
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    null,
    false
  );

  while (walker.nextNode()) {
    const originalNode = walker.currentNode;
    const matchResult = originalNode.textContent.match(regex);
    if (matchResult) {
      const match = matchResult[0]; // matched text
      const startIndex = matchResult.index;

      // beforeMatch and afterMatch
      const beforeMatch = originalNode.textContent.substring(0, startIndex);
      const afterMatch = originalNode.textContent.substring(
        startIndex + match.length
      );
      // create nodes from beforeMatch and afterMatch
      const beforeText = document.createTextNode(beforeMatch);
      const afterText = document.createTextNode(afterMatch);

      // create span element for highlighting
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      span.textContent = match;

      // replace the original text node with the highlighted span and surrounding text
      originalNode.parentNode.replaceChild(span, originalNode);
      span.parentNode.insertBefore(beforeText, span);
      span.parentNode.insertBefore(afterText, span.nextSibling);

      // Scroll to the span
      span.scrollIntoView({ behavior: "smooth", block: "center" });
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
