console.log('Content script running at document idle'); // Document Idle is the default "run at" property in manifest.json

function getPageContent() {
  return document.body.innerText;
}

// Send the page content to the background script
(async () => {
  const response = await chrome.runtime.sendMessage({
    action: 'pageContent',
    content: getPageContent(),
  });
  console.log('response', response);
})();

let lastMatchedElement: Element | null = null;
let originalMatchedHtml: string | undefined = undefined;
async function scrollToMatch(sentence: string, prefix: string, tabId: number) {
  const selection = window.getSelection();
  if (!selection) throw new Error('Selection is null!'); // https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection#return_value
  if (lastMatchedElement) {
    selection.removeAllRanges();
    if (!originalMatchedHtml) throw new Error('originalMatchedHtml is undefined!');
    lastMatchedElement.innerHTML = originalMatchedHtml;
  }
  const _isStringsEqual = (strI: string, strII: string): Boolean => {
    console.log('strs', strI, strII);
    if (strI.length !== strII.length) return false;
    const sortedStrI = strI.split('').sort().join();
    const sortedStrII = strII.split('').sort().join();
    return sortedStrI === sortedStrII;
  };
  const sentenceRegex = new RegExp(escapeRegExp(sentence), 'i'); // todo: use _isEqualstrs ?
  const prefixRegex = new RegExp(prefix, 'i'); // case-insensitive search
  function escapeRegExp(text: string) {
    // Escape special characters and white spaces ( https://cheatography.com/davechild/cheat-sheets/regular-expressions/ )
    // https://stackoverflow.com/a/9310752
    return text.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&').replace(/\s/g, '\\s*');
  }

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
  console.log('sentence and prefix: ', escapeRegExp(sentence), prefix);
  let nodeI = 0;
  while (walker.nextNode()) {
    const originalNode = walker.currentNode;
    const textContent = originalNode.textContent as string; // only nodes with text are filtered from dom walker
    const sentenceMatchResult = textContent.match(sentenceRegex);
    // console.log(
    //   'textContent',
    //   originalNode,
    //   sentenceMatchResult,
    //   Boolean(sentenceMatchResult !== null),
    //   nodeI,
    // );
    // console.log('sentencemat', sentenceMatchResult)
    // console.log('textContent', escapeRegExp(textContent), textContent)
    if (sentenceMatchResult) {
      const prefixMatchResult = textContent.match(prefixRegex);
      if (!prefixMatchResult) throw new Error('prefix is null at scrollToMatch'); // todo: try typing 'sentence same' at test.html
      lastMatchedElement = originalNode.parentElement;
      originalMatchedHtml = lastMatchedElement?.innerHTML;
      console.log('prefixMatch', prefixMatchResult);
      const match = prefixMatchResult[0]; // matched text
      const startIndex = prefixMatchResult.index;
      if (startIndex === undefined) throw new Error('startIndex is undfined at scrollToMatch');

      // beforeMatch and afterMatch
      const beforeMatch = textContent.substring(0, startIndex);
      const afterMatch = textContent.substring(startIndex + match.length);
      // create nodes from beforeMatch and afterMatch
      const beforeText = document.createTextNode(beforeMatch);
      const afterText = document.createTextNode(afterMatch);

      // create span element for highlighting
      const selectedSpan = document.createElement('span');
      selectedSpan.textContent = match;

      // replace the original text node with the highlighted span and surrounding text
      // todo: check out this site with search prefix 'extending dev'
      if (!originalNode.parentElement) throw new Error('originalNode parentElemnt unefined!');
      originalNode.parentElement.replaceChild(selectedSpan, originalNode);

      if (!selectedSpan.parentElement) throw new Error('selectedSpan parentElemnt unefined!');
      selectedSpan.parentElement.insertBefore(beforeText, selectedSpan);
      selectedSpan.parentElement.insertBefore(afterText, selectedSpan.nextSibling);

      const range = document.createRange();
      range.selectNode(selectedSpan);
      selection.addRange(range);

      // Scroll to the span
      selectedSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('breaking at', nodeI);
      break;
      // todo: check test.html ( handle same sentence )
    }
    nodeI++;
  }
}

// todo: add this event listener only if it's not being set. otherwise at reload_content this will be set over and over.
// PS: this being fixed by adding a condition to service worker.
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  if (message.action === 'scrollToMatch') {
    console.log('scrolling to match!');
    await scrollToMatch(message.matchSentence, message.searchPrefix, message.tabId);
  }
});

export {};
