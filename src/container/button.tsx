import { ReactNode } from "react";

export default function Button(props: {
  onClick?: VoidFunction;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={(event) => {
        if (props.onClick) {
          props.onClick();
        }
      }}
      className={
        "py-2 px-3 bg-cyan-300 text-black font-medium rounded-md active:bg-cyan-400 shadow-md active:shadow-none " +
        props.className
      }
    >
      {props.children}
    </button>
  );
}
