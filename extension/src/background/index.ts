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
  [tabUrl: string]: TrieSearch<TPagetrie> | undefined;
} = {};

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  const tabUrl: number | undefined = sender.tab ? sender.tab.url : message.tabUrl;
  if (!tabUrl) throw new Error('Tab URL undefined at service worker!');
  const trie = pageTries[tabUrl];
  // console.log('trie', trie, tabUrl)

  if (message.action === 'pageContent') {
    if (!trie) {
      pageTries[tabUrl] = new TrieSearch<TPagetrie>('text');
      pageTries[tabUrl]?.reset();
      const pageContent = message.content;
      console.log('Received page content.');
      // todo: maybe this is not the best way to sepeate sentences
      const segmenter = new Intl.Segmenter('en', { granularity: 'sentence' });
      const sentences = Array.from(segmenter.segment(pageContent));
      // console.log('sentences', sentences)
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i].segment;
        pageTries[tabUrl]?.add({ text: sentence });
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
    // reload only if no pageTrie ( if service worker has been inactive)
    if (!trie) {
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
  }

  if (message.action === 'reload_page') {
    await chrome.tabs.reload(message.tabId);
  }
});

export {};
