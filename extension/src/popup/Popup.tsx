import { useState } from 'react'
import './Popup.css'

function App() {
  const [matches, setMatches] = useState<string[]>([])
  const [searchText, setSearchText] = useState<string>('')

  const handleClick = async (suggestion: string) => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true })
    const tabId = tab.id
    if (!tabId) throw new Error('Tab Id undefined at handle click!')
    chrome.tabs.sendMessage(tabId, { action: 'scrollToMatch', text: suggestion })
  }

  const handleInput = async (userInput: string) => {
    userInput = userInput.toLowerCase()

    console.log('userInput', userInput)
    // chrome.runtime.sendMessage(
    //   { action: 'getAutoMatches', prefix: userInput },
    //   (receivedMatches: string[]) => {
    //     setMatches(receivedMatches)
    //   },
    // )
  }

  return (
    <main>
      <input
        type="text"
        id="searchBox"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onInput={(e) => handleInput(e.currentTarget.value)}
      />
      <ul id="matchesContainer">
        {matches.map((suggestion, index) => (
          <li key={index} onClick={() => handleClick(suggestion)}>
            {suggestion}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
