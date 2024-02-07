import { useEffect } from "react";
import styles from "./Timer.module.scss";
import useQuizContext from "../../contexts/useQuizContext";

export default function Timer() {
  const {state, dispatch} = useQuizContext();
  const mins = Math.floor(state.secondsRemaining / 60);
  const secs = state.secondsRemaining % 60;
  // Handle side effect: start running countdown right after Timer was mounted
  useEffect(() => {
    const interval = setInterval(() => {
      // Dispatch countdown action to the reducer
      dispatch({ type: "countdown" });
    }, 1000);
    // Clean up interval
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div className={styles.timer}>
      {mins}:{secs}
    </div>
  );
}
