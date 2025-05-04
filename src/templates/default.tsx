import { ReactNode } from "react";
import Button from "../components/button";
import { IoCaretBack } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

function DefaultTemplate(props: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="w-dvw h-dvh bg-stone-800 text-stone-100 overflow-auto flex flex-col">
      <div className="bg-stone-700 shadow-md flex rounded-b-xl">
        <div className="h-18 px-3 flex flex-grow items-center container mx-auto">
          {location.key !== "default" ? (
            <Button
              basic
              className="px-4 my-auto"
              onClick={() => {
                navigate(-1);
              }}
            >
              <IoCaretBack />
            </Button>
          ) : null}
          <div className="ml-auto text-end">
            <h2 className="font-extrabold text-2xl">
              HANZI<span style={{ color: "var(--primary)" }}>TYPER</span>
            </h2>
            <h3 className="font-medium text-xs">BETA 0.1.2</h3>
          </div>
        </div>
      </div>
      <div className="p-3 flex-grow overflow-auto">{props.children}</div>
    </div>
  );
}

export default DefaultTemplate;
