import { ReactNode } from "react";
import { Dictionary, Primitives } from "../types";
import pinyin from "pinyin";
import WordContainer from "./word-container";

export default function CharacterDescription(props: {
  currentCharacter: string;
  dictionary: Dictionary;
  primitives: Primitives;
}) {
  const { currentCharacter, dictionary, primitives } = props;

  const exampleSentence: ReactNode[] = [];

  if (currentCharacter in dictionary) {
    const wordIndex =
      dictionary[currentCharacter]!.exampleSentence.indexOf(currentCharacter);
    dictionary[currentCharacter]!.exampleSentence.split("").forEach(
      (value, index) => {
        if (
          index < wordIndex - 1 ||
          wordIndex - 1 + currentCharacter.length < index
        ) {
          if (/[\u4e00-\u9fff]/.test(value)) {
            exampleSentence.push(
              <WordContainer
                key={"ex_sen_" + value + "_" + index}
                className="inline-block"
                hanzi={value}
              />
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
      <WordContainer
        key={"ex_sen_" + currentCharacter}
        className="inline-block"
        hanzi={currentCharacter}
        type="highlighted"
      />
    );
  }

  const primitiveNodes: ReactNode[] = [];
  let foundAPrimitive = false;

  currentCharacter.split("").forEach((character) => {
    if (character in primitives) {
      foundAPrimitive = true;
      if (Array.isArray(primitives[character])) {
        primitiveNodes.push(
          <div className="flex flex-row gap-2" key={"char_prim_" + character}>
            <WordContainer
              className="inline-block text-3xl"
              hanzi={character}
              type="transparent"
            />
            <div className="border-l-neutral-400 border-l-2 pl-2">
              {primitives[character].map((primitive) => {
                return (
                  <div
                    className="py-1 flex flex-row gap-2"
                    key={"prim_" + primitive.primitive}
                  >
                    <p className="font-semibold text-xl">
                      {primitive.primitive}
                    </p>
                    {primitive.reason}
                  </div>
                );
              })}
            </div>
          </div>
        );
      } else {
        primitiveNodes.push(
          <div className="flex flex-row gap-2" key={"char_prim_" + character}>
            <p className="text-3xl font-bold">{character}</p>
            <div className="border-l-neutral-400 border-l-2 pl-2">
              {primitives[character]}
            </div>
          </div>
        );
      }
    }
  });

  if (!foundAPrimitive) {
    primitiveNodes.push(
      <p className="font-medium text-red-400">No primitive data...</p>
    );
  }

  return (
    <div className="w-full text-center">
      <p className="font-light" style={{ color: "var(--primary)" }}>
        PINYIN
      </p>
      <p className="text-3xl font-bold capitalize mb-3">
        {pinyin(currentCharacter).join(" ")}
      </p>
      <p className="font-light" style={{ color: "var(--primary)" }}>
        MEANING
      </p>
      {dictionary[currentCharacter] ? (
        <p className="text-xl font-medium capitalize mb-3">
          {dictionary[currentCharacter]!.meaning}
        </p>
      ) : (
        <p className="font-medium text-red-400">No meaning in dictionary...</p>
      )}
      <p className="font-light mb-1" style={{ color: "var(--primary)" }}>
        EXAMPLE
      </p>
      <div className="text-left p-2 bg-neutral-600 rounded-md mb-3">
        {dictionary[currentCharacter] ? (
          <>
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
              {dictionary[currentCharacter]!.exampleMeaning}
            </p>
          </>
        ) : (
          <p className="font-medium text-red-400">
            No example in dictionary...
          </p>
        )}
      </div>
      <p className="font-light mb-1" style={{ color: "var(--primary)" }}>
        PRIMITIVES
      </p>
      <div className="text-left p-3 bg-neutral-600 rounded-md flex flex-col gap-3">
        {primitiveNodes}
      </div>
    </div>
  );
}
