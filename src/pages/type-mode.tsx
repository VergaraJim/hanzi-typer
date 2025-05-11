import { useEffect, useMemo, useRef, useState } from "react";
import Button from "../components/button";
import { FaICursor } from "react-icons/fa";
import {
  saveTypeData,
  selectCharacters,
  selectIsLoading,
} from "../reducer/main_reducer";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "../components/text-area";
import LabeledValue from "../components/labeled-value";
import Transcripter from "../components/transcripter";
import { TranscriptedWord } from "../types";
import { useNavigate } from "react-router-dom";

function TypeModePage() {
  const isLoading = useSelector(selectIsLoading);
  const characters = useSelector(selectCharacters);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [material, setMaterial] = useState("");
  const [materialValue, setMaterialValue] = useState<string>("");

  // Locks the text the user has inserted and generates the needed variables
  const onLockMaterial = () => {
    if (materialValue) {
      setMaterial(materialValue);
    }
  };

  // If isLoading goes from true to false, that means we saved, so redirect to home.
  const wasLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (!isLoading && wasLoadingRef.current) {
      navigate("/");
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  const countTotalCharacters = useMemo<number>(() => {
    const chineseCharacters: Array<string> =
      materialValue.match(/[\u4e00-\u9fff]/g) || [];

    return chineseCharacters.length;
  }, [materialValue]);

  const countNewCharacters = useMemo<number>(() => {
    const chineseCharacters: Array<string> =
      materialValue.match(/[\u4e00-\u9fff]/g) || [];

    let newCharacters: Array<string> = [];

    chineseCharacters.forEach((character) => {
      if (
        !Object.keys(characters).includes(character) &&
        !newCharacters.includes(character)
      ) {
        newCharacters.push(character);
      }
    });

    return newCharacters.length;
  }, [materialValue]);

  return (
    <div className="w-full min-h-full flex">
      {!material ? (
        <div className="container min-h-full mx-auto flex flex-col">
          <div className="min-h-full md:h-auto flex flex-col md:flex-row justify-center bg-neutral-700 p-3 rounded-md shadow-md gap-3 flex-wrap md:flex-nowrap">
            <div className="w-full md:w-2/3 flex flex-col flex-grow">
              <p className="font-bold text-sm mb-2">
                Paste what you want to type below
              </p>
              <TextArea
                value={materialValue}
                onChange={(event) => {
                  setMaterialValue(event.target.value);
                }}
                className="bg-neutral-800 rounded-md w-full font-medium flex-grow min-h-56 md:min-h-100 h-auto resize-none"
                spellCheck="false"
              />
            </div>
            <div className="w-full md:w-1/3 flex flex-col">
              <div className="bg-neutral-600 p-2 rounded-md mb-3 shadow-md">
                <LabeledValue label="Total characters">
                  <span style={{ color: "var(--primary)" }}>
                    {countTotalCharacters}
                  </span>
                </LabeledValue>
              </div>
              <div className="bg-neutral-600 p-2 rounded-md mb-3 shadow-md">
                <LabeledValue label="New characters">
                  <span style={{ color: "var(--primary)" }}>
                    {countNewCharacters}
                  </span>
                </LabeledValue>
              </div>
              <div className="flex-grow"></div>
              <Button
                disabled={countTotalCharacters <= 0}
                onClick={onLockMaterial}
                className="w-full font-medium"
              >
                <div className="flex m-auto justify-center items-center gap-2">
                  <FaICursor /> START TYPING
                </div>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Transcripter
          material={material}
          onSave={(transcript: Array<TranscriptedWord>) => {
            dispatch(saveTypeData(transcript));
          }}
        />
      )}
    </div>
  );
}

export default TypeModePage;
