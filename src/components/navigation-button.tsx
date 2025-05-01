import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

export default function NavigationButton(props: {
  children: ReactNode;
  label: string;
  link?: string;
  className?: string;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (props.link) {
      navigate(props.link);
    }
  };

  return (
    <div
      className="p-2 md:p-3 lg:p-4 xl:p-5 max-w-1/2 w-64 hover:scale-105 active:scale-105 cursor-pointer transition-all hover:brightness-105"
      onClick={handleClick}
    >
      <div
        className={
          "w-full aspect-square p-3 bg-stone-700 rounded-md shadow-2xl relative " +
          (props.className ?? "")
        }
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {props.children}
        </div>
      </div>
      <p className="text-center pt-2 font-bold text-xl">{props.label}</p>
    </div>
  );
}
