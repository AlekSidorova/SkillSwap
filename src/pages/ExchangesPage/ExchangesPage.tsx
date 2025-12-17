import styles from "./exchangesPage.module.scss";
import { Exchanges } from "./Exchanges";

export const ExchangesPage = () => {
  return (
    <div className={styles.content}>
      <div className={styles.exchangesContainer}>
        <Exchanges />
      </div>
    </div>
  );
};
