import { ReactNode } from "react";

export default function LabeledValue(props: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="h-12">
      <p className="text-sm font-thin">{props.label}</p>
      <p className="text-2xl font-medium">{props.children}</p>
    </div>
  );
}
