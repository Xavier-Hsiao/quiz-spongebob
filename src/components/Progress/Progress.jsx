import styles from "./Progress.module.scss";

export default function Progress({
  questionIndex,
  questionsNum,
  points,
  maxPoints,
}) {
  return (
    <header className={styles.progress}>
      <progress max={maxPoints} value={points}></progress>
      <p>
        答題數：
        <strong>
          {questionIndex + 1} / {questionsNum}
        </strong>
      </p>
      <p>
        {points} / {maxPoints}
      </p>
    </header>
  );
}
