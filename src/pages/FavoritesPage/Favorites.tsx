import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUsersData, selectUsersData } from "@entities/user/model/slice";
import { fetchCities, selectCities } from "@entities/city/model/slice";
import { Card } from "@shared/ui/Card/Card";
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";
import styles from "./favorites.module.scss";
import {
  fetchSkillsData,
  selectSkillsData,
} from "@/entities/skill/model/slice";
import {
  fetchCategories,
  selectCategoryData,
} from "@/entities/category/model/slice";

export const Favorites = () => {
  const { users, isLoading } = useAppSelector(selectUsersData);
  const { categories } = useAppSelector(selectCategoryData);
  const { cities } = useAppSelector(selectCities);
  const { skills } = useAppSelector(selectSkillsData);
  const dispatch = useAppDispatch();

  const likedUsers = useMemo(() => {
    return users.filter((user) => user.isLikedByCurrentUser === true);
  }, [users]);

  useEffect(() => {
    if (users.length === 0) dispatch(fetchUsersData());
    if (categories.length === 0) dispatch(fetchCategories());
    if (cities.length === 0) dispatch(fetchCities());
    if (skills.length === 0) dispatch(fetchSkillsData());
  }, [dispatch, categories.length, cities.length, skills.length, users.length]);

  // Сортируем по дате регистрации (от новых к старым) как приближение даты добавления в избранное
  const sortedLikedUsers = useMemo(() => {
    return [...likedUsers].sort(
      (a, b) =>
        new Date(b.dateOfRegistration).getTime() -
        new Date(a.dateOfRegistration).getTime(),
    );
  }, [likedUsers]);

  if (isLoading) {
    return (
      <>
        <h1 className={styles.title}>Избранное</h1>
        <div className={styles.cardsGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  if (sortedLikedUsers.length === 0) {
    return (
      <>
        <h1 className={styles.title}>Избранное</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>
            Здесь пока пусто. Добавьте карточки в избранное!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Избранное</h1>
      <p className={styles.subtitle}>
        Найдено карточек: {sortedLikedUsers.length}
      </p>
      <div className={styles.cardsGrid}>
        {sortedLikedUsers.map((user) => (
          <Card
            key={user.id}
            user={user}
            cities={cities}
            isLoading={isLoading}
          />
        ))}
      </div>
    </>
  );
};
