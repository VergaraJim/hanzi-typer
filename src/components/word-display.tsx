import { useSelector } from "react-redux";
import { selectSettings } from "../reducer/main_reducer";
import { useState } from "react";
import { FaPlay } from "react-icons/fa6";

export default function WordDisplay(props: { word: string }) {
  const settings = useSelector(selectSettings);
  const [playing, setPlaying] = useState(false);

  const speakChinese = () => {
    if (props.word) {
      const utterance = new SpeechSynthesisUtterance(props.word);
      const voices = window.speechSynthesis.getVoices();
      utterance.rate = 0.5;

      let chineseVoice: SpeechSynthesisVoice | undefined;

      if (settings.ttsVoice) {
        chineseVoice = voices.find((voice) => voice.name == settings.ttsVoice);
      }
      if (!chineseVoice) {
        chineseVoice = voices.find(
          (voice) => voice.lang.includes("zh-CN") || voice.lang.includes("zh")
        );
      }

      // TODO: Refactor from alert to a proper global component
      if (chineseVoice) {
        utterance.voice = chineseVoice;
      } else {
        alert("Chinese voice not available in your browser.");
      }

      utterance.onstart = () => {
        setPlaying(true);
      };

      utterance.onend = () => {
        setPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
    }
  };
  return (
    <div
      className={
        "w-full p-3 rounded-md text-center text-7xl font-medium relative cursor-pointer " +
        (playing ? "bg-neutral-600" : "bg-neutral-700")
      }
      onClick={speakChinese}
    >
      {props.word}
      <p className="absolute left-2 top-2 text-xs font-thin">
        <FaPlay className="inline" /> Click to play sound
      </p>
    </div>
  );
}
