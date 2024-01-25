import styles from "./NextButton.module.scss";

export default function NextButtton({ dispatch, answer }) {
  // Only show next button when there is an answer
  if (answer === null) return null;

  return (
    <button
      className={styles.btn}
      onClick={() => dispatch({ type: "nextQuestion" })}
    >
      下一題
    </button>
  );
}
