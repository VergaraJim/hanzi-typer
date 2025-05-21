import { ReactElement, useEffect, useMemo, useRef, useState } from "react";
import Button from "./button";
import { IoMdReturnRight } from "react-icons/io";
import { FaSave } from "react-icons/fa";
import { TranscriptedWord } from "../types";
import WordContainer, { WordContainerTypes } from "./word-container";
import ToPinyin from "../utils/pinyin";
import { stringToWordArray } from "../utils/functions";

class MaterialEntry {
  characters: string = "";
  isWord: boolean = false;
  isDone: boolean = false;
  isGuessed: boolean = false;
  index: number = 0;

  constructor(
    characters: string,
    isWord: boolean,
    isDone: boolean,
    isGuessed: boolean,
    index: number
  ) {
    this.characters = characters;
    this.isWord = isWord;
    this.isDone = isDone;
    this.isGuessed = isGuessed;
    this.index = index;
  }

  getDuplicate() {
    return new MaterialEntry(
      this.characters,
      this.isWord,
      this.isDone,
      this.isGuessed,
      this.index
    );
  }
}

type MaterialEntryList = { [key: number]: MaterialEntry };

export default function Transcripter(props: {
  material: string;
  onSave: (transcript: Array<TranscriptedWord>) => void;
}) {
  const [entries, setEntries] = useState<MaterialEntryList>({});
  const [selectedEntry, setSelectedEntry] = useState<MaterialEntry | null>(
    null
  );
  const [guess, setGuess] = useState("");
  const guessInputRef = useRef<HTMLInputElement>(null);

  const handleSubmitGuess = (skip: boolean = false) => {
    const tempEntries = { ...entries };
    const tempEntry = selectedEntry?.getDuplicate();
    tempEntry!.isDone = true;
    tempEntry!.isGuessed = !skip;
    tempEntries[tempEntry!.index] = tempEntry!;
    setEntries(tempEntries);

    let foundIndex: number | null = null;
    Object.keys(tempEntries).forEach((entryIndex) => {
      if (foundIndex == null && parseInt(entryIndex) > tempEntry!.index) {
        if (
          tempEntries[parseInt(entryIndex)].isWord &&
          !tempEntries[parseInt(entryIndex)].isDone
        ) {
          foundIndex = parseInt(entryIndex);
        }
      }
    });
    if (foundIndex != null) {
      setSelectedEntry(tempEntries[foundIndex]);
    } else {
      setSelectedEntry(null);
    }
  };

  const handleSave = () => {
    if (isFinished) {
      const transcriptedWords: Array<TranscriptedWord> = [];

      Object.keys(entries).forEach((index) => {
        const entry = entries[parseInt(index)];
        if (entry.isWord && entry.isDone) {
          transcriptedWords.push({
            index: parseInt(index),
            word: entry.characters,
            guessed: entry.isGuessed,
          });
        }
      });

      props.onSave(transcriptedWords);
    }
  };

  const [guessRight, guessWrong, guessTotal] = (() => {
    let _right: number = 0;
    let _wrong: number = 0;
    let _total: number = 0;

    Object.keys(entries).map((entryIndex) => {
      if (
        entries[parseInt(entryIndex)].isWord &&
        entries[parseInt(entryIndex)].isDone
      ) {
        _total += 1;
        if (entries[parseInt(entryIndex)].isGuessed) {
          _right += 1;
        } else {
          _wrong += 1;
        }
      }
    });

    return [_right, _wrong, _total];
  })();

  useEffect(() => {
    const orderedFoundWords: MaterialEntryList = {};

    const materialWords = stringToWordArray(props.material);

    materialWords.forEach((word, index) => {
      orderedFoundWords[index] = new MaterialEntry(
        word,
        /[\u4e00-\u9fff]/.test(word),
        false,
        false,
        index
      );
    });

    setEntries(orderedFoundWords);

    if (Object.keys(orderedFoundWords).length > 0) {
      setSelectedEntry(
        orderedFoundWords[parseInt(Object.keys(orderedFoundWords)[0])]
      );
    }
  }, [props.material]);

  // Generates the viewable list of characters
  const highlightedMaterials = useMemo(() => {
    let formattedMaterial: Array<string | ReactElement> = [];

    Object.keys(entries)
      .sort(function (a, b) {
        return parseInt(a) - parseInt(b);
      })
      .forEach((index) => {
        const entry = entries[parseInt(index)];
        if (/[\u4e00-\u9fff]/.test(entry.characters)) {
          let type: WordContainerTypes = "basic";

          if (entry.index == selectedEntry?.index) {
            type = "typing";
          } else if (entry.isDone) {
            if (entry.isGuessed) {
              type = "highlighted";
            } else {
              type = "wrong";
            }
          }

          formattedMaterial.push(
            <WordContainer
              className="inline-block"
              hanzi={entry.characters}
              type={type}
              guessing={!entry.isDone}
            />
          );
        } else {
          formattedMaterial.push(entry.characters);
        }
      });

    return formattedMaterial;
  }, [entries]);

  const isFinished = useMemo(() => {
    let finished = true;

    Object.keys(entries).forEach((entryKey) => {
      if (
        entries[parseInt(entryKey)].isWord &&
        !entries[parseInt(entryKey)].isDone
      ) {
        finished = false;
      }
    });

    return finished;
  }, [entries]);

  return (
    <div className="mx-auto container flex flex-col">
      <div className="flex flex-col">
        <div
          className="bg-neutral-700 rounded-lg w-full p-2 font-medium mb-2 whitespace-break-spaces text-xl"
          style={{ verticalAlign: "top" }}
        >
          {highlightedMaterials}
        </div>
      </div>
      <div className="flex-grow my-4"></div>
      <div
        className="sticky w-full md:w-auto bottom-0 md:bottom-4 md:mb-4 mx-auto p-3 bg-neutral-700 flex flex-row gap-2 rounded-xl lg:pb-8"
        style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
      >
        {selectedEntry != null ? (
          <>
            <div className="flex flex-col text-center">
              <p className="font-bold text-xs whitespace-nowrap mb-2">WORD</p>
              <button
                className="font-bold text-3xl px-4 py-2 rounded-md bg-neutral-500 cursor-pointer hover:brightness-105 whitespace-nowrap"
                onClick={() => {
                  window
                    .open(
                      "https://www.mdbg.net/chinese/dictionary?page=worddict&email=&wdrst=0&wdqb=" +
                        selectedEntry.characters,
                      "_blank"
                    )!
                    .focus();
                }}
              >
                {selectedEntry.characters}
              </button>
            </div>
            <div className="flex flex-col flex-grow text-center">
              <p className="font-bold text-xs whitespace-nowrap mb-2">PINYIN</p>
              <input
                autoCapitalize="none"
                ref={guessInputRef}
                className={
                  "px-4 py-2 rounded-md outline-0 flex-grow text-2xl w-full text-center text-black bg-neutral-400"
                }
                value={guess}
                onChange={(event) => {
                  if (
                    selectedEntry != null && selectedEntry.characters
                      ? ToPinyin(selectedEntry.characters, {
                          toneless: true,
                        }) == event.target.value.toLowerCase()
                      : false
                  ) {
                    setGuess("");
                    handleSubmitGuess();
                  } else {
                    setGuess(event.target.value);
                  }
                }}
              ></input>
            </div>
            <div className="flex flex-col text-center">
              <p className="font-bold text-xs whitespace-nowrap mb-2">SKIP</p>
              <Button
                className="w-16 h-full flex flex-col justify-center items-center"
                onClick={() => {
                  handleSubmitGuess(true);
                  if (guessInputRef.current) {
                    guessInputRef.current!.focus();
                  }
                }}
              >
                <IoMdReturnRight size="24" />
              </Button>
            </div>
          </>
        ) : isFinished ? (
          <>
            <div className="flex flex-col text-center flex-grow">
              <p className="font-bold text-xs whitespace-nowrap mb-2">RIGHT</p>
              <div className="p-3 bg-neutral-500 rounded-md text-green-300 font-extrabold">
                {guessRight}
              </div>
            </div>
            <div className="flex flex-col text-center flex-grow">
              <p className="font-bold text-xs whitespace-nowrap mb-2">WRONG</p>
              <div className="p-3 bg-neutral-500 rounded-md text-red-300 font-extrabold">
                {guessWrong}
              </div>
            </div>
            <div className="flex flex-col text-center flex-grow">
              <p className="font-bold text-xs whitespace-nowrap mb-2">SCORE</p>
              <div className="p-3 bg-neutral-500 rounded-md font-extrabold">
                {guessRight} / {guessTotal}
              </div>
            </div>
            <div className="flex flex-col text-center">
              <p className="font-bold text-xs whitespace-nowrap mb-2">SAVE</p>
              <Button
                disabled={false}
                className="px-6"
                onClick={() => {
                  handleSave();
                }}
              >
                <FaSave />
              </Button>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
