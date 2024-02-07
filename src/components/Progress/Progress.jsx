import useQuizContext from "../../contexts/useQuizContext";
import styles from "./Progress.module.scss";

export default function Progress() {
  const {state, questionsNum, maxPoints} = useQuizContext();
  return (
    <header className={styles.progress}>
      <progress max={maxPoints} value={state.points}></progress>
      <p>
        答題數：
        <strong>
          {state.currQuestion + 1} / {questionsNum}
        </strong>
      </p>
      <p>
        {state.points} / {maxPoints}
      </p>
    </header>
  );
}
