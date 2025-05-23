import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveGuessedWord,
  selectCharacters,
  selectIsLoading,
} from "../reducer/main_reducer";
import { CharacterDataList, Dictionary, Primitives } from "../types";
import { definitions } from "../utils/definitions";
import { PiCardsThreeFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import Button from "../components/button";
import { IoMdReturnRight } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { FaEye } from "react-icons/fa6";
import TextInput from "../components/text-input";
import { useNavigate } from "react-router-dom";
import CharacterDescription from "../components/character-description";
import WordDisplay from "../components/word-display";
import ToPinyin from "../utils/pinyin";
import { definitionsMiniHSK1 } from "../utils/definitions_mini";

interface ReviewCharacter {
  word: string;
  definition: string;
  related: RelatedCharacter[];
}

interface RelatedCharacter {
  word: string;
  definition: string;
  level: string;
}

type ReviewList = ReviewCharacter[];

async function getReviewList(
  characters: CharacterDataList,
  forceAmount: number = 0
) {
  const reviewList: ReviewList = [];
  let remainingForced = forceAmount;

  const organizedKeys = Object.keys(characters).sort(function (a, b) {
    return (
      new Date(characters[a].reviewDate).getTime() -
      new Date(characters[b].reviewDate).getTime()
    );
  });

  organizedKeys.forEach((characterKey) => {
    const character = characters[characterKey];
    if (
      new Date().getTime() > new Date(character.reviewDate).getTime() ||
      remainingForced > 0
    ) {
      if (remainingForced > 0) {
        remainingForced -= 1;
      }
      const related: RelatedCharacter[] = [];
      let definition = "";

      Object.keys(definitions).forEach((word) => {
        if (word == characterKey) {
          definition = definitions[word as keyof typeof definitions].definition;
        } else if (word.includes(characterKey)) {
          related.push({
            word,
            definition:
              definitions[word as keyof typeof definitions].definition,
            level: definitions[word as keyof typeof definitions].category,
          });
        }
      });

      reviewList.push({ word: characterKey, definition, related });
    }
  });

  return reviewList;
}

function shuffle(array: ReviewList) {
  let newArray = [...array];

  let currentIndex = newArray.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [newArray[currentIndex], newArray[randomIndex]] = [
      newArray[randomIndex],
      newArray[currentIndex],
    ];
  }

  return newArray;
}

