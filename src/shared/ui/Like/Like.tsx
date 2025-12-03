import { useState, type MouseEventHandler } from "react";
import styles from "./like.module.scss";
import type { ILikeProps } from "./like.type";

export const Like = (props: ILikeProps) => {
  const { currentLikeCount, className = "" } = props;
  const [likeCount, setLikeCount] = useState(currentLikeCount);
  const [isLiked, setIsLiked] = useState(false);

  const toggleliked: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();

    const newIsLike = !isLiked;
    const newLikeCount = newIsLike ? likeCount + 1 : likeCount - 1;

    setIsLiked(newIsLike);
    setLikeCount(newLikeCount);

    // onLikeToggle(newLikeCount); // Функция которая будет писать актуальное кол-во лайков в стор, если будет такой функционал
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
        aria-label={isLiked ? "Убрать лайк" : "Поставить лайк"}
      ></button>
    </div>
  );
};
