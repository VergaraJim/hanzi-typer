import { FaBookOpenReader } from "react-icons/fa6";
import NavigationButton from "../components/navigation-button";
import { FaSyncAlt } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";
import { useSelector } from "react-redux";
import { selectDailyStats } from "../reducer/main_reducer";
import { ReactNode, useMemo } from "react";
import { Stats } from "../types";
import { Bar } from "react-chartjs-2";
import { DailyStatsChart } from "../components/daily-stats-chart";
import LabeledValue from "../components/labeled-value";
import { formatDateManual } from "../utils/functions";

function HomePage() {
  const dailyStats = useSelector(selectDailyStats);

  const statsView = useMemo(() => {
    const today = dailyStats[new Date().toDateString()] || {
      learned: 0,
      reviewed: 0,
    };

    const labels: Array<string> = [];
    const learned: Array<number> = [];
    const reviewed: Array<number> = [];

    for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
      const date = new Date(
        new Date().setDate(new Date().getDate() - dayOffset)
      );
      labels.push(formatDateManual(date));
      if (dailyStats[date.toDateString()]) {
        learned.push(dailyStats[date.toDateString()].learned);
        reviewed.push(dailyStats[date.toDateString()].reviewed);
      } else {
        learned.push(0);
        reviewed.push(0);
      }
    }

    return (
      <div className="flex flex-col">
        <DailyStatsChart
          labels={labels.reverse()}
          learned={learned.reverse()}
          reviewed={reviewed.reverse()}
        />
        <p
          className="mt-4 mb-2 text-center text-xl font-bold"
          style={{ color: "var(--primary)" }}
        >
          TODAY
        </p>
        <div className="flex flex-row gap-2 p-2 bg-stone-600 rounded-md">
          <div className="grow">
            <LabeledValue label="LEARNED">{today.learned}</LabeledValue>
          </div>
          <div className="grow">
            <LabeledValue label="REVIEWED">{today.reviewed}</LabeledValue>
          </div>
        </div>
      </div>
    );
  }, [dailyStats]);

  return (
    <div className="container mx-auto flex flex-col md:flex-row">
      <div className="w-full md:w-1/2 md:mb-auto md:p-3 lg:p-5">
        <div className="bg-stone-700 rounded-md p-3 mb-3">{statsView}</div>
      </div>
      <div className="w-full md:w-1/2 flex flex-wrap m-auto">
        <NavigationButton className="w-1/2" label="REVIEW" link="/review">
          <FaSyncAlt
            className="text-6xl lg:text-8xl font-bold"
            style={{ color: "var(--primary)" }}
          />
        </NavigationButton>
        <NavigationButton className="w-1/2" label="LEARN" link="/learn">
          <FaBookOpenReader
            className="text-6xl lg:text-8xl font-bold"
            style={{ color: "var(--primary)" }}
          />
        </NavigationButton>
        <NavigationButton
          className="w-1/2"
          label="CHARACTERS"
          link="/character-list"
        >
          <p
            className="text-6xl lg:text-8xl font-bold"
            style={{ color: "var(--primary)" }}
          >
            字
          </p>
        </NavigationButton>
        <NavigationButton
          className="w-1/2"
          label="START TYPING"
          link="/type-mode"
        >
          <MdBorderColor
            className="text-6xl lg:text-8xl font-bold"
            style={{ color: "var(--primary)" }}
          />
        </NavigationButton>
      </div>
    </div>
  );
}

export default HomePage;
