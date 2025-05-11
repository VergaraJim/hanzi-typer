import { CSSProperties, ReactNode, useMemo, useState } from "react";

export default function Dropdown(props: {
  color?: "primary" | "secondary";
  label?: string;
  options?: { [key: string]: string };
  value?: string;
  setValue?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  let classNames =
    "h-12 min-w-12 px-3 py-1 rounded-lg shadow-md active:shadow-none active:brightness-90 flex justify-start items-center " +
    (props.className || "") +
    " " +
    (props.disabled ? "pointer-events-none opacity-50" : "");

  let styles: CSSProperties = {
    backgroundColor: "transparent",
    outline: "1px solid var(--primary)",
    outlineOffset: "-1px",
    color: "var(--primary)",
  };

  const selection = useMemo(() => {
    return (
      <div className="absolute top-full mt-1 rounded-md max-h-96 overflow-auto flex flex-col w-full">
        {props.options &&
          Object.keys(props.options).map((key) => {
            return (
              <button
                key={key}
                onClick={() => {
                  setExpanded(false);
                  if (props.setValue) {
                    props.setValue(key);
                  }
                }}
                className="bg-neutral-600 px-3 py-2 hover:bg-neutral-500 active:bg-neutral-500 cursor-pointer"
              >
                {props.options![key]}
              </button>
            );
          })}
      </div>
    );
  }, [props.options]);

  return (
    <div className="flex flex-col relative">
      <p className="font-bold text-lg mb-1">
        {props.label?.toUpperCase() ?? "DROPDOWN"}
      </p>
      <button
        type="button"
        onClick={() => {
          if (props.options && Object.keys(props.options).length > 0) {
            setExpanded(!expanded);
          }
        }}
        style={styles}
        className={classNames}
      >
        {props.value
          ? props.options
            ? props.options[props.value]
            : props.value
          : "Please select..."}
      </button>
      {expanded ? selection : null}
    </div>
  );
}
