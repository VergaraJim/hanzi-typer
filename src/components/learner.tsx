import { useEffect, useMemo, useState } from "react";
import { CharacterDataList, Dictionary, Primitives } from "../types";
import Button from "./button";
import { IoCaretForward } from "react-icons/io5";
import { FaCheck } from "react-icons/fa6";
import { IoIosUndo } from "react-icons/io";
import { useDispatch } from "react-redux";
import { saveNewWord } from "../reducer/main_reducer";
import CharacterDescription from "./character-description";

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

  const [dictionary, setDictionary] = useState<Dictionary>({});

  const [primitives, setPrimitives] = useState<Primitives>({});

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

    localStorage.setItem(
      "learningProgress[" + props.category + "]",
      JSON.stringify(_learning)
    );
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
    setLoaded(false);
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
    if (loaded) {
      const data: Array<string> = JSON.parse(
        localStorage.getItem("learningProgress[" + props.category + "]") || "{}"
      );
      if (Object.keys(data).length > 0) {
        setLearning(data);
      } else {
        refillLearningList();
      }
    }
  }, [loaded]);

  useEffect(() => {
    setRandomCharacter();
  }, [learning]);

  const informationCard = useMemo(() => {
    if (currentShowing && currentShowing in dictionary) {
      return (
        <CharacterDescription
          currentCharacter={currentShowing}
          dictionary={dictionary}
          primitives={primitives}
        />
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
          <div className="w-full flex flex-row gap-2 bg-stone-800 sticky bottom-0 py-3">
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
