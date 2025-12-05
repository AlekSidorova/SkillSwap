import React, { useState, useEffect } from "react";
import { Card } from "@shared/ui/Card/Card";
import { CardSkeleton } from "@shared/ui/CardSkeleton/CardSkeleton";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { selectCities } from "@entities/city/model/slice";
import { fetchUsersData, selectUsersData } from "@entities/user/model/slice";
import styles from "./similiarProposals.module.scss";
import leftArrow from "@images/icons/chevron-right.svg";
import rightArrow from "@images/icons/chevron-right.svg";

// Компонент SimiliarProposals отображает слайдер с карточками пользователей.
// Принимает опциональные пропсы cardsPerSlide (количество карточек на слайде) и maxUsers (максимальное количество пользователей).
// При клике на стрелки происходит навигация между слайдами, стрелки отключаются на крайних позициях.

interface SimiliarProposalsProps {
  cardsPerSlide?: number;
  maxUsers?: number;
}

export const SimiliarProposals: React.FC<SimiliarProposalsProps> = ({
  cardsPerSlide = 4,
  maxUsers = 12,
}) => {
  const dispatch = useAppDispatch();
  const [currentSlide, setCurrentSlide] = useState(0);

  const { users, isLoading: usersLoading } = useAppSelector(selectUsersData);
  const { cities } = useAppSelector(selectCities);

  // Загрузка пользователей
  useEffect(() => {
    if (users.length === 0 && !usersLoading) {
      dispatch(fetchUsersData());
    }
  }, [dispatch, users.length, usersLoading]);

  const displayUsers = users.slice(0, maxUsers);

  // Количество слайдов
  const slidesCount = Math.ceil(displayUsers.length / cardsPerSlide);

  const currentSlideUsers = displayUsers.slice(
    currentSlide * cardsPerSlide,
    (currentSlide + 1) * cardsPerSlide,
  );

  // Условие для пролистывания
  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < slidesCount - 1;

  const handlePrevSlide = () => {
    if (canGoPrev) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleNextSlide = () => {
    if (canGoNext) {
      setCurrentSlide((prev) => prev + 1);
    }
  };

  // Сброс слайда при изменении данных
  useEffect(() => {
    setCurrentSlide(0);
  }, [displayUsers.length]);

  if (usersLoading) {
    return (
      <section className={styles.container}>
        <h2 className={styles.title}>Похожие предложения</h2>
        <div className={styles.sliderWrapper}>
          <div className={styles.cardsContainer}>
            {Array.from({ length: cardsPerSlide }).map((_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Похожие предложения</h2>
      <div className={styles.cardsContainer}>
        {slidesCount > 1 && (
          <button
            className={`${styles.navButton} ${styles.leftButton} ${!canGoPrev ? styles.disabled : ""}`}
            onClick={handlePrevSlide}
            aria-label="Предыдущий слайд"
            type="button"
            disabled={!canGoPrev}
          >
            <img
              src={leftArrow}
              alt="Назад"
              className={`${styles.arrowIcon}  ${styles.leftArrow}`}
            />
          </button>
        )}
        {currentSlideUsers.map((user) => (
          <div key={user.id} className={styles.cardWrapper}>
            <Card user={user} cities={cities} isLoading={false} />
          </div>
        ))}
        {slidesCount > 1 && (
          <button
            className={`${styles.navButton} ${styles.rightButton} ${!canGoNext ? styles.disabled : ""}`}
            onClick={handleNextSlide}
            aria-label="Следующий слайд"
            type="button"
            disabled={!canGoNext}
          >
            <img src={rightArrow} alt="Вперед" className={styles.arrowIcon} />
          </button>
        )}
      </div>
    </section>
  );
};