function ReviewPage() {
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  const characters = useSelector(selectCharacters);
  const [reviewListLoading, setReviewListLoading] = useState(true);
  const [reviewList, setReviewList] = useState<ReviewList>([]);
  const [guessedCharacters, setGuessedCharacters] = useState<string[]>([]);
  const [skippedCharacters, setSkippedCharacters] = useState<string[]>([]);
  const [currentCharacter, setCurrentCharacter] =
    useState<ReviewCharacter | null>(null);
  const navigate = useNavigate();

  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState("");

  const [dictionary, setDictionary] = useState<Dictionary>({});
  const [primitives, setPrimitives] = useState<Primitives>({});

  const loadReviewList = async (earlyReviewCount: number = 0) => {
    setReviewListLoading(true);
    const tempReviewList = await getReviewList(characters, earlyReviewCount);
    setReviewList(tempReviewList);
    if (tempReviewList.length > 0) {
      setCurrentCharacter(shuffle(tempReviewList)[0]);
    }
    setReviewListLoading(false);
  };

  const handleNextCharacter = () => {
    let nextCharacter: ReviewCharacter | null = null;
    // If finished
    if (reviewList.length - guessedCharacters.length == 0) {
      alert("FINISHED");
    } else {
      setRevealed(false);
      if (!guessed && !skippedCharacters.includes(currentCharacter!.word)) {
        setSkippedCharacters([...skippedCharacters, currentCharacter!.word]);
      }
      while (
        !nextCharacter &&
        reviewList.length - guessedCharacters.length > 0
      ) {
        shuffle(reviewList).forEach((character) => {
          // Check if the character hasnt already been guessed
          if (!guessedCharacters.includes(character.word)) {
            // Check if it's the character we're already guessing or wether it's the only remaining one
            if (
              character.word != currentCharacter?.word ||
              reviewList.length - guessedCharacters.length == 1
            ) {
              nextCharacter = character;
            }
          }
        });
      }
      setCurrentCharacter(nextCharacter);
    }
  };

  const handleGuessed = () => {
    if (!guessedCharacters.includes(currentCharacter?.word!)) {
      setGuessedCharacters([...guessedCharacters, currentCharacter?.word!]);
      setGuess("");
      dispatch(
        saveGuessedWord({
          skipped: skippedCharacters.includes(currentCharacter!.word),
          word: currentCharacter!.word,
        })
      );
    }
  };

  const initialLoadDictionary = async () => {
    const hsk1Dictionary = (await import("../utils/dictionary_hsk1"))
      .dictionaryHSK1;

    const hsk1Primitives = (await import("../utils/primitives_hsk1"))
      .hsk1Primitives;

    setDictionary({ ...hsk1Dictionary });
    setPrimitives({ ...hsk1Primitives });
  };

  const guessed = currentCharacter?.word
    ? guessedCharacters.includes(currentCharacter?.word)
    : false;

  useEffect(() => {
    loadReviewList();
  }, []);

  useEffect(() => {
    initialLoadDictionary();
  }, []);

  const characterDescription = useMemo(() => {
    if ((guessed || revealed) && currentCharacter) {
      return (
        <div className="p-4 bg-neutral-700 shadow-md rounded-xl mb-2">
          <CharacterDescription
            currentCharacter={currentCharacter.word}
            dictionary={dictionary}
            definitionsMini={definitionsMiniHSK1}
            primitives={primitives}
          />
        </div>
      );
    } else {
      return null;
    }
  }, [guessed, revealed, currentCharacter]);

  return (
    <div className="container min-h-full flex flex-col mx-auto">
      {reviewListLoading ? (
        <div className="w-full min-h-full flex justify-center items-center flex-col">
          <PiCardsThreeFill className="text-8xl mb-2" />
          <p className="font-bold text-xl">SHUFFLING CHARACTERS</p>
          <p className="font-medium text-sm">Please wait...</p>
        </div>
      ) : Object.keys(reviewList).length == 0 || !currentCharacter ? (
        <div className="max-w-4/5 bg-neutral-700 p-5 rounded-md min-h-full mx-auto my-auto h-full flex justify-center items-center flex-col">
          <IoClose className="text-8xl mb-2" />
          <p className="font-bold text-xl">NO CHARACTER FOUND</p>
          <p className="font-medium text-sm text-center mt-2">
            There are currently {Object.keys(characters).length} characters
            slated for review in the future.
          </p>
          <p className="font-medium text-sm text-center mt-2">
            Would you like to review them early?
          </p>
          <Button
            className="my-6 mb-2 w-full"
            onClick={async () => {
              loadReviewList(10);
            }}
          >
            EARLY REVIEW
          </Button>
        </div>
      ) : (
        <div className="w-full md:w-1/2 mx-auto flex flex-col grow">
          <div className="text-xl mb-1">
            {guessedCharacters.length} / {Object.keys(reviewList).length}
          </div>
          <div className="w-full h-4 bg-neutral-500 rounded-md overflow-clip mb-4">
            <div
              style={{
                width:
                  (
                    (guessedCharacters.length /
                      Object.keys(reviewList).length) *
                    100.0
                  ).toFixed(0) + "%",
              }}
              className="h-full bg-green-300"
            ></div>
          </div>
          <WordDisplay word={currentCharacter?.word} />
          <div className="mb-3" />
          {characterDescription}
          <div className="grow md:grow-0"></div>
          <div
            className={
              "sticky w-full p-3 bg-neutral-700 bottom-0 flex flex-row gap-2 rounded-xl lg:pb-8 " +
              (isLoading ? "opacity-50" : "pointer-none")
            }
            style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
          >
            {guessedCharacters.length < reviewList.length ? (
              <>
                <div
                  className={
                    "flex flex-col flex-grow text-center w-1/3 " +
                    (revealed ? "opacity-75 pointer-none:" : "")
                  }
                >
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    PINYIN
                  </p>
                  <TextInput
                    autoFocus
                    autoCapitalize="none"
                    value={guess}
                    onChange={(event) => {
                      if (
                        currentCharacter != null && currentCharacter.word
                          ? ToPinyin(currentCharacter.word, {
                              toneless: true,
                            }) == event.target.value.toLowerCase()
                          : false
                      ) {
                        setGuess("");
                        handleGuessed();
                      } else {
                        setGuess(event.target.value);
                      }
                    }}
                    disabled={revealed}
                  />
                </div>
                <div className="flex flex-col text-center">
                  <p className="font-bold text-xs whitespace-nowrap mb-2">
                    {revealed || guessed ? "NEXT" : "REVEAL"}
                  </p>
                  <Button
                    className="h-full flex flex-col justify-center items-center px-4"
                    onClick={() => {
                      if (!guessed && !revealed) {
                        setRevealed(true);
                      } else {
                        if (!guessed) {
                          setGuess("");
                        }
                        handleNextCharacter();
                      }
                    }}
                  >
                    {revealed || guessed ? (
                      <IoMdReturnRight size="24" />
                    ) : (
                      <FaEye size="24" />
                    )}
                  </Button>
                </div>
              </>
            ) : (
              <div className="w-full flex flex-col text-center">
                <p className="font-bold text-xs whitespace-nowrap mb-2">HOME</p>
                <Button
                  disabled={isLoading}
                  className="w-full h-full flex flex-col justify-center items-center py-3"
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <AiFillHome size="24" />
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewPage;
