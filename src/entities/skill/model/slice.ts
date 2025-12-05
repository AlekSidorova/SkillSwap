import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TSkill } from "../types";
import type { RootState } from "@app/store/store";
import { api } from "@shared/api/api";

// Типы для состояния
type SkillsDataState = {
  skills: TSkill[];
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: SkillsDataState = {
  skills: [],
  isLoading: false,
  error: null,
};

// Асинхронный thunk для загрузки данных о навыках
export const fetchSkillsData = createAsyncThunk(
  "skillsData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const skills = await api.getSkills();
      return {
        skills: skills as TSkill[],
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки данных о навыках",
      );
    }
  },
);

// Slice
const skillsDataSlice = createSlice({
  name: "skillsData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkillsData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSkillsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.skills = action.payload.skills;
        state.error = null;
      })
      .addCase(fetchSkillsData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = skillsDataSlice.actions;

// Базовый селектор для состояния навыков
const selectSkillsDataState = (state: RootState) => state.skillsData;

// Мемоизированный селектор для получения всех данных о навыках
export const selectSkillsData = createSelector(
  [selectSkillsDataState],
  (skillsData) => ({
    skills: skillsData.skills,
    isLoading: skillsData.isLoading,
  }),
);

export const skillsDataReducer = skillsDataSlice.reducer;
