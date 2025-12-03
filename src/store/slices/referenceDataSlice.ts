import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import type { TCity, TCategory, TSubcategory } from "@/shared/types/types";
import type { RootState } from "@/store/store";
import { api } from "@/shared/api/api";

// Типы для состояния
type ReferenceDataState = {
  cities: TCity[];
  categories: TCategory[];
  subcategories: TSubcategory[];
  isLoading: boolean;
  error: string | null;
};

// Начальное состояние
const initialState: ReferenceDataState = {
  cities: [],
  categories: [],
  subcategories: [],
  isLoading: false,
  error: null,
};

// Асинхронный thunk для загрузки справочных данных
export const fetchReferenceData = createAsyncThunk(
  "referenceData/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [citiesResult, categoriesResult, subcategoriesResult] =
        await Promise.all([
          api.getCities(),
          api.getCategories(),
          api.getSubcategories(),
        ]);

      return {
        cities: citiesResult as TCity[],
        categories: categoriesResult as TCategory[],
        subcategories: subcategoriesResult as TSubcategory[],
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error
          ? error.message
          : "Ошибка загрузки справочных данных",
      );
    }
  },
);

// Slice
const referenceDataSlice = createSlice({
  name: "referenceData",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReferenceData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReferenceData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cities = action.payload.cities;
        state.categories = action.payload.categories;
        state.subcategories = action.payload.subcategories;
        state.error = null;
      })
      .addCase(fetchReferenceData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = referenceDataSlice.actions;

// Базовый селектор для состояния справочных данных
const selectReferenceDataState = (state: RootState) => state.referenceData;

// Мемоизированный селектор для получения всех справочных данных
export const selectReferenceData = createSelector(
  [selectReferenceDataState],
  (referenceData) => ({
    cities: referenceData.cities,
    categories: referenceData.categories,
    subcategories: referenceData.subcategories,
    isLoading: referenceData.isLoading,
  }),
);

export default referenceDataSlice.reducer;
