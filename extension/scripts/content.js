/// <reference path="./chrome.d.ts" />

console.log("Content script loaded");

function getPageContent() {
  return document.body.innerText;
}

// Send the page content to the background script
(async () => {
  const response = await chrome.runtime.sendMessage({
    action: "pageContent",
    content: getPageContent(),
  });
  console.log(response);
})();