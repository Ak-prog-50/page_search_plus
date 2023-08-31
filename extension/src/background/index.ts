// @ts-ignore
import TrieSearch from 'trie-search';

export interface IAutoMatchesResponse {
  matches: string[];
  count: number;
}

type TPagetrie = {
  text: string;
};

const pageTries: {
  [tabId: number]: TrieSearch<TPagetrie> | undefined;
} = {};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  const tabId: number | undefined = sender.tab ? sender.tab.id : message.tabId;
  if (!tabId) throw new Error('Tab Id undefined at service worker!');
  const trie = pageTries[tabId];

  if (message.action === 'pageContent') {
    if (!trie) {
      pageTries[tabId] = new TrieSearch<TPagetrie>('text');
      pageTries[tabId]?.reset();
      const pageContent = message.content;
      console.log('Received page content.');
      // todo: maybe this is not the best way to sepeate sentences
      const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
      const sentences = Array.from(segmenter.segment(pageContent));
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].segment;
        pageTries[tabId]?.add({ text: sentence });
      }
    }
    sendResponse('content processed');
  }

  if (message.action === 'getAutoMatches') {
    // TODO: return all matches as object containing the match and a count. (  maxcount is 0 if only one, maxcount is 1 if there are two )
    const prefix = message.prefix.toLowerCase();
    if (!trie) throw new Error('Trie undefined at getAutoMatches!');
    const matches = trie.search(prefix);
    const response: IAutoMatchesResponse = {
      matches: matches.map((match) => match.text),
      count: matches.length,
    };
    console.log('response', response);
    sendResponse(response);
  }

  if (message.action === 'reload_content') {
    const [tab] = await chrome.tabs.query({
      active: true,
      lastFocusedWindow: true,
    });
    if (tab.id === undefined) throw new Error('Tab Id undefined at reload_content!');
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['src/content/index.ts.js'], // build folder output filename
    });
  }
});

export {};
