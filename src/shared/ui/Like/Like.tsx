import { useState, type MouseEventHandler } from "react";
import styles from "./like.module.scss";
import type { ILikeProps } from "./like.type";

export const Like = (props: ILikeProps) => {
  const { idCard, currentLikeCount, onLikeToggle } = props;

  const [isLiked, setIsLiked] = useState(false);

  const toggleliked: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault();
    setIsLiked((prev) => !prev);
    onLikeToggle(idCard, likeCount);
  };

  const likeCount = isLiked ? currentLikeCount + 1 : currentLikeCount;

  return (
    <div className={styles.likeWrapper}>
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
