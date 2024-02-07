import useQuizContext from "../../contexts/useQuizContext";
import styles from "./StartScreen.module.scss";

export default function StartScreen() {
  const {questionsNum, dispatch} = useQuizContext();
  return (
    <div className={styles.start}>
      <h2>歡迎參加海綿寶寶測驗</h2>
      <h3>精選 {questionsNum} 道題目，準備好了嗎孩子們？</h3>
      <button
        className={`${styles.btn} ${styles.btnUi}`}
        onClick={() => dispatch({ type: "start" })}
      >
        是的船長！
      </button>
    </div>
  );
}
