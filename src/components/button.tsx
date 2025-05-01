import { CSSProperties, ReactNode } from "react";

export default function Button(props: {
  color?: "primary" | "secondary";
  basic?: boolean;
  onClick?: VoidFunction;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const getVarColor = (color: string) => {
    switch (color) {
      default:
      case "primary":
        return "--primary";
      case "secondary":
        return "--secondary";
    }
  };

  const isBasic = props.basic;

  let classNames = "";
  let styles: CSSProperties = {};

  if (isBasic) {
    classNames =
      "h-12 min-w-12 px-3 py-1 rounded-lg shadow-md active:shadow-none active:brightness-90 flex justify-center items-center " +
      (props.className || "") +
      " " +
      (props.disabled ? "pointer-events-none opacity-50" : "");

    styles = {
      backgroundColor: "transparent",
      outline:
        "1px solid var(" +
        (props.color ? getVarColor(props.color) : "--primary") +
        ")",
      outlineOffset: "-1px",
      color:
        "var(" + (props.color ? getVarColor(props.color) : "--primary") + ")",
    };
  } else {
    classNames =
      "h-12 min-w-12 px-3 py-1 rounded-lg shadow-md active:shadow-none active:brightness-90 flex justify-center items-center " +
      (props.className || "") +
      " " +
      (props.disabled ? "pointer-events-none opacity-50" : "");

    styles = {
      backgroundColor:
        "var(" + (props.color ? getVarColor(props.color) : "--primary") + ")",
      color: "black",
    };
  }

  return (
    <button
      type="button"
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
      style={styles}
      className={classNames}
    >
      {props.children}
    </button>
  );
}
