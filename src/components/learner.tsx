import { ReactNode, useEffect, useMemo, useState } from "react";
import { CharacterDataList } from "../types";
import Button from "./button";
import { IoCaretForward } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import pinyin from "pinyin";
import { IoIosUndo } from "react-icons/io";
import { useDispatch } from "react-redux";
import { saveNewWord } from "../reducer/main_reducer";

const charactersLearnAmount = 10;

export default function Learner(props: {
  category: string;
  learnedCharacters: CharacterDataList;
  wordsList: string[];
}) {
  const dispatch = useDispatch();
  const [loaded, setLoaded] = useState(false);

  const [learning, setLearning] = useState<string[]>([]);
  const [learned, setLearned] = useState<string[]>([]);
  const [currentShowing, setCurrentShowing] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [history, setHistory] = useState<string[]>([]);

  const [dictionary, setDictionary] = useState<{
    [key: string]: {
      meaning: string;
      definition: string;
      exampleSentence: string;
      exampleMeaning: string;
    };
  }>({});

  const [primitives, setPrimitives] = useState<{
    [key: string]:
      | string
      | {
          primitive: string;
          reason: string;
        }[];
  }>({});

  const refillLearningList = async () => {
    const _learning = [...learning];

    const totalLearned = [...learned, ...Object.keys(props.learnedCharacters)];
    const learnable = props.wordsList.filter(
      (item) => !totalLearned.includes(item)
    );
    // First check if learning list is actually below the normal amount how many characters i can actually learn
    while (_learning.length < charactersLearnAmount && learnable.length > 0) {
      const randomCharacter =
        learnable[Math.floor(Math.random() * learnable.length)];
      if (!_learning.includes(randomCharacter)) {
        _learning.push(randomCharacter);
      }
    }
    setLearning(_learning);
  };

  const setRandomCharacter = () => {
    // Check if there's more than 1 character in learning
    if (learning.length > 1) {
      let character: string | null = null;
      while (character == null || character == currentShowing) {
        character = learning[Math.floor(Math.random() * learning.length)];
      }
      setCurrentShowing(character);
      setRevealed(false);
    }
  };

  const handleUndo = () => {
    // Check if our history is not empty
    if (history.length > 0) {
      const _history = [...history];
      let found = false;
      while (!found && _history.length > 0) {
        let word: string | null = _history[_history.length - 1];
        _history.pop();
        // Check if it's still in the learning list
        if (learning.includes(word)) {
          setHistory(_history);
          setCurrentShowing(word);
          setRevealed(false);
          found = true;
        }
      }
    }
  };

  const handleLearned = () => {
    setLearning(learning.filter((item) => item !== currentShowing));
    setLearned([...learned, currentShowing!]);
    dispatch(saveNewWord({ word: currentShowing! }));
  };

  useEffect(() => {
    switch (props.category) {
      case "HSK 3.0/Level 1":
        import("../utils/dictionary_hsk1").then((module) => {
          setDictionary(module.hsk1Dictionary);
          import("../utils/primitives_hsk1").then((module) => {
            setPrimitives(module.hsk1Primitives);
            setLoaded(true);
          });
        });
    }
  }, [props.category]);

  useEffect(() => {
    refillLearningList();
  }, [loaded]);

  useEffect(() => {
    setRandomCharacter();
  }, [learning]);

  const informationCard = useMemo(() => {
    if (currentShowing && currentShowing in dictionary) {
      const exampleSentence: ReactNode[] = [];
      const wordIndex =
        dictionary[currentShowing]!.exampleSentence.indexOf(currentShowing);
      dictionary[currentShowing]!.exampleSentence.split("").forEach(
        (value, index) => {
          if (
            index < wordIndex - 1 ||
            wordIndex - 1 + currentShowing.length < index
          ) {
            if (/[\u4e00-\u9fff]/.test(value)) {
              exampleSentence.push(
                <div
                  key={"ex_" + value}
                  className="inline-block mx-1 h-16 bg-stone-500 p-1 rounded-md text-center"
                >
                  <p className="mx-auto">{value}</p>
                  <p className="text-sm">{pinyin(value)}</p>
                </div>
              );
            } else {
              exampleSentence.push(value);
            }
          }
        }
      );

      exampleSentence.splice(
        wordIndex - 1,
        0,
        <div
          key={"ex_" + currentShowing}
          style={{ backgroundColor: "var(--primary)" }}
          className="inline-block mx-1 h-16 p-1 rounded-md text-center text-black font-bold"
        >
          <p className="mx-auto">{currentShowing}</p>
          <p className="text-sm">{pinyin(currentShowing)}</p>
        </div>
      );

      return (
        <div className="w-full text-center">
          <p className="font-light" style={{ color: "var(--primary)" }}>
            PINYIN
          </p>
          <p className="text-3xl font-bold capitalize mb-3">
            {pinyin(currentShowing).join(" ")}
          </p>
          <p className="font-light" style={{ color: "var(--primary)" }}>
            MEANING
          </p>
          <p className="text-xl font-medium capitalize mb-3">
            {dictionary[currentShowing]!.meaning}
          </p>
          <p className="font-light mb-1" style={{ color: "var(--primary)" }}>
            EXAMPLE
          </p>
          <div className="text-left p-2 bg-stone-600 rounded-md mb-3">
            <div className="text-xl font-medium capitalize mb-3 text-left">
              {exampleSentence}
            </div>
            <p
              className="font-light mb-1 text-sm"
              style={{ color: "var(--primary)" }}
            >
              MEANING
            </p>
            <p className="text-xl font-medium capitalize">
              {dictionary[currentShowing]!.exampleMeaning}
            </p>
          </div>
          <p className="font-light mb-1" style={{ color: "var(--primary)" }}>
            PRIMITIVES
          </p>
          <div className="text-left p-2 bg-stone-600 rounded-md">
            {currentShowing in primitives ? (
              Array.isArray(primitives[currentShowing]) ? (
                primitives[currentShowing].map((primitive) => {
                  return (
                    <div className="bg-stone-500 my-1 flex">
                      <div
                        className="p-2 bg-stone-200 font-bold items-center flex"
                        style={{ color: "var(--secondary)" }}
                      >
                        {primitive.primitive}
                      </div>
                      <div className="px-2">{primitive.reason}</div>
                    </div>
                  );
                })
              ) : (
                <p>{primitives[currentShowing]}</p>
              )
            ) : (
              <p>
                This character does not seem to have any primitives data
                (Something seem to have gone wrong)
              </p>
            )}
          </div>
        </div>
      );
    } else {
      return null;
    }
  }, [currentShowing]);

  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      {!loaded ? (
        <>LOADING...</>
      ) : learning.length > 0 && !!currentShowing ? (
        // LEARNING MODE
        <>
          <div className="w-full bg-stone-700 p-3 rounded-md text-center text-7xl font-bold mb-3">
            {currentShowing}
          </div>
          <div className="w-full bg-stone-700 p-3 rounded-md grow mb-3">
            {revealed && currentShowing in dictionary ? (
              informationCard
            ) : (
              <div
                className="w-full h-full flex"
                onClick={() => {
                  setRevealed(true);
                }}
              >
                <p className="m-auto font-medium text-xl">CLICK TO REVEAL</p>
              </div>
            )}
          </div>
          <div className="w-full flex flex-row gap-2 bg-stone-800 sticky bottom-0">
            <Button
              className="w-auto"
              basic
              disabled={history.length == 0}
              onClick={handleUndo}
            >
              <IoIosUndo className="text-xl" />
            </Button>
            <Button className="w-full" basic onClick={handleLearned}>
              <FaCheck className="mr-2 text-xl" /> LEARNED
            </Button>
            <Button
              className="w-full"
              onClick={() => {
                setHistory([...history, currentShowing]);
                setRandomCharacter();
              }}
            >
              NEXT <IoCaretForward className="ml-2 text-xl" />
            </Button>
          </div>
        </>
      ) : (
        // LEARNING FINISHED
        <></>
      )}
    </div>
  );
}
