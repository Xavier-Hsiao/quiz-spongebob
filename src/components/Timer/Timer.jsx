import { useEffect } from "react";
import styles from "./Timer.module.scss";

export default function Timer({ secondsRemaining, dispatch }) {
  const mins = Math.floor(secondsRemaining / 60);
  const secs = secondsRemaining % 60;
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
