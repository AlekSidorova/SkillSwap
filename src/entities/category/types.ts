// Категории навыков
export type TCategory = {
  id: number; // уникальный идентификатор категории
  name: string; // название категории (например, «Музыка»)
};

// Подкатегории навыков
export type TSubcategory = {
  id: number; // уникальный идентификатор подкатегории
  categoryId: number; // ID категории
  name: string; // название подкатегории (например, «Гитара»)
};
