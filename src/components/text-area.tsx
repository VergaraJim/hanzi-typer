import { CSSProperties } from "react";

export default function TextArea(
  props: React.InputHTMLAttributes<HTMLTextAreaElement>
) {
  let styles: CSSProperties = {};

  return (
    <textarea
      style={styles}
      onChange={props.onChange}
      className={
        "min-h-24 min-w-12 bg-neutral-800 rounded-lg text-white font-medium p-3 focus:outline-neutral-400 focus:outline-2 inset-shadow-md " +
        (props.className || "")
      }
    />
  );
}
