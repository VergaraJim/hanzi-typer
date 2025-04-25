// src/hooks/useRedirectHistory.js
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

export interface HistoryEntry {
  from: string;
  to: string;
  method: "PUSH" | "REPLACE" | "POP";
  timestamp: string;
}

function useHistory() {
  const location = useLocation();
  const navigationType = useNavigationType();

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const prevLocation = useRef<string>(null);

  useEffect(() => {
    if (navigationType === "PUSH" || navigationType === "REPLACE") {
      if (prevLocation.current !== null) {
        setHistory((prev) => {
          const tempHistory = [...prev];
          tempHistory.push({
            from: prevLocation.current!,
            to: location.pathname,
            method: navigationType,
            timestamp: new Date().toISOString(),
          });

          return tempHistory;
        });
      }
      prevLocation.current = location.pathname;
    }
  }, [location, navigationType]);

  return history;
}

export default useHistory;
