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

let highlightedSpans: HTMLSpanElement[] = [];
async function scrollToMatch(sentence: string, prefix: string, tabId: number) {
  const _isStringsEqual = (strI: string, strII: string): Boolean => {
    console.log('strs', strI, strII);
    if (strI.length !== strII.length) return false;
    const sortedStrI = strI.split('').sort().join();
    const sortedStrII = strII.split('').sort().join();
    return sortedStrI === sortedStrII;
  };
  // highlightedSpans.forEach((span) => {
  //   const spanParent = span.parentNode;
  //   if (span && spanParent) {
  //     const isMatchedSentence = Boolean(spanParent?.textContent?.match(sentenceRegex));
  //     // const originalSentence = document.createTextNode(sentence);
  //     console.log('isMatchedSentece', isMatchedSentence);
  //     const textToReplace = isMatchedSentence
  //       ? document.createTextNode(sentence)
  //       : document.createTextNode(span.textContent || '');
  //     console.log('spanparent', spanParent);
  //     if (!span.textContent) throw new Error('span.textContent is undefined at highlighed spans');
  //     const beforeTextSpan = document.createTextNode(
  //       (spanParent.textContent || '').split(span.textContent)[0],
  //     );
  //     const afterTextSpan = document.createTextNode(
  //       (spanParent.textContent || '').split(span.textContent)[1],
  //     );
  //     console.log('before text: ', beforeTextSpan);
  //     console.log('text to relace: ', textToReplace);
  //     console.log('after text: ', afterTextSpan);

  //     if (!spanParent.parentNode) throw new Error('no spanParent.parentNode at highlighted spans');
  //     // todo: this doesn't work. this doesn't take into account nodes other than text nodes in 
  //     // todo: spanParent. ( ex: a tags ) refer to dom api and find a better way.
  //     // spanParent.parentNode.replaceChild(textToReplace, spanParent);
  //     // spanParent.insertBefore(beforeTextSpan, textToReplace);
  //     // spanParent.insertBefore(afterTextSpan, textToReplace.nextSibling);
  //   }
  // });
  // highlightedSpans = [];
  if (highlightedSpans.length) await chrome.runtime.sendMessage({
    action: "reload_page",
    tabId: tabId
  });
  const sentenceRegex = new RegExp(escapeRegExp(sentence), 'i'); // todo: use _isEqualstrs ?
  const prefixRegex = new RegExp(prefix, 'i'); // case-insensitive search
  function escapeRegExp(text: string) {
    // Escape special characters and white spaces ( https://cheatography.com/davechild/cheat-sheets/regular-expressions/ )
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
      if (!prefixMatchResult) throw new Error('prefix is null at scrollToMatch');
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
      // todo: attach and remove css styles file
      // todo: remove this span element using an ID
      const highlightedSpan = document.createElement('span');
      highlightedSpan.style.backgroundColor = 'yellow';
      highlightedSpan.textContent = match;
      highlightedSpans.push(highlightedSpan);

      // replace the original text node with the highlighted span and surrounding text
      //   if (originalNode.parentNode === null || span.parentNode === null)
      //     throw new Error('originalNode.parentNode or span.parentNode is null at scrollToMatch')
      (originalNode.parentNode as ParentNode).replaceChild(highlightedSpan, originalNode);
      (highlightedSpan.parentNode as ParentNode).insertBefore(beforeText, highlightedSpan);
      (highlightedSpan.parentNode as ParentNode).insertBefore(
        afterText,
        highlightedSpan.nextSibling,
      );

      // Scroll to the span
      highlightedSpan.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('breaking at', nodeI);
      break;
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
