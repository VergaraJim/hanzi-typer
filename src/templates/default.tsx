import { PropsWithChildren, ReactNode } from "react";
import { HistoryEntry } from "../hooks/use-history";

function DefaultTemplate(props: {
  history: HistoryEntry[];
  children: ReactNode;
}) {
  console.log(props.history);
  return (
    <div className="w-dvw h-dvh bg-stone-800 text-stone-100 overflow-auto flex flex-col">
      <div className="p-3 bg-stone-700 shadow-md flex">
        <div className="flex flex-grow text-center">
          <h2 className="font-extrabold text-2xl mx-auto">
            HANZI<span style={{ color: "var(--primary)" }}>TYPER</span>
          </h2>
        </div>
      </div>
      <div className="p-3 flex-grow overflow-auto">{props.children}</div>
    </div>
  );
}

export default DefaultTemplate;
