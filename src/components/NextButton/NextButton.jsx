import useQuizContext from "../../contexts/useQuizContext";
import styles from "./NextButton.module.scss";

export default function NextButtton() {
  const { state, dispatch, questionsNum } = useQuizContext();
  // Only show next button when there is an answer
  if (state.currAnswer === null) return null;

  return (
    // questionIndex is 0-based
    // Only show next button when question num does not reach to the end
    // Show finish button for the last question
    state.currQuestion + 1 < questionsNum ? (
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
