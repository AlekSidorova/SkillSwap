import { useEffect, useMemo } from "react";
import { Card } from "@shared/ui/Card";
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";
import type { TUser, UserWithLikes } from "@/shared/types/types";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { fetchUsersData, selectUsersData } from "@store/slices/usersDataSlice";
import { selectReferenceData } from "@store/slices/referenceDataSlice";
import {
  fetchSkillsData,
  selectSkillsData,
} from "@store/slices/skillsDataSlice";
import styles from "./userCardsSection.module.scss";

export const UserCardsSection = () => {
  const dispatch = useAppDispatch();
  const { users, isLoading: usersLoading } = useAppSelector(selectUsersData);
  const { cities } = useAppSelector(selectReferenceData);
  const {
    skills,
    likes,
    isLoading: skillsLoading,
  } = useAppSelector(selectSkillsData);

  const isLoading = usersLoading || skillsLoading;

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    // Загружаем данные только если они еще не загружены
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsersData());
    }
    if (skills.length === 0 && !skillsLoading) {
      dispatch(fetchSkillsData());
    }
  }, [dispatch, users.length, usersLoading, skills.length, skillsLoading]);

  // Подсчет лайков для каждого пользователя
  const usersWithLikes = useMemo(() => {
    // Создаем Map для подсчета лайков по skillId
    const likesBySkillId = new Map<number, number>();
    likes.forEach((like) => {
      const currentCount = likesBySkillId.get(like.skillId) || 0;
      likesBySkillId.set(like.skillId, currentCount + 1);
    });

    // Подсчитываем общее количество лайков для каждого пользователя
    return users.map((user) => {
      const userSkills = skills.filter((skill) => skill.userId === user.id);
      const likesCount = userSkills.reduce((total, skill) => {
        return total + (likesBySkillId.get(skill.id) || 0);
      }, 0);

      return {
        ...user,
        likesCount,
      } as UserWithLikes;
    });
  }, [users, skills, likes]);

  // Популярные пользователи (по количеству лайков)
  const popularUsers = useMemo(() => {
    return [...usersWithLikes]
      .sort((a, b) => b.likesCount - a.likesCount)
      .slice(0, 6);
  }, [usersWithLikes]);

  // Новые пользователи (по дате регистрации)
  const newUsers = useMemo(() => {
    return [...users]
      .sort(
        (a, b) =>
          new Date(b.dateOfRegistration).getTime() -
          new Date(a.dateOfRegistration).getTime(),
      )
      .slice(0, 6);
  }, [users]);

  // Рекомендуемые пользователи (берем пользователей, которые не входят в популярных и новых)
  const recommendedUsers = useMemo(() => {
    // Исключаем пользователей, которые уже есть в популярных и новых
    const popularIds = new Set(popularUsers.map((u) => u.id));
    const newIds = new Set(newUsers.map((u) => u.id));
    const excludedIds = new Set([...popularIds, ...newIds]);

    const availableUsers = usersWithLikes.filter((u) => !excludedIds.has(u.id));

    // Сортируем по количеству лайков и берем топ-6
    return [...availableUsers]
      .sort((a, b) => b.likesCount - a.likesCount)
      .slice(0, 6);
  }, [usersWithLikes, popularUsers, newUsers]);

  const handleDetailsClick = (user: TUser) => {
    console.log("User details clicked:", user);
    // TODO: Реализовать навигацию к детальной странице пользователя
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        {/* Скелетоны для секции "Популярное" */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Популярное</h2>
          <div className={styles.cardsGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </section>

        {/* Скелетоны для секции "Новое" */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Новое</h2>
          <div className={styles.cardsGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </section>

        {/* Скелетоны для секции "Рекомендуем" */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Рекомендуем</h2>
          <div className={styles.cardsGrid}>
            {Array.from({ length: 6 }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Секция "Популярное" */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Популярное</h2>
        <div className={styles.cardsGrid}>
          {popularUsers.map((user) => (
            <Card
              key={user.id}
              user={user}
              cities={cities}
              onDetailsClick={handleDetailsClick}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      {/* Секция "Новое" */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Новое</h2>
        <div className={styles.cardsGrid}>
          {newUsers.map((user) => (
            <Card
              key={user.id}
              user={user}
              cities={cities}
              onDetailsClick={handleDetailsClick}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>

      {/* Секция "Рекомендуем" */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Рекомендуем</h2>
        <div className={styles.cardsGrid}>
          {recommendedUsers.map((user) => (
            <Card
              key={user.id}
              user={user}
              cities={cities}
              onDetailsClick={handleDetailsClick}
              isLoading={isLoading}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
