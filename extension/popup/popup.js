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
        li.addEventListener("click", () => {
          searchBox.value = suggestion;
          autocompleteList.innerHTML = "";
          // Go to the matched content in web page.
          // (use another function to implement this part)
        });
        autocompleteList.appendChild(li);
      });
    }
  );
});

searchBox.addEventListener("click", async () => {
  chrome.runtime.sendMessage({ action: "reload_content" })
});
