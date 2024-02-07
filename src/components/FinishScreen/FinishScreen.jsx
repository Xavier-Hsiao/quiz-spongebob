import useQuizContext from "../../contexts/useQuizContext";
import styles from "./FinishScreen.module.scss";

export default function FinishScreen() {
  const {state, maxPoints, dispatch} = useQuizContext();
  const percentage = (state.points / maxPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🥇";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 50 && percentage < 80) emoji = "🙃";
  if (percentage >= 0 && percentage < 50) emoji = "🤨";
  if (percentage === 0) emoji = "🤦‍♂️";

  return (
    <>
      <p className={styles.result}>
        {emoji} 總共 {maxPoints} 分你得到了 {state.points} 分 ({Math.ceil(percentage)}
        %)
      </p>
      <p className={styles.highScore}>你的最高分紀錄：{state.highScore}</p>
      <button
        className={styles.btn}
        onClick={() => dispatch({ type: "reset" })}
      >重新開始</button>
    </>
  );
}
