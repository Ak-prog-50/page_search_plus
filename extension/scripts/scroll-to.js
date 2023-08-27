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
      console.log('node', node)
      // Create a new span element to wrap the matched text
      const span = document.createElement("span");
      span.style.backgroundColor = "yellow";
      const match = node.textContent.match(regex)[0]; // Get the matched text
      // console.log('first', match)

      const beforeMatch = node.textContent.substring(
        0,
        node.textContent.indexOf(match)
      );
      const afterMatch = node.textContent.substring(
        node.textContent.indexOf(match) + match.length
      );
      const beforeText = document.createTextNode(beforeMatch);
      const matchText = document.createTextNode(match);
      const afterText = document.createTextNode(afterMatch);

      span.appendChild(matchText);

      // Replace the node content with the highlighted span
      node.textContent = "";
      node.appendChild(beforeText);
      node.appendChild(span);
      node.appendChild(afterText);

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
