import { CSSProperties } from "react";

export default function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  let styles: CSSProperties = {};

  return (
    <input
      type="text"
      style={styles}
      onChange={props.onChange}
      className={
        "h-12 min-w-12 bg-stone-800 rounded-lg text-white font-medium px-3 focus:outline-stone-400 focus:outline-2 inset-shadow-md " +
        (props.className || "")
      }
      value={props.value}
    />
  );
}
