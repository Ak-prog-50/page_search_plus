/// <reference path="./chrome.d.ts" />

/**
 * Use to read and write DOM of current active tab.
 */
console.log("Content script running at document idle"); // Document Idle is the default "run at" property in manifest.json

function getPageContent() {
  return document.body.innerText;
}

// Send the page content to the background script
(async () => {
  const response = await chrome.runtime.sendMessage({
    action: "pageContent",
    content: getPageContent(),
  });
  console.log("response", response);
})();