import { ReactNode } from "react";

export default function Button(props: {
  color?: "primary" | "secondary";
  onClick?: VoidFunction;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}) {
  const getVarColor = (color: string) => {
    switch (color) {
      default:
      case "primary":
        return "var(--primary)";
      case "secondary":
        return "var(--secondary)";
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        if (props.onClick) {
          props.onClick();
        }
      }}
      style={{
        backgroundColor: props.color
          ? getVarColor(props.color)
          : "var(--primary)",
      }}
      className={
        "h-12 px-3 text-black rounded-md shadow-md active:shadow-none cursor-pointer hover:brightness-105 active:brightness-90 " +
        props.className +
        " " +
        (props.disabled ? "opacity-50 pointer-none" : "")
      }
    >
      {props.children}
    </button>
  );
}
