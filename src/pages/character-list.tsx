import { MdSort } from "react-icons/md";
import Button from "../components/button";
import { useSelector } from "react-redux";
import { selectCharacters } from "../reducer/main_reducer";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { CompareDate } from "../utils/compare_date";

function CharacterListPage() {
  const characters = useSelector(selectCharacters);
  const [sortBy, setSortBy] = useState("reviewDate");

  const characterList = useMemo(() => {
    const characterRows: ReactNode[] = [];

    if (Object.keys(characters).length > 0) {
      Object.keys(characters).forEach((character) => {
        const characterData = characters[character as keyof typeof characters]!;
        const reviewDate = new Date(characterData.reviewDate);
        const reviewCountdown = CompareDate(new Date(), reviewDate);

        let reviewMessage = "Unknown";

        if (reviewCountdown.totalSeconds == 0) {
          reviewMessage = "NOW!";
        } else if (reviewCountdown.days > 0) {
          reviewMessage = "In " + reviewCountdown.days + " days";
        } else if (reviewCountdown.hours > 0) {
          reviewMessage = "In " + reviewCountdown.hours + " hours";
        } else if (reviewCountdown.minutes > 0) {
          reviewMessage = "In " + reviewCountdown.minutes + " minutes";
        }

        characterRows.push(
          <div
            className="p-3 bg-stone-600 my-px flex"
            key={"character_" + character}
          >
            <div className="p-2 text-3xl bg-stone-300 rounded-md text-black font-bold my-auto">
              {character}
            </div>
            <div className="px-2 flex flex-row flex-grow">
              <div>
                <p className="font-medium" style={{ color: "var(--primary)" }}>
                  REVIEW BY
                </p>
                <p>{reviewMessage}</p>
              </div>
              <div className="flex-grow text-end">
                <p className="font-medium" style={{ color: "var(--primary)" }}>
                  STATS
                </p>
                <p>
                  {characterData.correct} / {characterData.tries} (
                  {(
                    (100.0 / characterData.tries) *
                    characterData.correct
                  ).toFixed()}
                  %)
                </p>
              </div>
            </div>
          </div>
        );
      });
    } else {
      characterRows.push(
        <div className="p-3 bg-stone-600 my-px flex text-center">
          <p className="mx-auto font-medium">No Characters yet</p>
        </div>
      );
    }

    return <>{characterRows}</>;
  }, [characters]);

  return (
    // TODO: Add searchbar
    // TODO: Add sorting?
    <div>
      <div className="bg-stone-700 p-3 rounded-t-md flex justify-end">
        {/*<Button className="flex items-center gap-3">
          <MdSort />
          SORT
        </Button> */}
      </div>
      {characterList}
      <div className="bg-stone-700 p-3 rounded-b-md flex justify-end"></div>
    </div>
  );
}

export default CharacterListPage;
