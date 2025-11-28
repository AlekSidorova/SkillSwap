export type TUser = {
  id: number;
  avatarUrl: string;
  name: string;
  cityId: number;
  age: string;
  gender: "Мужской" | "Женский";
  skillsCanTeach: TSkill[];
  images: string[];
  skillsWantToLearn: TSkill[];
};

export type TSkill = {
  id: number;
  name: string;
  description: string;
};
