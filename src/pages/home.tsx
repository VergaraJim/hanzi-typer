import { ReactElement, useEffect, useRef, useState } from "react";
import pinyin from "pinyin";
import { MappedCharacter, TranscriptedCharacter } from "../types";
import Button from "../container/button";

function HomePage() {
  const [material, setMaterial] = useState("");
  const [mappedList, setMappedList] = useState<Array<MappedCharacter>>([]);
  const [transcriptedList, setTranscriptedList] = useState<
    Array<TranscriptedCharacter>
  >([]);
  const [currentCharacter, setCurrentCharacter] =
    useState<MappedCharacter | null>(null);
  const materialInputRef = useRef<HTMLTextAreaElement>(null);
  const guessInputRef = useRef<HTMLInputElement>(null);

  const [guess, setGuess] = useState("");

  // Locks the text the user has inserted and generates the needed variables
  const onLockMaterial = () => {
    if (materialInputRef.current) {
      const newMaterial = materialInputRef.current!.value;
      setMaterial(newMaterial);

      // Map the material
      const list: Array<MappedCharacter> = [];
      newMaterial.split("").forEach((character, index) => {
        if (/[\u4e00-\u9fff]/.test(character)) {
          list.push({ index, character });
        }
      });
      setMappedList(list);

      // Get the first index available
      if (list[0]) {
        setCurrentCharacter(list[0]);
      }
    }
  };

  const getHighlightedMaterial = () => {
    const explodedCharacters = material.split("");
    let formattedMaterial: Array<string | ReactElement> = [];

    explodedCharacters.forEach((character, index) => {
      const transcript = transcriptedList?.find(
        (mapping) => mapping.index == index
      );
      if (currentCharacter && index == currentCharacter.index) {
        formattedMaterial.push(
          <div
            className={
              "inline-block text-center px-0.5 bg-cyan-200 text-black rounded-sm mx-0.5 mt-1 w-9 h-15"
            }
          >
            <strong>{character}</strong>
            <br />
            <span className={"italic"}>__</span>
          </div>
        );
      } else if (transcript) {
        const pinyinText = pinyin(character)[0][0];
        let getFontSize = (length: number) => {
          switch (length) {
            case 1:
            case 2:
              return 15;
            case 3:
              return 14;
            default:
            case 4:
              return 9;
          }
        };
        formattedMaterial.push(
          <div
            className={
              "inline-block text-center px-0.5 bg-stone-500 rounded-sm mx-0.5 mt-1 w-9 h-15 " +
              (transcript.guessed ? "text-green-300" : "text-red-300")
            }
          >
            <strong>{character}</strong>
            <br />
            <span
              className={"italic"}
              style={{ fontSize: getFontSize(pinyinText.length) }}
            >
              {pinyinText}
            </span>
          </div>
        );
      } else {
        if (/[\u4e00-\u9fff]/.test(character)) {
          formattedMaterial.push(
            <div
              className={
                "inline-block text-center px-0.5 bg-stone-600 rounded-sm mx-0.5 mt-1 w-9 h-15"
              }
            >
              <strong>{character}</strong>
              <br />
              <span className={"italic"}>__</span>
            </div>
          );
        } else {
          formattedMaterial.push(character);
        }
      }
    });

    return formattedMaterial;
  };

  const guessCorrect = currentCharacter?.character
    ? pinyin(currentCharacter!.character, { style: 0 })[0][0] ==
      guess.toLowerCase()
    : false;

  useEffect(() => {
    if (guessCorrect) {
      submitGuess();
    }
  }, [guessCorrect]);

  const submitGuess = (skip = false) => {
    const index = mappedList?.findIndex(
      (mapping) => mapping.index == currentCharacter!.index
    );
    // Check if currentCharacter is actually in the list
    if (index != undefined) {
      const newIndex = index + 1;
      // Check if there's a next character
      if (mappedList && mappedList[newIndex]) {
        const newTranscriptedList: Array<TranscriptedCharacter> = [
          ...transcriptedList,
        ];
        newTranscriptedList.push({
          index: currentCharacter!.index,
          character: currentCharacter!.character,
          guessed: !skip,
        });
        setTranscriptedList(newTranscriptedList);
        setCurrentCharacter(mappedList[newIndex]);
      } else {
        // DONE
      }
    }
    setGuess("");
  };

  return (
    <div className="w-full h-full overflow-auto flex flex-col">
      {!material ? (
        <div className="my-auto w-auto m-3">
          <p className="font-bold text-sm mb-2">MATERIAL</p>
          <textarea
            ref={materialInputRef}
            className="bg-stone-700 rounded-md w-full p-2 font-medium h-56 mb-2"
            spellCheck="false"
          />
          <Button onClick={onLockMaterial} className="w-full">
            LOCK
          </Button>
        </div>
      ) : (
        <>
          <div className="w-auto m-3 flex flex-col mb-24">
            <div
              className="bg-stone-700 rounded-md w-full p-2 font-medium mb-2 whitespace-break-spaces text-xl"
              style={{ verticalAlign: "top" }}
            >
              {getHighlightedMaterial()}
            </div>
          </div>

          <div
            className="sticky w-full p-4 bg-stone-700 bottom-0"
            style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
          >
            {currentCharacter ? (
              <div className="flex gap-2 mx-auto items-center mb-2">
                <div className="text-center p-2 bg-stone-500 rounded-md">
                  <p className="font-bold text-xs">CURRENT WORD</p>
                  <div className="text-4xl py-2text-center">
                    {currentCharacter.character}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="text-black font-medium flex gap-2">
              <input
                ref={guessInputRef}
                className={
                  "px-4 py-2 flex-grow rounded-md outline-0 " +
                  (guessCorrect || !guess
                    ? "bg-stone-400"
                    : "outline-red-400 bg-red-300")
                }
                value={guess}
                onChange={(event) => {
                  setGuess(event.target.value);
                }}
              ></input>
              <Button
                onClick={() => {
                  submitGuess(true);
                  if (guessInputRef.current) {
                    guessInputRef.current!.focus();
                  }
                }}
              >
                SKIP
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;
