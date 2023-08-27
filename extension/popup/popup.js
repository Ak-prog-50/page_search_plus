/// <reference path="../scripts/chrome.d.ts" />

// Do what needed to be done at onclick of extension.
// Can use this or onClick event inside service worker.

const searchBox = document.getElementById("searchBox");
const autocompleteList = document.getElementById("matchesContainer");

searchBox.addEventListener("input", () => {
  const userInput = searchBox.value.toLowerCase();

  chrome.runtime.sendMessage(
    { action: "getAutoMatches", prefix: userInput },
    (matches) => {
      autocompleteList.innerHTML = ""; // Clear previous suggestions

      matches.forEach((suggestion) => {
        const li = document.createElement("li");
        li.textContent = suggestion;
        li.addEventListener("click", async () => {
          searchBox.value = suggestion;
          // autocompleteList.innerHTML = "";
          const [tab] = await chrome.tabs.query({active: true, lastFocusedWindow: true});
          chrome.tabs.sendMessage(tab.id, { action: "scrollToMatch", text: suggestion})
        });
        autocompleteList.appendChild(li);
      });
    }
  );
});

searchBox.addEventListener("click", async () => {
  chrome.runtime.sendMessage({ action: "reload_content" })
});
