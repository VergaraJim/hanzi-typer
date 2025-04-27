import { FaBookOpenReader } from "react-icons/fa6";
import NavigationButton from "../components/navigation-button";
import { FaSyncAlt } from "react-icons/fa";
import { MdBorderColor } from "react-icons/md";

function HomePage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-wrap">
        <NavigationButton className="w-1/2" label="REVIEW" link="/review">
          <FaSyncAlt
            className="text-6xl lg:text-8xl font-bold"
            style={{ color: "var(--primary)" }}
          />
        </NavigationButton>
        <NavigationButton className="w-1/2" label="LEARN" link="/">
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
