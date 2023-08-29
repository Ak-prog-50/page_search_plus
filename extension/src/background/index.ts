// @ts-ignore
import TrieSearch from 'trie-search'

export interface IAutoMatchesResponse {
  matches: string[]
  count: number
}

type TPagetrie = {
  text: string
}

const pageTrie: TrieSearch<TPagetrie> = new TrieSearch<TPagetrie>('text')

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension')

  if (message.action === 'pageContent') {
    const pageContent = message.content
    console.log('Received page content.')
    const words = pageContent.split(/\s+/)
    for (let i = 0; i < words.length; i++) {
      const word = words[i]
      pageTrie.add({ text: word })
    }
    sendResponse('content processed')
  }

  if (message.action === 'getAutoMatches') {
    // TODO: return all matches as object containing the match and a count. (  maxcount is 0 if only one, maxcount is 1 if there are two )
    const prefix = message.prefix.toLowerCase()
    const matches = pageTrie.search(prefix)
    const response: IAutoMatchesResponse = {
      matches: matches.map((match) => match.text),
      count: matches.length,
    }
    console.log('response', response)
    sendResponse(response)
  }

  if (message.action === 'reload_content') {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    })
    if (tab.id === undefined) throw new Error('Tab Id undefined at reload_content!')
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['src/content/index.ts.js'], // build folder output filename
    })
  }
})

export {}
