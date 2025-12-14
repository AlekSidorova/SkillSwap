import styles from "./exchangesPage.module.scss";
import { SidebarMenu } from "../ProfilePage/SidebarMenu";
import { Exchanges } from "./Exchanges";

export const ExchangesPage = () => {
  return (
    <div className={styles.wrapper}>
      <SidebarMenu />
      <div className={styles.content}>
        <div className={styles.exchangesContainer}>
          <Exchanges />
        </div>
      </div>
    </div>
  );
};
