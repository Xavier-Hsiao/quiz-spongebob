import styles from "./Question.module.scss";

export default function Question({ question, dispatch, answer }) {
  // The initial state of answer is null so this variable can check if users already done
  const hasBeenAnswered = answer !== null;

  return (
    <div>
      <h4>{question.question}</h4>

      <div className={styles.options}>
        {question.options.map((option, index) => (
          <button
            className={`${styles.btn} ${
              index === answer ? styles.answer : ""
            } ${
              // Double ternary: check hasBeenAnswered first, then check index
              hasBeenAnswered
                ? index === question.correctOption
                  ? styles.correct
                  : styles.wrong
                : ""
            }`}
            key={option}
            onClick={() => dispatch({ type: "newAnswer", payload: index })}
            disabled={hasBeenAnswered}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
