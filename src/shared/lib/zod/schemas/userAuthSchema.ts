import { z } from "zod";

export const emailSchema = z
  .string()
  .email({ message: "Введите корректный email адрес" })
  .min(1, { message: "Email обязателен для заполнения" });

export const passwordSchema = z
  .string()
  .min(8, { message: "Пароль должен содержать не менее 8 знаков" })
  .regex(/[A-Z]/, {
    message: "Пароль должен содержать хотя бы одну заглавную букву",
  })
  .regex(/[a-z]/, {
    message: "Пароль должен содержать хотя бы одну строчную букву",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().default(false),
});

export const signupStep1Schema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignupStep1Data = z.infer<typeof signupStep1Schema>;
