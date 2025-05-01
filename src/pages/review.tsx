import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  saveReviewData,
  selectCharacters,
  selectIsLoading,
} from "../reducer/main_reducer";
import { CharacterDataList } from "../types";
import { definitions } from "../utils/definitions";
import { PiCardsThreeFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import Button from "../components/button";
import { IoMdReturnRight } from "react-icons/io";
import pinyin from "pinyin";
import { AiFillHome } from "react-icons/ai";
import { FaEye } from "react-icons/fa6";
import TextInput from "../components/text-input";

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

async function getReviewList(characters: CharacterDataList) {
  const reviewList: ReviewList = [];

  Object.keys(characters).forEach((characterKey) => {
    const character = characters[characterKey];
    if (new Date().getTime() > new Date(character.reviewDate).getTime()) {
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

  const [revealed, setRevealed] = useState(false);
  const [guess, setGuess] = useState("");

  const loadReviewList = async () => {
    setReviewListLoading(true);
    const tempReviewList = await getReviewList(characters);
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
    setGuessedCharacters([...guessedCharacters, currentCharacter?.word!]);
    setGuess("");
    // handleNextCharacter();
  };

  const handleSave = () => {
    const toIncrease: string[] = [];
    const toRedo: string[] = [];

    reviewList.forEach((reviewCharacter) => {
      if (!skippedCharacters.includes(reviewCharacter.word)) {
        toIncrease.push(reviewCharacter.word);
      } else {
        toRedo.push(reviewCharacter.word);
      }
    });

    if (toIncrease.length > 0) {
      dispatch(saveReviewData({ toIncrease, toRedo }));
    }
  };

  const guessCorrect = currentCharacter?.word
    ? pinyin(currentCharacter!.word, { style: 0 })[0][0] == guess.toLowerCase()
    : false;

  const guessed = currentCharacter?.word
    ? guessedCharacters.includes(currentCharacter?.word)
    : false;

  useEffect(() => {
    loadReviewList();
  }, []);

  // Once the guess in the input is correct, automatically submit it
  useEffect(() => {
    if (guessCorrect) {
      handleGuessed();
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

  return reviewListLoading ? (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <PiCardsThreeFill className="text-8xl mb-2" />
      <p className="font-bold text-xl">SHUFFLING CHARACTERS</p>
      <p className="font-medium text-sm">Please wait...</p>
    </div>
  ) : Object.keys(reviewList).length == 0 || !currentCharacter ? (
    <div className="max-w-4/5 mx-auto h-full flex justify-center items-center flex-col">
      <IoClose className="text-8xl mb-2" />
      <p className="font-bold text-xl">NO CHARACTER FOUND</p>
      <p className="font-medium text-sm text-center mt-2">
        There are currently {Object.keys(characters).length} characters slated
        for review in the future.
      </p>
      <p className="font-medium text-sm text-center mt-2">
        Would you like to review them early?
      </p>
    </div>
  ) : (
    <div className="w-full min-h-full flex flex-col">
      <div className="text-xl mb-1">
        {guessedCharacters.length} / {Object.keys(reviewList).length}
      </div>
      <div className="w-full h-4 bg-stone-500 rounded-md overflow-clip mb-4">
        <div
          style={{
            width:
              (
                (guessedCharacters.length / Object.keys(reviewList).length) *
                100.0
              ).toFixed(0) + "%",
          }}
          className="h-full bg-green-300"
        ></div>
      </div>
      <div className="p-4 bg-stone-700 shadow-md rounded-xl mb-2">
        <p className="text-center text-7xl font-bold">
          {currentCharacter?.word}
        </p>
      </div>
      {guessed || revealed ? (
        <>
          <div className="p-4 bg-stone-700 shadow-md rounded-xl mb-2 text-center">
            <p className="font-bold text-3xl">
              {pinyin(currentCharacter.word)}
            </p>
          </div>
          <div className="p-4 bg-stone-700 shadow-md rounded-xl mb-2">
            <Description character={currentCharacter} />
          </div>
        </>
      ) : null}
      <div className="grow md:grow-0"></div>
      <div
        className="sticky w-full p-3 bg-stone-700 bottom-0 flex flex-row gap-2 rounded-xl lg:pb-8"
        style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
      >
        {guessedCharacters.length < reviewList.length ? (
          <>
            <div className="flex flex-col text-center">
              <p className="font-bold text-xs whitespace-nowrap mb-2">REVEAL</p>
              <Button
                disabled={revealed || guessed}
                className="h-full flex flex-col justify-center items-center px-4"
                onClick={() => {
                  setRevealed(true);
                }}
              >
                <FaEye size="24" />
              </Button>
            </div>
            <div className="flex flex-col flex-grow text-center w-1/3">
              <p className="font-bold text-xs whitespace-nowrap mb-2">PINYIN</p>
              <TextInput
                autoCapitalize="none"
                value={guess}
                onChange={(event) => {
                  setGuess(event.target.value);
                }}
              />
            </div>
            <div className="flex flex-col text-center">
              <p className="font-bold text-xs whitespace-nowrap mb-2">
                {guessed ? "NEXT" : "SKIP"}
              </p>
              <Button
                className="h-full flex flex-col justify-center items-center px-4"
                onClick={() => {
                  if (!guessed) {
                    setGuess("");
                  }
                  handleNextCharacter();
                }}
              >
                <IoMdReturnRight size="24" />
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
                handleSave();
              }}
            >
              <AiFillHome size="24" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function Description(props: { character: ReviewCharacter }) {
  const entries = [
    ...props.character.definition.matchAll(/(?<=\d\s)([^0-9]+?)\s(?=\d|\z)/gs),
  ];

  return (
    <div className="whitespace-break-spaces">
      <p className="text-lg font-bold mb-2" style={{ color: "var(--primary)" }}>
        DEFINITION
      </p>
      {entries.map((entry, index) => (
        <p className="py-1" key={"entries-" + index}>
          {entry.toString() + "\n\n"}
        </p>
      ))}
      <p className="text-lg font-bold mb-2" style={{ color: "var(--primary)" }}>
        RELATED
      </p>
      {props.character.related.map((related) => {
        /* const relatedEntries = [
          ...related.definition.matchAll(/(?<=\d\s)([^0-9]+?)\s(?=\d|\z)/gs),
        ]; */
        return (
          <div
            className="flex mb-2 cursor-pointer"
            key={"related-" + related.word}
            onClick={() => {
              window
                .open(
                  "https://www.mdbg.net/chinese/dictionary?page=worddict&email=&wdrst=0&wdqb=" +
                    related.word,
                  "_blank"
                )!
                .focus();
            }}
          >
            <div
              className="p-2 rounded-l-md bg-stone-100 text-lg font-bold whitespace-nowrap"
              style={{ color: "var(--secondary)" }}
            >
              {related.word}
            </div>
            <div className="p-2 bg-stone-500 font-bold whitespace-nowrap flex-grow">
              {pinyin(related.word)}
            </div>
            <div className="p-2 rounded-r-md bg-stone-500 whitespace-nowrap text-xs">
              {related.level}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ReviewPage;
