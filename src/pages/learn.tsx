import { ReactNode, useEffect, useMemo, useState } from "react";
import { definitions } from "../utils/definitions";
import { useSelector } from "react-redux";
import { selectCharacters } from "../reducer/main_reducer";
import Button from "../components/button";
import { FaBookOpenReader } from "react-icons/fa6";
import { IoCaretBack } from "react-icons/io5";
import Learner from "../components/learner";
import ToPinyin from "../utils/pinyin";

function LearnPage() {
  const learnedCharacters = useSelector(selectCharacters);
  const [previewCategory, setPreviewCategory] = useState<string | null>(null);
  const [isCategoryDone, setCategoryDone] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [categories, setCategories] = useState<{
    [key: string]: Array<string>;
  }>({});

  useEffect(() => {
    const categories: { [key: string]: Array<string> } = {};

    Object.keys(definitions).forEach((characterKey) => {
      const category =
        definitions[characterKey as keyof typeof definitions].category;
      if (!(category in categories)) {
        categories[category] = [characterKey];
      } else {
        categories[category].push(characterKey);
      }
    });

    setCategories(categories);
  }, []);

  const categoryList = useMemo(() => {
    const _categoryList: Array<ReactNode> = [];

    Object.keys(categories).map((category) => {
      let learned = 0;

      categories[category].forEach((character) => {
        if (Object.keys(learnedCharacters).includes(character)) {
          learned += 1;
        }
      });

      _categoryList.push(
        <button
          className={
            "p-3 rounded-md text-left shadow-md active:brightness-80 hover:cursor-pointer " +
            (category == previewCategory ? "bg-neutral-500" : "bg-neutral-700")
          }
          onClick={() => {
            if (previewCategory == category) {
              setPreviewCategory(null);
            } else {
              setPreviewCategory(category);
            }
            setCategoryDone(learned == categories[category].length);
          }}
          key={category}
        >
          <p className="text-xl font-bold" style={{ color: "var(--primary)" }}>
            {category}
          </p>
          <p>
            Characters:{" "}
            <span style={{ color: "var(--primary)" }}>{learned}</span> /{" "}
            {categories[category].length}
          </p>
        </button>
      );
    });

    return _categoryList;
  }, [previewCategory, categories, learnedCharacters]);

  const wordsList = useMemo(() => {
    const _wordsList: Array<ReactNode> = [];

    if (previewCategory) {
      (categories[previewCategory]! || []).map((string) => {
        _wordsList.push(
          <div
            className={
              "bg-neutral-600 p-2 rounded-md flex justify-center gap-2 " +
              (Object.keys(learnedCharacters).includes(string)
                ? "bg-neutral-500"
                : "opacity-50")
            }
            key={"list_" + string}
          >
            <p
              className="text-2xl font-bold"
              style={{ color: "var(--primary)" }}
            >
              {string}
            </p>
            <p className="text-xl font-bold my-auto">[{ToPinyin(string)}]</p>
          </div>
        );
      });
    }

    return _wordsList;
  }, [previewCategory]);

  return (
    <div className="container mx-auto h-full flex flex-col md:flex-row gap-2">
      {selectedCategory == null ? (
        <>
          <div
            className={
              "mx-auto w-full md:w-1/2 flex-col gap-2 h-full overflow-auto px-2 pb-2 " +
              (previewCategory ? "hidden md:flex" : "flex")
            }
          >
            <p className="text-3xl text-center font-bold bg-neutral-800 md:sticky md:top-0">
              CATEGORIES
            </p>
            {categoryList}
          </div>
          {previewCategory ? (
            <div className="mx-auto w-full md:w-1/2 flex flex-col gap-2 h-full overflow-auto px-2">
              <p className="text-3xl text-center font-bold bg-neutral-800 md:sticky md:top-0 z-10">
                WORDS
              </p>
              {wordsList}
              <div className="flex flex-row gap-2 sticky bottom-0 bg-neutral-800 py-2">
                <Button
                  className="grow-1 md:hidden"
                  basic
                  onClick={() => {
                    setPreviewCategory(null);
                  }}
                >
                  <IoCaretBack className="font-bold mr-2" />
                  BACK
                </Button>
                <Button
                  className="grow-1"
                  onClick={() => {
                    setSelectedCategory(previewCategory);
                  }}
                  disabled={isCategoryDone}
                >
                  <FaBookOpenReader className="font-bold mr-2" />
                  STUDY
                </Button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <Learner
          category={selectedCategory}
          learnedCharacters={learnedCharacters}
          wordsList={categories[selectedCategory]}
        />
      )}
    </div>
  );
}

export default LearnPage;
