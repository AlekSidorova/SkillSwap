import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TUserLikesInfo } from "../types";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";

// Типы для состояния
type LikesState = {
  usersLikesInfo: Record<number, TUserLikesInfo>; // Map userId -> likes info
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: LikesState = {
  usersLikesInfo: {},
  isLoading: false,
  error: null,
};

// Асинхронный thunk для загрузки информации о лайках пользователей
export const fetchUsersLikesInfo = createAsyncThunk(
  "likes/fetchUsersInfo",
  async (userIds: number[], { rejectWithValue }) => {
    try {
      const likesInfo = await api.getUsersLikesInfo(userIds);
      return likesInfo;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки информации о лайках",
      );
    }
  },
);

// Создание лайка от текущего пользователя к другому пользователю
export const createLike = createAsyncThunk(
  "likes/createLike",
  async (params: { toUserId: number }, { rejectWithValue, dispatch }) => {
    try {
      await api.createLike({
        toUserId: params.toUserId,
      });
      // После создания лайка обновляем информацию о лайках этого пользователя
      await dispatch(fetchUserLikesInfo(params.toUserId));
      return params.toUserId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка создания лайка",
      );
    }
  },
);

// Удаление лайка
export const deleteLike = createAsyncThunk(
  "likes/deleteLike",
  async (toUserId: number, { rejectWithValue, dispatch }) => {
    try {
      await api.deleteLikeByUserId(toUserId);
      // После удаления лайка обновляем информацию о лайках этого пользователя
      await dispatch(fetchUserLikesInfo(toUserId));
      return toUserId;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Ошибка удаления лайка",
      );
    }
  },
);

// Загрузка информации о лайках одного пользователя
export const fetchUserLikesInfo = createAsyncThunk(
  "likes/fetchUserInfo",
  async (userId: number, { rejectWithValue }) => {
    try {
      const likesInfo = await api.getUserLikesInfo(userId);
      return likesInfo;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки информации о лайках",
      );
    }
  },
);

// Slice
const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsersLikesInfo.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUsersLikesInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновляем информацию о лайках для каждого пользователя
        action.payload.forEach((info) => {
          state.usersLikesInfo[info.userId] = info;
        });
        state.error = null;
      })
      .addCase(fetchUsersLikesInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserLikesInfo.fulfilled, (state, action) => {
        state.usersLikesInfo[action.payload.userId] = action.payload;
      })
      .addCase(fetchUserLikesInfo.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(createLike.fulfilled, () => {
        // Информация обновляется через fetchUserLikesInfo
      })
      .addCase(createLike.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteLike.fulfilled, () => {
        // Информация обновляется через fetchUserLikesInfo
      })
      .addCase(deleteLike.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = likesSlice.actions;

// Базовый селектор для состояния лайков
const selectLikesState = (state: RootState) => state.likes;

// Селектор для получения информации о лайках пользователя
export const selectUserLikesInfo = (userId: number) =>
  createSelector([selectLikesState], (likesData) => {
    return (
      likesData.usersLikesInfo[userId] || {
        userId,
        likesCount: 0,
        isLikedByCurrentUser: false,
      }
    );
  });

// Селектор для получения информации о лайках нескольких пользователей
export const selectUsersLikesInfo = (userIds: number[]) =>
  createSelector([selectLikesState], (likesData) => {
    return userIds.map((userId) => {
      return (
        likesData.usersLikesInfo[userId] || {
          userId,
          likesCount: 0,
          isLikedByCurrentUser: false,
        }
      );
    });
  });

// Селектор для проверки загрузки
export const selectLikesLoading = createSelector(
  [selectLikesState],
  (likesData) => likesData.isLoading,
);

export const likesReducer = likesSlice.reducer;
