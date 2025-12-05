export type ILikeProps = {
  currentLikeCount: number;
  isLiked?: boolean; // лайкнул ли текущий пользователь
  userId: number; // ID пользователя, которому ставим лайк
  className?: string;
  onLikeToggle?: (likeCount: number) => void;
};
