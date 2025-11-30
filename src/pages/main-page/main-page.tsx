import styles from "./main-page.module.scss";
import { Header } from "@widgets/header/header.tsx";
import { Footer } from "@widgets/footer/footer.tsx";

export const MainPage = () => {
  return (
    <div className={styles.mainPage}>
      <Header />
      <main className={styles.main}>
        <aside className={styles.filterContainer}>
          Секция для фильтров категорий
        </aside>
        <section className={styles.galleryContainer}>
          Секция для галереи карточек пользователей
        </section>
      </main>
      <Footer />
    </div>
  );
};
