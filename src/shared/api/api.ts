import type {
  TUser,
  TCity,
  TSkill,
  TLike,
  TCategory,
  TSubcategory,
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  User,
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "@/shared/types/types";

// Конфигурация API из переменных окружения
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Класс ошибки API с информацией о статусе
export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

import { getCookie, setCookie, removeCookie } from "@/shared/lib/cookies";

// Функция для получения токена из cookies
const getToken = () => {
  return getCookie("accessToken") || "";
};

// Базовая функция для выполнения запросов
async function fetchApi<T>(
  url: string,
  options: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  // Если токен истек (403) и это не повторный запрос, пытаемся обновить токен
  if (res.status === 403 && !isRetry && url !== "/api/auth/refresh") {
    const refreshToken = localStorage.getItem("refreshToken");

    if (refreshToken) {
      try {
        const refreshResponse = await fetch(
          `${API_BASE_URL}/api/auth/refresh`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken }),
          },
        );

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          setCookie("accessToken", refreshData.accessToken);
          // Повторяем оригинальный запрос с новым токеном
          return fetchApi<T>(url, options, true);
        } else {
          // Refresh токен тоже истек - очищаем и редиректим
          removeCookie("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
        }
      } catch (err) {
        console.error("Ошибка обновления токена:", err);
      }
    }
  }

  if (!res.ok) {
    let errorMessage = res.statusText;
    let errorData: unknown;

    try {
      errorData = await res.json();
      if (errorData && typeof errorData === "object" && "error" in errorData) {
        errorMessage = (errorData as { error: string }).error;
      }
    } catch {
      // Если не удалось распарсить JSON, используем statusText
    }

    throw new ApiError(errorMessage, res.status, errorData);
  }

  const data = await res.json();
  return data;
}

export const api = {
  // ========== АВТОРИЗАЦИЯ ==========
  register: (body: RegisterRequest): Promise<AuthResponse> =>
    fetchApi<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body: LoginRequest): Promise<AuthResponse> =>
    fetchApi<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  refreshToken: (body: RefreshTokenRequest): Promise<RefreshTokenResponse> =>
    fetchApi<RefreshTokenResponse>("/api/auth/refresh", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getMe: (): Promise<User> => fetchApi<User>("/api/auth/me"),

  logout: (body: RefreshTokenRequest): Promise<{ message: string }> =>
    fetchApi<{ message: string }>("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  // ========== ПОЛЬЗОВАТЕЛИ ==========
  getUsers: (): Promise<TUser[]> => fetchApi<TUser[]>("/api/users"),

  getUser: (id: number): Promise<TUser> => fetchApi<TUser>(`/api/users/${id}`),

  updateUser: (id: number, data: Partial<TUser>): Promise<TUser> =>
    fetchApi<TUser>(`/api/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteUser: (id: number): Promise<void> =>
    fetchApi<void>(`/api/users/${id}`, {
      method: "DELETE",
    }),

  // ========== НАВЫКИ ==========
  getSkills: (params?: {
    userId?: number;
    subcategoryId?: number;
    type_of_proposal?: string;
  }): Promise<TSkill[]> => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append("userId", params.userId.toString());
    if (params?.subcategoryId)
      searchParams.append("subcategoryId", params.subcategoryId.toString());
    if (params?.type_of_proposal)
      searchParams.append("type_of_proposal", params.type_of_proposal);

    const query = searchParams.toString();
    return fetchApi<TSkill[]>(`/api/skills${query ? `?${query}` : ""}`);
  },

  getSkill: (id: number): Promise<TSkill> =>
    fetchApi<TSkill>(`/api/skills/${id}`),

  createSkill: (body: {
    subcategoryId: number;
    title: string;
    description: string;
    type_of_proposal: "offer" | "request";
    images?: string[];
  }): Promise<TSkill> =>
    fetchApi<TSkill>("/api/skills", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  updateSkill: (
    id: number,
    data: {
      title?: string;
      description?: string;
      subcategoryId?: number;
      type_of_proposal?: "offer" | "request";
      images?: string[];
    },
  ): Promise<TSkill> =>
    fetchApi<TSkill>(`/api/skills/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteSkill: (id: number): Promise<void> =>
    fetchApi<void>(`/api/skills/${id}`, {
      method: "DELETE",
    }),

  // ========== КАТЕГОРИИ ==========
  getCategories: (): Promise<TCategory[]> =>
    fetchApi<TCategory[]>("/api/categories"),

  getCategory: (id: number): Promise<TCategory> =>
    fetchApi<TCategory>(`/api/categories/${id}`),

  // ========== ПОДКАТЕГОРИИ ==========
  getSubcategories: (params?: {
    categoryId?: number;
  }): Promise<TSubcategory[]> => {
    if (params?.categoryId) {
      return fetchApi<TSubcategory[]>(
        `/api/subcategories?categoryId=${params.categoryId}`,
      );
    }
    return fetchApi<TSubcategory[]>("/api/subcategories");
  },

  getSubcategory: (id: number): Promise<TSubcategory> =>
    fetchApi<TSubcategory>(`/api/subcategories/${id}`),

  // ========== ГОРОДА ==========
  getCities: (): Promise<TCity[]> => fetchApi<TCity[]>("/api/cities"),

  getCity: (id: number): Promise<TCity> => fetchApi<TCity>(`/api/cities/${id}`),

  // ========== ЛАЙКИ ==========
  getLikes: (params?: {
    userId?: number;
    skillId?: number;
  }): Promise<TLike[]> => {
    const searchParams = new URLSearchParams();
    if (params?.userId) searchParams.append("userId", params.userId.toString());
    if (params?.skillId)
      searchParams.append("skillId", params.skillId.toString());

    const query = searchParams.toString();
    return fetchApi<TLike[]>(`/api/likes${query ? `?${query}` : ""}`);
  },

  getLike: (id: number): Promise<TLike> => fetchApi<TLike>(`/api/likes/${id}`),

  createLike: (body: { skillId: number }): Promise<TLike> =>
    fetchApi<TLike>("/api/likes", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  deleteLike: (id: number): Promise<void> =>
    fetchApi<void>(`/api/likes/${id}`, {
      method: "DELETE",
    }),

  deleteLikeBySkillId: (skillId: number): Promise<void> =>
    fetchApi<void>(`/api/likes?skillId=${skillId}`, {
      method: "DELETE",
    }),

  // ========== HEALTH CHECK ==========
  healthCheck: (): Promise<{ status: string; message: string }> =>
    fetchApi<{ status: string; message: string }>("/api/health"),
};
