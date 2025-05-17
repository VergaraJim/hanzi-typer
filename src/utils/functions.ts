import { definitions } from "./definitions";

export function formatDateManual(date: Date) {
  const monthNames = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");

  return month + " " + day;
}

export function stringToWordArray(string: string): string[] {
  const foundWords: { [key: number]: string } = {};

  let tempString = string;
  let wordList = Object.keys(definitions).sort(function (a, b) {
    return b.length - a.length;
  });

  // For every word in our dictionary
  wordList.forEach((word) => {
    // Create a replacement with equal length for this word
    let replacement = "";
    for (let x = 0; x < word.length; x++) {
      replacement += "¬";
    }
    // Find every appearances of the word in our material and replace it.
    const appearances = indexesOfWord(tempString, word);
    appearances.forEach((startIndex) => {
      tempString = tempString.replace(word, replacement);
      foundWords[startIndex] = word;
    });
  });

  const explodedCharacters = tempString.split("");

  explodedCharacters.forEach((character, index) => {
    if (character != "¬") {
      foundWords[index] = character;
    }
  });

  const orderedFoundWords: { [key: number]: string } = [];

  Object.keys(foundWords)
    .sort(function (a, b) {
      return parseInt(a) - parseInt(b);
    })
    .forEach((index) => {
      orderedFoundWords[parseInt(index)] = foundWords[parseInt(index)];
    });

  return Object.keys(orderedFoundWords).map(
    (key) => orderedFoundWords[parseInt(key)]
  );
}

function indexesOfWord(string: string, term: string) {
  const appearances: Array<number> = [];
  let appeared = true;
  let i = 0;
  while (appeared) {
    const r = string.indexOf(term, i);
    if (r !== -1) {
      appearances.push(r);
      i = r + 1;
    } else {
      appeared = false;
    }
  }
  return appearances;
}
