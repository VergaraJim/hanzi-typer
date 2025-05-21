import pinyins from "../assets/pinyin_mini.json";
import pinyins_hsk from "../assets/pinyin_hsk.json";

const pinyinList: { [key: string]: Array<string> } = pinyins;

function removePinyinTones(pinyin: string) {
  const toneMap: { [key: string]: string } = {
    ā: "a",
    á: "a",
    ǎ: "a",
    à: "a",
    ē: "e",
    é: "e",
    ě: "e",
    è: "e",
    ī: "i",
    í: "i",
    ǐ: "i",
    ì: "i",
    ō: "o",
    ó: "o",
    ǒ: "o",
    ò: "o",
    ū: "u",
    ú: "u",
    ǔ: "u",
    ù: "u",
    ǖ: "ü",
    ǘ: "ü",
    ǚ: "ü",
    ǜ: "ü",
    ń: "n",
    ň: "n",
    "": "m", // rare cases
  };

  return pinyin.replace(
    /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜńň]/g,
    (match) => toneMap[match] || match
  );
}

export default function ToPinyin(
  hanzi: string,
  options?: { toneless?: boolean }
) {
  const converted: Array<string> = [];

  // Check first if there are more accurate pinyins
  if (hanzi in pinyins_hsk) {
    converted.push(
      pinyins_hsk[hanzi as keyof typeof pinyins_hsk].replace(" ", "")
    );
  } else {
    // If there isnt an accurate pinyin, use one from the list of all pinyins
    hanzi.split("").forEach((character) => {
      if (character in pinyinList) {
        let pinyin = pinyinList[character][0];
        converted.push(pinyin);
      }
    });
  }
  return options?.toneless
    ? removePinyinTones(converted.join(""))
    : converted.join("");
}
