export type ILikeProps = {
  currentLikeCount: number;
  className?: string;
  onLikeToggle?: (likeCount: number) => void;
};
