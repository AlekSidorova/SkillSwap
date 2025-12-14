import { useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { fetchUsersData, selectUsersData } from "@entities/user/model/slice";
import { selectCities, fetchCities } from "@entities/city/model/slice";
import { fetchSkillsData, selectSkillsData } from "@entities/skill/model/slice";
import {
  fetchCategories,
  selectCategoryData,
} from "@entities/category/model/slice";
import { Card } from "@shared/ui/Card/Card";
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";
import { useExchanges } from "@shared/hooks/useExchanges";
import type { UserWithLikes } from "@entities/user/types";
import styles from "./exchangesPage.module.scss";

const CURRENT_USER_ID = "user-1";

export const Exchanges = () => {
  const dispatch = useAppDispatch();

  const { users, isLoading } = useAppSelector(selectUsersData);
  const { cities, isLoading: citiesLoading } = useAppSelector(selectCities);
  const { skills, isLoading: skillsLoading } = useAppSelector(selectSkillsData);
  const { subcategories, isLoading: subcategoriesLoading } =
    useAppSelector(selectCategoryData);

  const { activeExchanges, finishExchange, resumeExchange, acceptExchange } =
    useExchanges(CURRENT_USER_ID);

  // Загружаем данные при монтировании
  useEffect(() => {
    if (users.length === 0 && !isLoading) dispatch(fetchUsersData());
    if (cities.length === 0 && !citiesLoading) dispatch(fetchCities());
    if (skills.length === 0 && !skillsLoading) dispatch(fetchSkillsData());
    if (subcategories.length === 0 && !subcategoriesLoading)
      dispatch(fetchCategories());
  }, [
    dispatch,
    users.length,
    isLoading,
    cities.length,
    citiesLoading,
    skills.length,
    skillsLoading,
    subcategories.length,
    subcategoriesLoading,
  ]);

  // Формируем список пользователей с активными обменами
  const usersWithExchanges = useMemo(() => {
    return activeExchanges
      .map((ex) => {
        const otherUserId =
          ex.fromUserId === CURRENT_USER_ID ? ex.toUserId : ex.fromUserId;

        const otherUserIdNum = parseInt(otherUserId.replace("user-", ""), 10);

        const user = users.find((u) => u.id === otherUserIdNum);
        if (!user) return null;

        return {
          ...user,
          exchangeId: ex.id,
          exchangeStatus: ex.status,
          offerTitle: ex.offerTitle,
        } as UserWithLikes & {
          exchangeId: string;
          exchangeStatus: string;
          offerTitle: string;
        };
      })
      .filter(
        (
          u,
        ): u is UserWithLikes & {
          exchangeId: string;
          exchangeStatus: string;
          offerTitle: string;
        } => Boolean(u),
      );
  }, [activeExchanges, users]);

  const handleAction = (exchangeId: string, status: string) => {
    if (status === "pending")
      acceptExchange(exchangeId); // Принять
    else if (status === "accepted")
      finishExchange(exchangeId); // Завершить
    else if (status === "completed") resumeExchange(exchangeId); // Возобновить
  };

  if (isLoading || citiesLoading || skillsLoading || subcategoriesLoading) {
    return (
      <>
        <h1 className={styles.title}>Мои обмены</h1>
        <div className={styles.cardsGrid}>
          {Array.from({ length: 6 }).map((_, index) => (
            <CardSkeleton key={index} />
          ))}
        </div>
      </>
    );
  }

  if (usersWithExchanges.length === 0) {
    return (
      <>
        <h1 className={styles.title}>Мои обмены</h1>
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>У вас пока нет активных обменов</p>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className={styles.title}>Мои обмены</h1>
      <p className={styles.subtitle}>
        Активных обменов: {usersWithExchanges.length}
      </p>
      <div className={styles.cardsGrid}>
        {usersWithExchanges.map((user) => {
          // Выбираем текст для кнопки в зависимости от статуса обмена
          let buttonText = "";
          if (user.exchangeStatus === "pending") buttonText = "Принять";
          else if (user.exchangeStatus === "accepted") buttonText = "Завершить";
          else if (user.exchangeStatus === "completed")
            buttonText = "Возобновить";

          return (
            <Card
              key={user.id}
              user={user}
              cities={cities}
              description={user.offerTitle}
              onDetailsClick={() =>
                handleAction(user.exchangeId, user.exchangeStatus)
              }
            />
          );
        })}
      </div>
    </>
  );
};
