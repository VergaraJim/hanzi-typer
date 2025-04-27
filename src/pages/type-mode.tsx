import { ReactElement, useEffect, useRef, useState } from "react";
import pinyin from "pinyin";
import { MappedCharacter, TranscriptedCharacter } from "../types";
import Button from "../components/button";
import { IoMdReturnRight } from "react-icons/io";
import { FaICursor, FaSave } from "react-icons/fa";
import { saveTypeData, selectIsLoading } from "../reducer/main_reducer";
import { useDispatch, useSelector } from "react-redux";

function TypeModePage() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
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

  const getFontSize = (length: number) => {
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
      if (/[\u4e00-\u9fff]/.test(character)) {
        const transcript = transcriptedList?.find(
          (mapping) => mapping.index == index
        );

        let classes =
          "inline-block text-center px-0.5 bg-stone-600 rounded-sm mx-0.5 mt-1 w-9 h-15";
        let subtext = "__";

        if (currentCharacter && index == currentCharacter.index) {
          classes =
            "inline-block text-center px-0.5 bg-cyan-200 text-black rounded-sm mx-0.5 mt-1 w-9 h-15";
        } else if (transcript) {
          classes =
            "inline-block text-center px-0.5 bg-stone-500 rounded-sm mx-0.5 mt-1 w-9 h-15 " +
            (transcript.guessed ? "text-green-300" : "text-red-300");
          subtext = pinyin(character)[0][0];
        }

        formattedMaterial.push(
          <div key={character + index} className={classes}>
            <strong>{character}</strong>
            <span
              className={"italic select-none"}
              style={{ fontSize: getFontSize(subtext.length) }}
            >
              <br />
              {subtext}
            </span>
          </div>
        );
      } else {
        formattedMaterial.push(character);
      }
    });

    return formattedMaterial;
  };

  const guessCorrect = currentCharacter?.character
    ? pinyin(currentCharacter!.character, { style: 0 })[0][0] ==
      guess.toLowerCase()
    : false;

  const submitGuess = (skip = false) => {
    const index = mappedList?.findIndex(
      (mapping) => mapping.index == currentCharacter!.index
    );
    // Check if currentCharacter is actually in the list
    if (index != undefined) {
      const newIndex = index + 1;
      const newTranscriptedList: Array<TranscriptedCharacter> = [
        ...transcriptedList,
      ];
      newTranscriptedList.push({
        index: currentCharacter!.index,
        character: currentCharacter!.character,
        guessed: !skip,
      });
      setTranscriptedList(newTranscriptedList);
      // Check if there's a next character
      if (mappedList && mappedList[newIndex]) {
        setCurrentCharacter(mappedList[newIndex]);
      } else {
        setCurrentCharacter(null);
      }
    }
    setGuess("");
  };

  const getScore = () => {
    var score = { right: 0, wrong: 0 };
    transcriptedList.forEach((transcriptedCharacter) => {
      if (transcriptedCharacter.guessed) {
        score.right += 1;
      } else {
        score.wrong += 1;
      }
    });
    return score;
  };

  // Once the guess in the input is correct, automatically submit it
  useEffect(() => {
    if (guessCorrect) {
      submitGuess();
    }
  }, [guessCorrect]);

  // If isLoading goes from true to false, that means we saved, so redirect to home.
  const wasLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (!isLoading && wasLoadingRef.current) {
      window.location.href = "/";
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  return (
    <div className="w-full h-full min-h-full flex">
      {!material ? (
        <div className="container h-full mx-auto flex flex-col">
          <div className="my-auto flex flex-row justify-center">
            <div className="w-full md:w-1/2 lg:w-1/3 px-3">
              <p className="font-bold text-sm mb-2">
                Paste what you want to type below
              </p>
              <textarea
                ref={materialInputRef}
                className="bg-stone-700 rounded-md w-full p-2 font-medium h-56 mb-2 resize-none"
                spellCheck="false"
              />
              <Button onClick={onLockMaterial} className="w-full font-medium">
                <div className="flex m-auto justify-center items-center gap-2">
                  <FaICursor /> START TYPING
                </div>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="container h-full mx-auto flex flex-col">
          <div className="w-auto m-3 flex flex-col">
            <div
              className="bg-stone-700 rounded-md w-full p-2 font-medium mb-2 whitespace-break-spaces text-xl"
              style={{ verticalAlign: "top" }}
            >
              {getHighlightedMaterial()}
            </div>
          </div>
          <div className="flex-grow"></div>
          <div
            className="sticky w-full p-3 bg-stone-700 bottom-0 flex flex-row gap-2 rounded-xl lg:pb-8"
            style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
          >
            {currentCharacter ? (
              <>
                <div className="flex flex-col text-center">
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    WORD
                  </p>
                  <button
                    className="font-bold text-3xl px-4 py-2 rounded-md bg-stone-500 cursor-pointer hover:brightness-105"
                    onClick={() => {
                      window
                        .open(
                          "https://www.mdbg.net/chinese/dictionary?page=worddict&email=&wdrst=0&wdqb=" +
                            currentCharacter.character,
                          "_blank"
                        )!
                        .focus();
                    }}
                  >
                    {currentCharacter.character}
                  </button>
                </div>
                <div className="flex flex-col flex-grow text-center">
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    PINYIN
                  </p>
                  <input
                    autoCapitalize="none"
                    ref={guessInputRef}
                    className={
                      "px-4 py-2 rounded-md outline-0 flex-grow text-2xl w-full text-center text-black " +
                      (guessCorrect || !guess
                        ? "bg-stone-400"
                        : "outline-red-400 bg-red-300")
                    }
                    value={guess}
                    onChange={(event) => {
                      setGuess(event.target.value);
                    }}
                  ></input>
                </div>
                <div className="flex flex-col text-center">
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    SKIP
                  </p>
                  <Button
                    className="w-16 h-full flex flex-col justify-center items-center"
                    onClick={() => {
                      submitGuess(true);
                      if (guessInputRef.current) {
                        guessInputRef.current!.focus();
                      }
                    }}
                  >
                    <IoMdReturnRight size="24" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col text-center flex-grow">
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    RIGHT
                  </p>
                  <div className="p-3 bg-stone-500 rounded-md text-green-300 font-extrabold">
                    {getScore().right}
                  </div>
                </div>
                <div className="flex flex-col text-center flex-grow">
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    WRONG
                  </p>
                  <div className="p-3 bg-stone-500 rounded-md text-red-300 font-extrabold">
                    {getScore().wrong}
                  </div>
                </div>
                <div className="flex flex-col text-center flex-grow">
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    SCORE
                  </p>
                  <div className="p-3 bg-stone-500 rounded-md font-extrabold">
                    {getScore().right} / {mappedList.length}
                  </div>
                </div>
                <div className="flex flex-col text-center">
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    SAVE
                  </p>
                  <Button
                    disabled={isLoading}
                    className="px-6"
                    onClick={() => {
                      dispatch(saveTypeData(transcriptedList));
                    }}
                  >
                    <FaSave />
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TypeModePage;
