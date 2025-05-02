import { useEffect, useState } from "react";
import { definitions } from "../utils/definitions";
import pinyin from "pinyin";
import { useSelector } from "react-redux";
import { selectCharacters } from "../reducer/main_reducer";
import Button from "../components/button";
import { FaBookOpenReader } from "react-icons/fa6";
import { IoCaretBack } from "react-icons/io5";

function LearnPage() {
  const learnedCharacters = useSelector(selectCharacters);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

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

  return (
    <div className="container mx-auto h-full flex flex-col md:flex-row gap-2">
      <div
        className={
          "mx-auto w-full md:w-1/2 flex-col gap-2 h-full overflow-auto px-2 pb-2 " +
          (currentCategory ? "hidden md:flex" : "flex")
        }
      >
        <p className="text-3xl text-center font-bold bg-stone-800 md:sticky md:top-0">
          CATEGORIES
        </p>
        {Object.keys(categories).map((category) => {
          return (
            <button
              className={
                "p-3 rounded-md text-left shadow-md active:brightness-80 hover:cursor-pointer " +
                (category == currentCategory ? "bg-stone-500" : "bg-stone-700")
              }
              onClick={() => {
                if (currentCategory == category) {
                  setCurrentCategory(null);
                } else {
                  setCurrentCategory(category);
                }
              }}
              key={category}
            >
              <p
                className="text-xl font-bold"
                style={{ color: "var(--primary)" }}
              >
                {category}
              </p>
              <p>{categories[category].length} characters</p>
            </button>
          );
        })}
      </div>
      {currentCategory ? (
        <div className="mx-auto w-full md:w-1/2 flex flex-col gap-2 h-full overflow-auto px-2">
          <p className="text-3xl text-center font-bold bg-stone-800 md:sticky md:top-0">
            WORDS
          </p>
          {(categories[currentCategory]! || []).map((string) => {
            return (
              <div
                className="bg-stone-600 p-2 rounded-md flex justify-center gap-2"
                key={"list_" + string}
              >
                <p
                  className="text-2xl font-bold"
                  style={{ color: "var(--primary)" }}
                >
                  {string}
                </p>
                <p className="text-xl font-bold my-auto">[{pinyin(string)}]</p>
              </div>
            );
          })}
          <div className="flex flex-row gap-2 sticky bottom-0 bg-stone-800 py-2">
            <Button
              className="grow-1 md:hidden"
              basic
              onClick={() => {
                setCurrentCategory(null);
              }}
            >
              <IoCaretBack className="font-bold mr-2" />
              BACK
            </Button>
            <Button className="grow-1">
              <FaBookOpenReader className="font-bold mr-2" />
              STUDY
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default LearnPage;
