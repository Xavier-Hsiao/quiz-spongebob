import styles from "./Question.module.scss";

export default function Question({ question }) {
  return (
    <div>
      <h4>{question.question}</h4>

      <div className={styles.options}>
        {question.options.map((option) => (
          <button className={styles.btn} key={option}>
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
