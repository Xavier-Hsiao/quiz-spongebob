import styles from "./Header.module.scss";

export default function Header() {
  return (
    <header className={styles.header}>
      <img
        src="src\assets\Spongebob_Squarepants-logo-FAC95E82E1-seeklogo.com.png"
        alt="spongebob-logo"
      />
      <h1>海綿寶寶測驗</h1>
    </header>
  );
}
