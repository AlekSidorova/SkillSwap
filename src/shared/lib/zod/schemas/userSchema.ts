import { z } from "zod";

// Схема пользователя
export const userSchema = z.object({
  id: z.number().int().positive(),
  name: z
    .string()
    .min(2, "Имя должно быть не менее 2 символов")
    .max(50, "Имя не должно превышать 50 символов"),
  avatarUrl: z.string().url("Некорректный URL аватара").optional().nullable(),
  cityId: z.number().int().positive(),
  dateOfBirth: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), "Некорректная дата"),
  gender: z.enum(["M", "F", "O"]),
  dateOfRegistration: z.string().datetime(),
  lastLoginDatetime: z.string().datetime(),
});

export const usersArraySchema = z.array(userSchema);

// Схема для создания пользователя
export const createUserSchema = userSchema
  .omit({
    id: true,
    dateOfRegistration: true,
    lastLoginDatetime: true,
  })
  .extend({
    email: z.string().email("Некорректный email"),
    password: z
      .string()
      .min(8, "Пароль должен быть не менее 8 символов")
      .regex(/[A-Z]/, "Пароль должен содержать заглавную букву")
      .regex(/[a-z]/, "Пароль должен содержать строчную букву"),
  });

// Схема для обновления пользователя
export const updateUserSchema = createUserSchema.partial();
