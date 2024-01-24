import styles from "./Error.module.scss";

export default function Error() {
  return (
    <div className={styles.error}>
      <span>💣</span> 讀取問題發生錯誤！
    </div>
  );
}
