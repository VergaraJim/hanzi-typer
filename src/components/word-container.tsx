import ToPinyin from "../utils/pinyin";

export type WordContainerTypes =
  | "basic"
  | "highlighted"
  | "transparent"
  | "none"
  | "wrong"
  | "typing";

export default function WordContainer(
  props: React.InputHTMLAttributes<HTMLDivElement> & {
    hanzi: string;
    type?: WordContainerTypes;
    guessing?: boolean;
  }
) {
  let className =
    "mx-1 h-16 p-1 rounded-md text-center " + (props.className ?? "");
  const style: React.CSSProperties = props.style ?? {};

  switch (props.type) {
    case "typing":
      className += " bg-cyan-200 text-black";
      break;
    case "wrong":
      className += " bg-red-400 text-white";
      break;
    case "highlighted":
      className += " text-black";
      style["backgroundColor"] = "var(--primary)";
      break;
    case "transparent":
      className += " bg-transparent";
      break;
    default:
    case "basic":
      className += " bg-neutral-500";
      break;
  }

  let subtext = ToPinyin(props.hanzi);

  if (props.guessing) {
    subtext = subtext
      .split("")
      .map(() => "_")
      .join("");
  }

  return (
    <div {...props} className={className} style={style}>
      <p className="mx-auto">{props.hanzi}</p>
      <p className="text-sm font-medium">{subtext}</p>
    </div>
  );
}
