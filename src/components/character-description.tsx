import { ReactNode, useState } from "react";
import { DefinitionMini, Dictionary, Primitives } from "../types";
import WordContainer from "./word-container";
import ToPinyin from "../utils/pinyin";
import { stringToWordArray } from "../utils/functions";
import Button from "./button";
import { FaCirclePlay } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { selectSettings } from "../reducer/main_reducer";

export default function CharacterDescription(props: {
  currentCharacter: string;
  dictionary: Dictionary;
  definitionsMini: DefinitionMini;
  primitives: Primitives;
}) {
  const { currentCharacter, dictionary, primitives } = props;

  const primitiveNodes: ReactNode[] = [];
  let foundAPrimitive = false;

  currentCharacter.split("").forEach((character) => {
    if (character in primitives) {
      foundAPrimitive = true;
      if (Array.isArray(primitives[character])) {
        primitiveNodes.push(
          <div className="flex flex-col" key={"char_prim_" + character}>
            <div className=" flex flex-row gap-3 p-2 bg-neutral-500/75 rounded-t-md items-center mb-1">
              <p className="font-bold text-3xl">{character}</p>
              <p className="">
                <span className="font-thin">Pinyin:</span> {ToPinyin(character)}{" "}
                <br />
                <span className="font-thin">Meaning:</span>{" "}
                {props.definitionsMini[character] ?? "Not found"}
              </p>
            </div>
            <div className="flex flex-col gap-1 rounded-b-md overflow-clip">
              {primitives[character].map((primitive) => {
                return (
                  <div
                    className="py-1 flex flex-row gap-2 bg-neutral-500/25 items-center"
                    key={"prim_" + primitive.primitive}
                  >
                    <WordContainer
                      className="inline-block text-xl font-semibold"
                      hanzi={primitive.primitive}
                      type="transparent"
                    />
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
      <p className="text-3xl font-bold mb-3">{ToPinyin(currentCharacter)}</p>
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
          <Example
            exampleSentence={dictionary[currentCharacter]!.exampleSentence}
            exampleMeaning={dictionary[currentCharacter]!.exampleMeaning}
            currentCharacter={
              currentCharacter in dictionary ? currentCharacter : undefined
            }
          />
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

function Example(props: {
  exampleSentence: string;
  exampleMeaning: string;
  currentCharacter?: string;
}) {
  const settings = useSelector(selectSettings);
  const [playing, setPlaying] = useState(false);

  const exampleSentence: ReactNode[] = [];

  const words = stringToWordArray(props.exampleSentence);

  if (props.currentCharacter) {
    words.forEach((word, index) => {
      if (/[\u4e00-\u9fff]/.test(word)) {
        exampleSentence.push(
          <WordContainer
            key={"ex_sen_" + word + "_" + index}
            className="inline-block"
            hanzi={word}
            type={
              word.includes(props.currentCharacter!) ? "highlighted" : "basic"
            }
          />
        );
      } else {
        exampleSentence.push(word);
      }
    });
  }

  const speakChinese = () => {
    if (props.exampleSentence) {
      const utterance = new SpeechSynthesisUtterance(props.exampleSentence);
      const voices = window.speechSynthesis.getVoices();
      utterance.rate = 0.75;

      let chineseVoice: SpeechSynthesisVoice | undefined;

      if (settings.ttsVoice) {
        chineseVoice = voices.find((voice) => voice.name == settings.ttsVoice);
      }
      if (!chineseVoice) {
        chineseVoice = voices.find(
          (voice) => voice.lang.includes("zh-CN") || voice.lang.includes("zh")
        );
      }

      // TODO: Refactor from alert to a proper global component
      if (chineseVoice) {
        utterance.voice = chineseVoice;
      } else {
        alert("Chinese voice not available in your browser.");
      }

      utterance.onstart = () => {
        setPlaying(true);
      };

      utterance.onend = () => {
        setPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div>
      <div className="text-xl font-medium capitalize mb-3 text-left">
        {exampleSentence}
      </div>
      <p
        className="font-light mb-1 text-sm"
        style={{ color: "var(--primary)" }}
      >
        MEANING
      </p>
      <p className="text-xl font-medium capitalize mb-3">
        {props.exampleMeaning}
      </p>
      <Button
        className="w-full md:w-auto"
        disabled={playing}
        onClick={speakChinese}
      >
        <FaCirclePlay className="mr-2" /> PLAY
      </Button>
    </div>
  );
}
