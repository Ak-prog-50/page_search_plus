import { useEffect, useState } from 'react';
import './Popup.css';
import { IAutoMatchesResponse } from '../background';

function App() {
  const [matches, setMatches] = useState<string[]>([]);
  const [searchText, setSearchText] = useState<string>('');

  const _getTabId = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tabId = tab.id;
    if (!tabId) throw new Error('Tab Id undefined at popup!');
    return tabId;
  };

  const _getTabUrl = async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const tabUrl = tab.url;
    if (!tabUrl) throw new Error('Tab url undefined at popup!');
    return tabUrl;
  };

  const handleClickList = async (match: string) => {
    const tabId = await _getTabId();
    await chrome.tabs.sendMessage(tabId, {
      tabId: tabId,
      action: 'scrollToMatch',
      matchSentence: match,
      searchPrefix: searchText,
    });
    console.log('scrollToMatch message sent');
  };

  const handleInput = async (userInput: string) => {
    userInput = userInput.toLowerCase();
    const tabUrl = await _getTabUrl();
    chrome.runtime.sendMessage(
      { tabUrl: tabUrl, action: 'getAutoMatches', prefix: userInput },
      (response: IAutoMatchesResponse) => {
        setMatches(response.matches);
      },
    );
  };

  const handleClickSearch = async () => {
    const tabUrl = await _getTabUrl();
    chrome.runtime.sendMessage({ tabUrl: tabUrl, action: 'reload_content' });
  };

  return (
    <main>
      <input
        type="text"
        id="searchBox"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onInput={(e) => handleInput(e.currentTarget.value)}
        onClick={() => handleClickSearch()}
      />
      <ul id="matchesContainer">
        {matches.map((match, index) => (
          <li key={index} onClick={() => handleClickList(match)}>
            {/*//todo: highlight search text */}
            {match}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
