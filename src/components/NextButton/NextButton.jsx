import styles from "./NextButton.module.scss";

export default function NextButtton({
  dispatch,
  answer,
  questionIndex,
  questionsNum,
}) {
  // Only show next button when there is an answer
  if (answer === null) return null;

  return (
    // questionIndex is 0-based
    // Only show next button when question num does not reach to the end
    // Show finish button for the last question
    questionIndex + 1 < questionsNum ? (
      <button
        className={styles.btn}
        onClick={() => dispatch({ type: "nextQuestion" })}
      >
        下一題
      </button>
    ) : (
      <button
        className={styles.btn}
        onClick={() => dispatch({ type: "finished" })}
      >
        結束測驗
      </button>
    )
  );
}
