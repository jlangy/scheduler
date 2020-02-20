import { useState } from "react";

export default function useVisualMode(initialMode){
  const [mode, setMode] = useState(initialMode);
  const [history, setHistory] = useState([initialMode]);

  const transition = (newMode, replace=false) => {
    setMode(newMode)
    if(replace){
      setHistory(prevHistory => [...prevHistory.slice(0, prevHistory.length - 1), newMode]);
    } else {
      setHistory(prevHistory => [...prevHistory, newMode]);
    }
  };
  const back = () => {
    if(history.length > 1){
      setMode(history[history.length - 2]);
      setHistory(history.slice(0, history.length - 1));
    }
  };
  return { mode, transition, back };
}
