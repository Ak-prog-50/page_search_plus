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

// const searchBoxContainer = document.createElement("div");
// searchBoxContainer.style.position = "fixed";
// searchBoxContainer.style.top = "50%";
// searchBoxContainer.style.left = "50%";
// searchBoxContainer.style.transform = "translate(-50%, -50%)";

// const searchBox = document.createElement("input");
// searchBox.type = "text";
// searchBox.placeholder = "Search";
// searchBoxContainer.appendChild(searchBox);

// document.body.appendChild(searchBoxContainer);
