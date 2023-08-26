class TrieNode {
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  addWord(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
    }
    node.isEndOfWord = true;
  }

  search(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return node.isEndOfWord;
  }

  startsWith(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) {
        return false;
      }
      node = node.children[char];
    }
    return true;
  }

  // Returns an array of all words with the given prefix
  autocomplete(prefix) {
    let node = this.root;
    for (const char of prefix) {
      if (!node.children[char]) {
        return [];
      }
      node = node.children[char];
    }
    return this._findAllWords(node, prefix);
  }

  _findAllWords(node, prefix) {
    const result = [];
    if (node.isEndOfWord) {
      result.push(prefix);
    }
    for (const char in node.children) {
      result.push(...this._findAllWords(node.children[char], prefix + char));
    }
    return result;
  }
}

export default Trie;

// if (require.main === module) {
//   // Note to Self:
//   const trie = new Trie();
//   trie.addWord("apple");
//   trie.addWord("app");
//   trie.addWord("application");
//   console.log(trie.search("apple")); // true
//   console.log(trie.search("appl")); // false
//   console.log(trie.startsWith("appl")); // true
//   console.log(trie.autocomplete("app")); // ["app", "apple", "application"]
// }
