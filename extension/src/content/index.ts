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

function scrollToMatch(text: string) {
  const regex = new RegExp(text, 'i'); // case-insensitive search
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);

  while (walker.nextNode()) {
    const originalNode = walker.currentNode;
    const textContent = originalNode.textContent as string; // only nodes with text are filtered from dom walker
    const matchResult = textContent.match(regex);
    if (matchResult) {
      const match = matchResult[0]; // matched text
      const startIndex = matchResult.index;
      if (startIndex === undefined) throw new Error('startIndex is undfined at scrollToMatch');

      // beforeMatch and afterMatch
      const beforeMatch = textContent.substring(0, startIndex);
      const afterMatch = textContent.substring(startIndex + match.length);
      // create nodes from beforeMatch and afterMatch
      const beforeText = document.createTextNode(beforeMatch);
      const afterText = document.createTextNode(afterMatch);

      // create span element for highlighting
      const span = document.createElement('span');
      span.style.backgroundColor = 'yellow';
      span.textContent = match;

      // replace the original text node with the highlighted span and surrounding text
      //   if (originalNode.parentNode === null || span.parentNode === null)
      //     throw new Error('originalNode.parentNode or span.parentNode is null at scrollToMatch')
      (originalNode.parentNode as ParentNode).replaceChild(span, originalNode);
      (span.parentNode as ParentNode).insertBefore(beforeText, span);
      (span.parentNode as ParentNode).insertBefore(afterText, span.nextSibling);

      // Scroll to the span
      span.scrollIntoView({ behavior: 'smooth', block: 'center' });
      break;
    }
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
  if (message.action === 'scrollToMatch') {
    scrollToMatch(message.text);
  }
});

export {};
