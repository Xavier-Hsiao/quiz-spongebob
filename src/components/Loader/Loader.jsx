import styles from "./Loader.module.scss";

export default function Loader() {
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.loader}></div>
      <p>題目準備中......</p>
    </div>
  )
}