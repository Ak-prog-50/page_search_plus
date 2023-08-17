const tab = await chrome.tabs.query({ active: true, currentWindow: true });

const prevState = await chrome.action.getBadgeText({ tabId: tab.id });
const nextState = prevState === "ON" ? "OFF" : "ON";

// set the action badge to the next state
await chrome.action.setBadgeText({
  tabId: tab.id,
  text: nextState,
});
