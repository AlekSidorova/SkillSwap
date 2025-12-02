export type ILikeProps = {
  idCard: number;
  currentLikeCount: number;
  onLikeToggle: (id: number, likeCount: number) => void;
};
