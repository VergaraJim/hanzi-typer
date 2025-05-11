import { useEffect, useMemo, useRef, useState } from "react";
import Dropdown from "../components/dropdown";
import { SettingsData } from "../types";
import Button from "../components/button";
import { useDispatch, useSelector } from "react-redux";
import {
  saveSettings,
  selectIsLoading,
  selectSettings,
} from "../reducer/main_reducer";
import { useNavigate } from "react-router-dom";

function SettingsPage(props: {}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentSettings = useSelector(selectSettings);
  const isLoading = useSelector(selectIsLoading);

  const [settings, setSettings] = useState<SettingsData>({});
  const [options, setOptions] = useState<{ [key: string]: string }>({});

  const tryLoadingLanguages = async () => {
    await new Promise((r) => setTimeout(r, 100));
    const _options: { [key: string]: string } = {};
    window.speechSynthesis.getVoices().forEach((v) => {
      _options[v.name] = v.name;
    });
    setOptions(_options);
    if (Object.keys(_options).length == 0) {
      tryLoadingLanguages();
    } else {
      setOptions(_options);
    }
  };

  const handleSave = () => {
    dispatch(saveSettings(settings));
  };

  useEffect(() => {
    setSettings(currentSettings);
  }, [currentSettings]);

  useEffect(() => {
    // try loading the language list until you have something
    tryLoadingLanguages();
  }, []);

  // If isLoading goes from true to false, that means we saved, so redirect to home.
  const wasLoadingRef = useRef(isLoading);
  useEffect(() => {
    if (!isLoading && wasLoadingRef.current) {
      window.location.replace("/");
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading]);

  return (
    <div className="container mx-auto h-full flex flex-col md:flex-row gap-2">
      <div
        style={{ maxWidth: "500px" }}
        className={
          "mx-auto w-full flex-col gap-2 h-full overflow-auto px-2 pb-2"
        }
      >
        <p className="text-3xl text-center font-bold md:sticky md:top-0">
          CATEGORIES
        </p>
        <Dropdown
          label="Voice"
          options={options}
          value={settings.ttsVoice}
          setValue={(value) => {
            setSettings({ ...settings, ttsVoice: value });
          }}
        />
        <Button
          className="mt-5 w-full"
          disabled={isLoading}
          onClick={handleSave}
        >
          SAVE
        </Button>
      </div>
    </div>
  );
}

export default SettingsPage;
