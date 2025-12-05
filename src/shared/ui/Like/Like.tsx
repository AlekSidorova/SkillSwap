import { useState, useEffect, type MouseEventHandler } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { createLike, deleteLike } from "@entities/like/model/slice";
import { selectIsAuthenticated } from "@features/auth/model/slice";
import styles from "./like.module.scss";
import type { ILikeProps } from "./like.types";

export const Like = (props: ILikeProps) => {
  const {
    currentLikeCount,
    isLiked: initialIsLiked = false,
    userId,
    className = "",
  } = props;
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [likeCount, setLikeCount] = useState(currentLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  // Синхронизируем состояние с пропсами
  useEffect(() => {
    setLikeCount(currentLikeCount);
    setIsLiked(initialIsLiked);
  }, [currentLikeCount, initialIsLiked]);

  const toggleliked: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.preventDefault();

    if (isLoading) return;

    // Если пользователь не авторизован, не позволяем ставить лайки
    if (!isAuthenticated) {
      // TODO: переадресация на страницу авторизации
      return;
    }

    setIsLoading(true);
    const newIsLike = !isLiked;

    try {
      if (newIsLike) {
        await dispatch(createLike({ toUserId: userId })).unwrap();
        setLikeCount(likeCount + 1);
      } else {
        await dispatch(deleteLike(userId)).unwrap();
        setLikeCount(likeCount - 1);
      }
      setIsLiked(newIsLike);
      props.onLikeToggle?.(newIsLike ? likeCount + 1 : likeCount - 1);
    } catch (error) {
      console.error("Ошибка при изменении лайка:", error);
      // Откатываем изменения при ошибке
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${styles.likeWrapper} ${className}`}>
      <span
        className={`${styles.likeCount} ${isLiked && styles.likeCountActive}`}
      >
        {likeCount}
      </span>
      <button
        className={`${styles.likeButton} ${isLiked && styles.likeActive}`}
        onClick={toggleliked}
        disabled={isLoading}
        aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
        aria-busy={isLoading}
      ></button>
    </div>
  );
};
