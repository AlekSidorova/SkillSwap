import styles from "./mainPage.module.scss";

import { Footer } from "@widgets/Footer/Footer";
import { Filter } from "@widgets/filter/Filter";
import { Header } from "@widgets/Header/Header";
import { UserCardsSection } from "@widgets/UserCardsSection/UserCardsSection";

export const MainPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <Header />

        <main className={styles.main}>
          <aside className={styles.filterContainer}>
            <Filter />
          </aside>
          <section className={styles.galleryContainer}>
            <UserCardsSection />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};
