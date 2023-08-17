/// <reference path="./chrome.d.ts" />

console.log("Content script loadded");

// Function to retrieve the content of the current page
function getPageContent() {
  return document.body.innerText;
}
const content = getPageContent()
console.log(content)

// // Send the page content to the background script
// chrome.runtime.sendMessage({
//   action: "pageContent",
//   content: getPageContent(),
// });
