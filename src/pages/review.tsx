import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCharacters } from "../reducer/main_reducer";
import { CharacterDataList } from "../types";
import { definitions } from "../utils/definitions";
import { PiCardsThreeFill } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import Button from "../components/button";
import { IoMdArrowDropright, IoMdReturnRight } from "react-icons/io";
import pinyin from "pinyin";

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
  const characters = useSelector(selectCharacters);
  const [reviewListLoading, setReviewListLoading] = useState(true);
  const [reviewList, setReviewList] = useState<ReviewList>([]);
  const [guessedCharacters, setGuessedCharacters] = useState<string[]>([]);
  const [currentCharacter, setCurrentCharacter] =
    useState<ReviewCharacter | null>(null);
  const guessInputRef = useRef<HTMLInputElement>(null);

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

  return reviewListLoading ? (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <PiCardsThreeFill className="text-8xl mb-2" />
      <p className="font-bold text-xl">SHUFFLING CHARACTERS</p>
      <p className="font-medium text-sm">Please wait...</p>
    </div>
  ) : Object.keys(reviewList).length == 0 || !currentCharacter ? (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <IoClose className="text-8xl mb-2" />
      <p className="font-bold text-xl">NO CHARACTER FOUND</p>
      <p className="font-medium text-sm">
        Start typing characters to fill the list
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
      {guessed ? (
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
      <div className="flex-grow"></div>
      <div
        className="sticky w-full p-3 bg-stone-700 bottom-0 flex flex-row gap-2 rounded-xl lg:pb-8"
        style={{ boxShadow: "0px 0px 10px rgba(0,0,0,0.5)" }}
      >
        {!guessed ? (
          <>
            <div className="flex flex-col flex-grow text-center">
              <p className="font-bold text-xs whitespace-nowrap mb-2">PINYIN</p>
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
              <p className="font-bold text-xs whitespace-nowrap mb-2">SKIP</p>
              <Button
                className="w-16 h-full flex flex-col justify-center items-center"
                onClick={() => {
                  handleNextCharacter();
                }}
              >
                <IoMdReturnRight size="24" />
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full flex flex-col text-center">
            <p className="font-bold text-xs whitespace-nowrap mb-2">NEXT</p>
            <Button
              className="w-full h-full flex flex-col justify-center items-center py-3"
              onClick={() => {
                handleNextCharacter();
              }}
            >
              <IoMdArrowDropright size="24" />
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
        const relatedEntries = [
          ...related.definition.matchAll(/(?<=\d\s)([^0-9]+?)\s(?=\d|\z)/gs),
        ];
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
