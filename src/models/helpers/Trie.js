// let codeNameChars = [" ", "-", "z", "y", "x", "w", "v", "u", "t", "s", "r", "q", "p", "o", "n", "m", "l", "k", "j", "i", "h", "g", "f", "e", "d", "c", "b", "a", "9", "8", "7", "6", "5", "4", "3", "2", "1", "0"];
// codeNameChars = codeNameChars.sort((a, b) => a.localeCompare(b));
// let codeNameCharsMap = new Map();
// codeNameChars.forEach((c, i) => codeNameCharsMap.set(i, c));

class TrieNode {
  constructor(char) {
    this.char = char;
    this.parent = null; //reference to previous node
    this.children = {}; //reference to further nodes (word chars);
    this.end = []; // if the end of the world, store word ids, as there might be more than one same word with different ids (will get words by ids from db);
  }

  readWordUpFromTheEnd() {
    let charsArr = [];
    let current = this;

    while (current !== null) {
      charsArr.unshift(current.char);
      current = current.parent;
    }
    return charsArr.join("");
  }
}

class Trie {
  constructor(allowedChars) {
    this.root = new TrieNode(null);
    this.sortedCharacters = allowedChars.sort((a, b) => a.localeCompare(b));
  }

  insert(word, id) {
    let current = this.root;
    // for every character in the word
    for (let i = 0; i < word.length; i++) {
      // check to see if character exists in  current node children.
      if (!current.children[word[i]]) {
        // if it doesn't exist, create it.
        current.children[word[i]] = new TrieNode(word[i]);
        //make current node the parent of new created node
        current.children[word[i]].parent = current;
      }

      // change current node to be new crated or existing char node
      current = current.children[word[i]];

      // check if it's the last char.
      if (i == word.length - 1) {
        //add id to the end array
        current.end = [...current.end, id];
      }
    }
  }

  containsFullWord(word) {
    let current = this.root;
    // for every character in the word
    for (let i = 0; i < word.length; i++) {
      // check to see if character  exists in current node children.
      if (current.children[word[i]]) {
        // if it exists, go deeper by changing current to found existing
        current = current.children[word[i]];
      } else {
        // doesn't exist, return false since it's not a valid word.
        return false;
      }
    }

    return current.end.length > 0 ? true : false;
  }

  // returns every word with given prefix
  findWithPrefix(prefix) {
    let current = this.root;
    let output = [];

    // for every character in the prefix
    for (let i = 0; i < prefix.length; i++) {
      // make sure prefix actually in words
      if (current.children[prefix[i]]) {
        current = current.children[prefix[i]];
      } else {
        // there's none. just return it.
        return output;
      }
    }

    // recursively find all words in the current
    this.findAllWordsSorted(current, output);

    return output;
  }

  // recursive function to find all words in the given current.
  findAllWordsSorted(current = this.root, arr = []) {
    // base case, if current is at the end of word, push to output all ids
    if (current.end.length > 0) {
      arr.push(...current.end);
    }

    // iterate through each children, call recursive findAllWords
    for (let ind in this.sortedCharacters) {
      let char = this.sortedCharacters[ind];
      if (current?.children[char]) {
        this.findAllWordsSorted(current.children[char], arr);
      }
    }
    return arr;
  }

  removeById(id) {
    let current = this.root;
    if (id === null) return;
    const removeWord = (current, id) => {
      // check if current contains the word with id
      if (current.end.length > 0 && current.end.includes(id)) {
        // check  if current parent has children
        let hasChildren = Object.keys(current.parent.children).length > 0;
        // if has children we only want to remove ids from the end of current, that marks the end of a word.
        // this way we do not remove words that contain/include supplied word
        if (hasChildren) {
          current.end = current.end.filter((wordId) => wordId !== id);
        } else {
          // remove word by getting parent and setting children to empty object
          current.parent.children = {};
        }

        return true;
      }

      // recursively remove word from all children
      for (let char in current.children) {
        removeWord(current.children[char], id);
      }

      return false;
    };
    removeWord(current, id);
  }

  removeByWord(word) {
    let root = this.root;
    if (!word) return;
    // recursively finds and removes a word
    //will remove all same words, even if they contain several ids;
    const removeWord = (current, word) => {
      // check if current current contains the word
      if (current?.end.length > 0 && current.readWordUpFromTheEnd() === word) {
        // check and see if current has children
        let hasChildren = Object.keys(current.parent.children).length > 0;
        // if has children we only want to clear ids from the end of current, that marks the end of a word.
        // this way we do not remove words that contain/include supplied word
        if (hasChildren) {
          current.end = [];
        } else {
          // remove word by getting parent and setting children to an empty object
          current.parent.children = {};
        }

        return true;
      }

      // recursively remove word from all children
      if (current?.children) {
        for (let charNode in current.children) {
          removeWord(current.children[charNode], word);
        }
      }

      return false;
    };

    // call remove word on root (current node)
    removeWord(root, word);
  }
}
export default Trie;
