import styles from "./logo.module.scss";

export const Logo = () => {
  return (
    <div className={styles.logoLinkContainer}>
      <img src="./logo.svg" alt="Логотип сайта SkillSwap" />
      <span className={styles.logoTitle}>SkillSwap</span>
    </div>
  );
};
