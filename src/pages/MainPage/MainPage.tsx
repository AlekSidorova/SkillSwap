import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./mainPage.module.scss";

import { Footer } from "@widgets/Footer/Footer";
import { Filter } from "@widgets/Filter/Filter";
import { Header } from "@widgets/Header/Header";
import { UserCardsSection } from "@widgets/UserCardsSection/UserCardsSection";
import type { TFilterState } from "@features/filter-users/types";
import { useAppSelector } from "@app/store/hooks";
import { selectCategoryData } from "@entities/category/model/slice";

export const MainPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<TFilterState>({
    purpose: "",
    skills: [],
    gender: "",
    cityAll: [],
  });

  const { subcategories } = useAppSelector(selectCategoryData);

  // Обрабатываем поисковый запрос из URL
  useEffect(() => {
    const searchQuery = searchParams.get("q");
    if (searchQuery) {
      // Ищем подкатегории, которые содержат поисковый запрос (регистронезависимый поиск)
      const searchLower = searchQuery.toLowerCase();
      const matchingSubcategories = subcategories
        .filter((sub) => sub.name.toLowerCase().includes(searchLower))
        .map((sub) => sub.id);

      // Обновляем фильтры, добавляя найденные подкатегории
      setFilters((prev) => ({
        ...prev,
        skills: matchingSubcategories,
      }));
    }
  }, [searchParams, subcategories]);

  // Функция для очистки параметра q из URL
  const clearSearchQuery = () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("q");
    setSearchParams(newSearchParams);
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageContainer}>
        <Header />

        <main className={styles.main}>
          <aside className={styles.filterContainer}>
            <Filter
              filters={filters}
              onFiltersChange={setFilters}
              onClearSearchQuery={clearSearchQuery}
            />
          </aside>
          <section className={styles.galleryContainer}>
            <UserCardsSection filters={filters} onFiltersChange={setFilters} />
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};
