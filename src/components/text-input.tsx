import { CSSProperties } from "react";

export default function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  let styles: CSSProperties = {};

  return (
    <input
      {...props}
      type="text"
      style={styles}
      onChange={props.onChange}
      className={
        "h-12 min-w-12 bg-neutral-800 rounded-lg text-white font-medium px-3 focus:outline-neutral-400 focus:outline-2 inset-shadow-md " +
        (props.className || "")
      }
      value={props.value}
    />
  );
}
