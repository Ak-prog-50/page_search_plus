import { useEffect, useState } from 'react';
import './Popup.css';
import { IAutoMatchesResponse } from '../background';

function App() {
  const [matches, setMatches] = useState<string[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<string[] | null>(null);
  const [searchPrefix, setSearchPrefix] = useState<string>('');

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

  function _escapeRegExp(text: string) {
    // Escape special characters and white spaces ( https://cheatography.com/davechild/cheat-sheets/regular-expressions/ )
    // https://stackoverflow.com/a/9310752
    return text.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&').replace(/\s/g, '\\s*');
  }

  const _highlightPrefix = (sentence: string, prefix: string) => {
    const regex = new RegExp(`(${_escapeRegExp(prefix)})`, 'gi');

    // Split the sentence into parts matching prefix
    const parts = sentence.split(regex);

    return (
      <span>
        {parts.map((part, index) => (
          <span
            key={index}
            style={{
              fontWeight: part.toLowerCase() === prefix.toLowerCase() ? 'bold' : 'normal',
              backgroundColor: part.toLowerCase() === prefix.toLowerCase() ? 'gray' : 'transparent',
            }}
          >
            {part}
          </span>
        ))}
      </span>
    );
  };

  const handleClickList = async (match: string) => {
    const tabId = await _getTabId();
    await chrome.tabs.sendMessage(tabId, {
      tabId: tabId,
      action: 'scrollToMatch',
      matchSentence: match,
      searchPrefix: searchPrefix,
    });
    console.log('scrollToMatch message sent');
  };

  const handleInput = async (userInput: string) => {
    setFilteredMatches(null);
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

  function findWholeWordMatches(strings: string[], wordToMatch: string): void {
    const regex = new RegExp(`\\b${wordToMatch}\\b`, 'i'); // word boundary regex
    const matchingStrings = strings.filter((str) => regex.test(str));

    setFilteredMatches(matchingStrings);
  }

  useEffect(() => {
    // filteredMatches array is null by default and set to an array at onClick of btn.
    // array is set back to null when user starts typing on search box.
    // inside this useEffect button's background is set depending on filteredMatches state.
    const matchWholeWordBtn: HTMLButtonElement | null =
      document.querySelector('#matchWholeWordButton');
    if (!matchWholeWordBtn) throw new Error('No matchWholeWordBtn Element');
    matchWholeWordBtn.style.background = filteredMatches ? 'gray' : 'transparent';
  }, [filteredMatches]);

  return (
    <main>
      <input
        type="text"
        id="searchBox"
        placeholder="Search..."
        value={searchPrefix}
        onChange={(e) => setSearchPrefix(e.target.value)}
        onInput={(e) => handleInput(e.currentTarget.value)}
        onClick={() => handleClickSearch()}
      />
      <button
        id="matchWholeWordButton"
        onClick={() => {
          // setting filtered matches to null will render it's background transparent
          filteredMatches ? setFilteredMatches(null) : findWholeWordMatches(matches, searchPrefix);
        }}
        title="Match Whole Word"
      >
        ab
      </button>
      <ul id="matchesContainer">
        {(filteredMatches !== null ? filteredMatches : matches).map((match, index) => (
          <li key={index} onClick={() => handleClickList(match)}>
            {_highlightPrefix(match, searchPrefix)}
          </li>
        ))}
      </ul>
    </main>
  );
}

export default App;
