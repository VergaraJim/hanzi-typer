import { InputHTMLAttributes, ReactElement, useRef, useState } from "react";
import { MappedCharacter } from "../types";

function HomePage() {
  const [material, setMaterial] = useState("");
  const [mappedList, setMappedList] = useState<Array<MappedCharacter>>();
  const [currentCharacter, setCurrentCharacter] =
    useState<MappedCharacter | null>(null);
  const materialInputRef = useRef<HTMLTextAreaElement>(null);

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
      if (currentCharacter && index == currentCharacter.index) {
        formattedMaterial.push(
          <span className="font-bold p-1 bg-cyan-200 text-black">
            {character}
          </span>
        );
      } else {
        formattedMaterial.push(character);
      }
    });

    return formattedMaterial;
  };

  return (
    <div className="w-full h-full overflow-auto pt-8 px-3 flex">
      {!material ? (
        <div className="my-auto w-full">
          <p className="font-bold text-xl mb-2">MATERIAL:</p>
          <textarea
            ref={materialInputRef}
            className="bg-stone-700 rounded-md w-full p-2 font-medium h-56 mb-2"
            spellCheck="false"
          />
          <button
            onClick={onLockMaterial}
            className="py-2 px-3 w-full bg-cyan-300 text-black font-medium rounded-md active:bg-cyan-400 shadow-md active:shadow-none"
          >
            LOCK
          </button>
        </div>
      ) : (
        <div className="w-full">
          <p className="font-bold text-xl mb-2">MATERIAL:</p>
          <div className="bg-stone-700 rounded-md w-full p-2 font-medium h-56 mb-2 whitespace-break-spaces">
            {getHighlightedMaterial()}
          </div>
          {currentCharacter ? (
            <div className="text-4xl px-4 py-2 bg-stone-700">
              {currentCharacter.character}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default HomePage;
